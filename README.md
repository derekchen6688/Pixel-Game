# Pixel Trivia Game 🕹️

這是一款使用 React (Vite) 撰寫的 **像素風 (Pixel Art) 闖關問答遊戲**，並結合 Google Apps Script 與 Google Sheets 作為無伺服器 (Serverless) 的題庫提供與成績記錄後端。

遊戲具有濃後的 2000 年代街機風格 (Arcade Style)，結合了 CRT 螢幕掃描線特效、像素字體 (Press Start 2P) 以及隨機產生的像素關主圖片，帶給玩家復古有趣的遊戲體驗。

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
> [!CAUTION]
> **絕對不要** 將 `.env` 檔案上傳到 GitHub，裡面包含您的私密 API 網址。本專案已設定 `.gitignore` 來自動過濾它。

### 3. 安裝與執行
在終端機 (VS Code Terminal) 執行：
```bash
npm install
npm run dev
```

---

## 🛠️ Google Sheets & Backend 佈署指南

為了讓遊戲能正常運作，您需要配置試算表作為資料庫。

### 步驟 A. 建立 Google 試算表
建立一份新的 Google 試算表，請精準建立以下**兩個工作表 (Sheet)**：

1. **工作表「`題目`」**
   * 第一列標題需為：**`題號`**、**`題目`**、**`A`**、**`B`**、**`C`**、**`D`**、**`解答`**。

   | 題號 | 題目 | A | B | C | D | 解答 |
   |:---|:---|:---|:---|:---|:---|:---|
   | 1 | 範例題目 1？ | 選項 A | 選項 B | 選項 C | 選項 D | B |

2. **工作表「`回答`」**
   * 第一列標題需為：**`ID`**、**`闖關次數`**、**`總分`**、**`最高分`**、**`第一次通關分數`**、**`花了幾次通關`**、**`最近遊玩時間`**。 (系統會自動填入，保持第一列標題即可)

### 步驟 B. 部署 Apps Script
1. 在試算表點選：「**擴充功能**」 -> 「**Apps Script**」。
2. 將本專案 `gas/Code.gs` 內容覆蓋貼上。
3. 點擊 **「部署」** -> **「新增部署作業」**，類型選擇 **「網頁應用程式」**。
4. **設定**：執行身分為「我」，誰可以存取為「所有人」。
5. 部署後，複製獲得的 **`Web App URL`**。

---

## 🌐 自動化部署至 GitHub Pages (完整流程)

本專案已設定好 GitHub Actions，當您將程式碼推送到 GitHub 時，系統會自動編譯並發布遊戲。

### 第一階段：在 GitHub 建立儲存庫 (Repository)

1.  登入您的 [GitHub](https://github.com/) 帳號。
2.  點擊網頁左側綠色的 **「Create repository」** 按鈕（或右上角 **+** 號下方的 **New repository**）。
3.  **Repository name**：輸入 `Pixel-Game`。
4.  **重要建議 (避免衝突)**：
    *   **Visibility**: 選擇 **Public**。
    *   **Add README / .gitignore / License**: 全部保持 **不勾選 (None/Off)**。
5.  點擊最下方的綠色按鈕 **「Create repository」**。

### 第二階段：將程式碼從電腦上傳到 GitHub

在 VS Code 終端機中，依序輸入以下指令：

```bash
# 1. 初始化
git init

# 2. 加入檔案
git add .

# 3. 提交變更
git commit -m "Initial commit with deployment workflows"

# 4. 強制分支名稱為 main
git branch -M main

# 5. 連接遠端位址 (請將 derekchen6688 換成您的帳號)
git remote add origin https://github.com/derekchen6688/Pixel-Game.git

# 6. 上傳程式碼
git push -u origin main
```

### 第三階段：GitHub 網頁後台設定 (Secrets & Pages)

上傳完成後，請回到 GitHub 網頁進到您的專案：

#### 1. 設定加密變數 (Secrets)
> 這是為了讓線上自動編譯時能讀取到 API。

請依照以下步驟 **重複執行 3 次** (分別建立三個不同的變數)：

1. 點擊上方的 **「⚙️ Settings」** (通常在導覽列最右邊)。
2. 在左側選單往下找 **Security** 分類，點選 **「Secrets and variables」** -> **「Actions」**。
3. 點擊綠色的 **「New repository secret」** 按鈕。
4. **依序新增以下三個項目**，每次填寫完請按 **Add secret** 存檔：

| 順序 | Name (填入項目名稱) | Secret (填入對應的內容) |
| :--- | :--- | :--- |
| **第 1 個** | `VITE_GOOGLE_APP_SCRIPT_URL` | 您的 Google Apps Script 後端網址 |
| **第 2 個** | `VITE_PASS_THRESHOLD` | 過關題數 (例如填 `3`) |
| **第 3 個** | `VITE_QUESTION_COUNT` | 每一輪抽取的總題數 (例如填 `5`) |

#### 2. 開啟 GitHub Pages 權限
1. 同樣在 **「⚙️ Settings」** 頁面。
2. 在左側選單點選 **「Pages」**。
3. 在 **Build and deployment** > **Source** 下拉選單中，選擇 **「GitHub Actions」**。

### 第四階段：如何線上遊玩 (GitHub Pages)

當上述步驟設定完成後，您可以透過以下兩種方式找到您的遊戲網址：

1.  **從專案首頁找到連結**：
    *   回到您的 **專案首頁 (Code 分頁)**。
    *   在右側側標籤往下找一個 **「Deployments」** 區塊。
    *   點擊 **`github-pages`** 旁邊的連結（或點進去選 **View deployment**）。
2.  **直接輸入網址**：
    您的遊戲網址固定格式如下 (請將 `<您的帳號>` 換成您的 GitHub ID)：
    👉 `https://<您的帳號>.github.io/Pixel-Game/`

> [!TIP]
> **為什麼打不開？**
> 請先檢查上方 **「Actions」** 分頁，必須看到名為 `Deploy to GitHub Pages` 的任務出現 **綠色勾勾 ✅**（代表編譯成功）後，連結才會生效。如果是黃色圈圈代表正在處理中，請耐心等候約 1 分鐘。

---

## 👨‍💻 技術堆疊
*   前台前端：React 18 + Vite
*   後端開發：Google Apps Script, Google Sheets
*   部署工具：GitHub Actions, GitHub Pages
