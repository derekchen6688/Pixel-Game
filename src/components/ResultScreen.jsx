import React from 'react';

const ResultScreen = ({ scoreData, onRestart, userId }) => {
    if (!scoreData) return <div>NO DATA</div>;

    const { correctCount, totalScore, passed, threshold } = scoreData;

    return (
        <div>
            <h2>GAME OVER</h2>

            <div className={`question-box ${passed ? 'result-success' : 'result-fail'}`}>
                <h3>{passed ? 'STAGE CLEARED!' : 'MISSION FAILED'}</h3>
                <p>Player: {userId}</p>
                <p>Score: {totalScore !== undefined ? totalScore : (correctCount * 10)}</p>
                <p>Correct: {correctCount} / Threshold: {threshold}</p>

                {scoreData.highestScore !== undefined && (
                    <ul className="score-tally">
                        <li>BEST RECORD: {scoreData.highestScore}</li>
                        <li>ATTEMPTS: {scoreData.attemptCount}</li>
                    </ul>
                )}
            </div>

            <button onClick={onRestart}>PLAY AGAIN</button>
        </div>
    );
};

export default ResultScreen;
