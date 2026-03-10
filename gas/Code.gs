// Google Apps Script API endpoint
// Remember to Deploy as Web App -> Execute as Me -> Anyone (even anonymous) can access

const QUESTIONS_SHEET = "題目";
const ANSWERS_SHEET = "回答";
const SCORE_PER_QUESTION = 10;

function doGet(e) {
  const action = e.parameter.action;
  
  // Set CORS headers for GET requests
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  if (action === "getQuestions") {
    const count = parseInt(e.parameter.count || "5", 10);
    return jsonResponse({ status: 'success', questions: getQuestions(count) });
  }
  
  return jsonResponse({ status: 'error', message: 'Invalid GET action' });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === "submitScore") {
      return submitScore(data);
    }

    return jsonResponse({ status: 'error', message: 'Invalid POST action' });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

function getQuestions(count) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(QUESTIONS_SHEET);
  if (!sheet) return [];
  
  // Columns: 1:題號, 2:題目, 3:A, 4:B, 5:C, 6:D, 7:解答
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const questionRows = data.slice(1);
  
  // Randomize questions
  const shuffled = questionRows.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  
  return selected.map(row => ({
    no: row[0],
    question: row[1],
    A: row[2],
    B: row[3],
    C: row[4],
    D: row[5]
  }));
}

function submitScore(data) {
  const userId = data.userId;
  const userAnswers = data.answers || []; 
  const threshold = parseInt(data.threshold || 3, 10);
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const qSheet = ss.getSheetByName(QUESTIONS_SHEET);
  const aSheet = ss.getSheetByName(ANSWERS_SHEET);
  
  if (!qSheet || !aSheet) {
    return jsonResponse({ status: 'error', message: 'Required sheets not found' });
  }
  
  const qData = qSheet.getDataRange().getValues();
  const answerMap = {};
  for (let i = 1; i < qData.length; i++) {
    answerMap[qData[i][0].toString()] = qData[i][6].toString(); 
  }
  
  let correctCount = 0;
  userAnswers.forEach(ans => {
    if (answerMap[ans.no.toString()] === ans.selected.toString()) {
      correctCount++;
    }
  });
  
  const totalScore = correctCount * SCORE_PER_QUESTION;
  const passed = correctCount >= threshold;
  const now = new Date();
  
  const aData = aSheet.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 1; i < aData.length; i++) {
    if (aData[i][0].toString() === userId.toString()) {
      rowIndex = i + 1; 
      break;
    }
  }
  
  if (rowIndex !== -1) {
    // Existing user
    // Columns: 1:ID, 2:闖關次數, 3:總分, 4:最高分, 5:第一次通關分數, 6:花了幾次通關, 7:最近遊玩時間
    let attemptCount = parseInt(aSheet.getRange(rowIndex, 2).getValue() || 0, 10) + 1;
    let oldTotal = parseInt(aSheet.getRange(rowIndex, 3).getValue() || 0, 10);
    let oldHighest = parseInt(aSheet.getRange(rowIndex, 4).getValue() || 0, 10);
    let firstPassScore = aSheet.getRange(rowIndex, 5).getValue();
    let attemptsToPass = aSheet.getRange(rowIndex, 6).getValue();
    
    let newHighest = Math.max(oldHighest, totalScore);
    let newTotal = oldTotal + totalScore;
    
    aSheet.getRange(rowIndex, 2).setValue(attemptCount);
    aSheet.getRange(rowIndex, 3).setValue(newTotal);
    aSheet.getRange(rowIndex, 4).setValue(newHighest);
    aSheet.getRange(rowIndex, 7).setValue(now);
    
    if (passed && firstPassScore === "") {
        aSheet.getRange(rowIndex, 5).setValue(totalScore);
        aSheet.getRange(rowIndex, 6).setValue(attemptCount);
    }
    
    return jsonResponse({
      status: 'success',
      userId: userId,
      correctCount: correctCount,
      totalScore: totalScore,
      highestScore: newHighest,
      attemptCount: attemptCount
    });
    
  } else {
    // New user
    const attemptCount = 1;
    aSheet.appendRow([
      userId,
      attemptCount,
      totalScore,
      totalScore,
      passed ? totalScore : "",
      passed ? attemptCount : "",
      now
    ]);
    
    return jsonResponse({
      status: 'success',
      userId: userId,
      correctCount: correctCount,
      totalScore: totalScore,
      highestScore: totalScore,
      attemptCount: attemptCount
    });
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
