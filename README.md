# Pixel Trivia Game 🕹️

這是一款使用 React (Vite) 撰寫的 **像素風 (Pixel Art) 闖關問答遊戲**，並結合 Google Apps Script 與 Google Sheets 作為無伺服器 (Serverless) 的題庫提供與成績記錄後端。

遊戲具有濃厚的 2000 年代街機風格 (Arcade Style)，結合了 CRT 螢幕掃描線特效、像素字體 (Press Start 2P) 以及隨機產生的像素關主圖片，帶給玩家復古有趣的遊戲體驗。

![Game Screenshot](./screenshot.png) <!-- (如果有截圖可放於此) -->

---

## 🚀 專案啟動指南 (電腦本地開發)

### 1. 安裝系統環境 (Node.js & Git)
*   **Node.js**: 如果您的電腦尚未安裝 Node.js，請先至 [Node.js 官方網站](https://nodejs.org/zh-tw) 下載安裝 **LTS 版本**。
*   **Git**: 本專案使用 Git 進行版本控制與部署，請至 [Git 官網](https://git-scm.com/downloads) 下載並完成安裝。

### 2. 環境參數設定 (.env)
1. 在專案根目錄中，請參考 **`.env.example`** 檔。
2. 建立新檔案命名為 **`.env`**。
3. 把內容依照您的需求填入（例如您的 GAS 網址）。

### 3. 安裝與執行
在終端機 (VS Code Terminal) 執行：
```bash
npm install
npm run dev
```

---

## 🛠️ Google Sheets & Backend 佈署指南

...(請參考本專案 `gas/Code.gs` 內的註解或原本的說明)...

---

## 🌐 自動化部署至 GitHub Pages (完整流程)

本專案已設定好 GitHub Actions，當您將程式碼推送到 GitHub 時，系統會自動編譯並發布遊戲。

### 第一階段：在 GitHub 建立儲存庫 (Repository)

1.  登入您的 [GitHub](https://github.com/) 帳號。
2.  點擊左側綠色的 **「Create repository」** 按鈕。
3.  **Repository name**：輸入 `Pixel-Game`。
4.  **重要建議**：
    *   **Visibility**: 選擇 **Public**。
    *   **Add README**: 保持 **不要勾選** (Off)。
    *   **.gitignore / License**: 保持 **None**。
5.  點擊最下方的綠色按鈕 **「Create repository」**。

### 第二階段：將程式碼從電腦上傳到 GitHub

在 VS Code 終端機中，依序輸入以下指令：

```bash
# 1. 初始化
git init

# 2. 加入檔案 (會自動讀取我幫您寫好的 .gitignore)
git add .

# 3. 提交變更
git commit -m "Initial commit with deployment workflows"

# 4. 強制分支名稱為 main
git branch -M main

# 5. 連接遠端位址
git remote add origin https://github.com/derekchen6688/Pixel-Game.git

# 6. 上傳程式碼
git push -u origin main
```

### 第三階段：GitHub 網頁後台設定 (Secrets & Pages)

上傳完成後，請回到您的 GitHub 專案網頁，進行最後的關鍵設定：

#### 1. 設定加密變數 (Secrets)
> 這是為了讓線上自動編譯時能讀取到您的 API 網址。
1. 點擊上方的 **「⚙️ Settings」** (Insights 的右邊)。
2. 在左側選單捲動到 **Security** 區塊，點開 **「Secrets and variables」** -> **「Actions」**。
3. 點擊綠色的 **「New repository secret」**。
4. 依序新增這三個變數：
    *   **VITE_GOOGLE_APP_SCRIPT_URL**: 您的 GAS 網址。
    *   **VITE_PASS_THRESHOLD**: 過關題數 (如 `3`)。
    *   **VITE_QUESTION_COUNT**: 抽取題數 (如 `5`)。

#### 2. 開啟 GitHub Pages 權限
1. 同樣在 **「⚙️ Settings」** 頁面。
2. 在左側選單點選 **「Pages」**。
3. 在中間的 **Build and deployment** > **Source** 下拉選單中，選擇 **「GitHub Actions」**。

### 第四階段：查看結果
1. 點擊上方導覽列的 **「Actions」** 分頁。
2. 您會看到一個正在跑的 `Deploy to GitHub Pages` 工作。
3. 等它變成 **綠色勾勾** 後，點進去即可看到您的遊戲網址（網址格式為：`https://derekchen6688.github.io/Pixel-Game/`）。

---

## 👨‍💻 技術堆疊
*   前台前端：React 18 + Vite
*   後端開發：Google Apps Script, Google Sheets
*   部署工具：GitHub Actions, GitHub Pages
