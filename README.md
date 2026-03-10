# Pixel Trivia Game 🕹️

這是一款使用 React (Vite) 撰寫的 **像素風 (Pixel Art) 闖關問答遊戲**，並結合 Google Apps Script 與 Google Sheets 作為無伺服器 (Serverless) 的題庫提供與成績記錄後端。

遊戲具有濃厚的 2000 年代街機風格 (Arcade Style)，結合了 CRT 螢幕掃描線特效、像素字體 (Press Start 2P) 以及隨機產生的像素關主圖片，帶給玩家復古有趣的遊戲體驗。

![Game Screenshot](./screenshot.png) <!-- (如果有截圖可放於此) -->

## 🌟 功能特色
*   **街機像素風 (Pixel Art UI)**：完整的自訂樣式、網頁掃描線特效與按鈕交互回饋。
*   **動態關主生成**：藉由 DiceBear API，遊戲中每一關都會面對隨機生成不同的像素風魔王。
*   **免佈署資料庫**：利用 Google Sheets 輕鬆管理題庫與自動記錄每位挑戰者的分數及挑戰次數。
*   **獨立前端架構**：使用輕量極速的 Vite 進行打包，即使沒有網路環境（或尚未設定 API），也能自動切換至展示用「斷線測試模式」進行試玩。

---

## 🚀 專案啟動指南 (前端)

### 1. 安裝系統環境 (Node.js & Git)
*   **Node.js**: 如果您的電腦尚未安裝 Node.js，請先至 [Node.js 官方網站](https://nodejs.org/zh-tw) 下載安裝 **LTS 版本**。
*   **Git**: 本專案使用 Git 進行版本控制與部署，請至 [Git 官網](https://git-scm.com/downloads) 下載並完成安裝。

### 2. 安裝依賴套件
開啟專案資料夾後，在終端機內執行以下指令以安裝所需模組（如果您已經安裝過可跳過）：
```bash
npm install
```

### 3. 啟動開發伺服器
同樣在終端機，執行以下指令：
```bash
npm run dev
```
啟動成功後，終端機會顯示一個如 `http://localhost:5173/` 的網址。只需透過瀏覽器開啟，即可開始測試您的遊戲！

---

## 🛠️ Google Sheets & Backend 佈署指南

為了讓遊戲能真實從您的題庫撈題並記錄成績，我們需要先配置 Google Sheets 作為資料庫，並部署 Apps Script 提供給 React 專案呼叫。

### 步驟 A. 建立 Google 試算表
建立一份新的 Google 試算表，請精準照著以下建立**兩個工作表 (Sheet)**：

1. **工作表「`題目`」**
   *   第一列標題需為：**`題號`**、**`題目`**、**`A`**、**`B`**、**`C`**、**`D`**、**`解答`**。 (解答務必在 G 欄)
   *   第二列開始為您的題庫資料填充。您可以直接複製以下 10 題範例貼上測試：

   | 題號 | 題目 | A | B | C | D | 解答 |
   |:---|:---|:---|:---|:---|:---|:---|
   | 1 | `React` 的作者是哪家公司？ | Google | Meta (Facebook) | Microsoft | Amazon | B |
   | 2 | HTML 中，什麼標籤用來顯示圖片？ | `<img>` | `<picture>` | `<figure>` | `<src>` | A |
   | 3 | CSS 中哪一個屬性用來設定背景顏色？ | color | background-color | bgcolor | back-color | B |
   | 4 | JavaScript 宣告變數時，哪一個是用來宣告常數（不可修改）？ | var | let | constant | const | D |
   | 5 | 下列哪一種檔案格式最適合用於透明背景的網頁圖片？ | JPG | BMP | PNG | TXT | C |
   | 6 | 第一個發明網頁瀏覽器並建立 WWW 的工程師是誰？ | Bill Gates | Steve Jobs | Tim Berners-Lee | Linus Torvalds | C |
   | 7 | 在像素遊戲 (Pixel Art) 中，小而方形的繪圖單位稱為什麼？ | Voxel | Pixel | Vector | Polygon | B |
   | 8 | SQL 是用來操作什麼的語言？ | 伺服器硬體 | 關聯式資料庫 | 網頁樣式 | 動畫特效 | B |
   | 9 | 什麼是 `API` 的全名？ | Advanced Program Interface | Application Programming Interface | Automated Protocol Integration | Action Protocol Interface | B |
   | 10 | 在網路中，表示「找不到網頁」的 HTTP 狀態碼是？ | 200 | 404 | 500 | 301 | B |

2. **工作表「`回答`」**
   *   第一列標題需為：**`ID`**、**`闖關次數`**、**`總分`**、**`最高分`**、**`第一次通關分數`**、**`花了幾次通關`**、**`最近遊玩時間`**。
   *   無需填入任何資料，系統將會在玩家挑戰後自動填入。

### 步驟 B. 部署 Apps Script 後端
1. 在剛剛建立好的 Google 試算表上方選單點選：「**擴充功能**」 -> 「**Apps Script**」。
2. 將本專案資料夾下的 `gas/Code.gs` 文件中的所有程式碼，**完全複製並貼上**覆蓋原本的指令碼編輯器當中，接著按下儲存。
3. 點擊右上方的「**部署**」 -> 「**新增部署作業**」。
4. 左側齒輪選擇「**網頁應用程式**」。
5. **設定如下**：
   *   說明：可以隨便填寫 (e.g. `v1.0`).
   *   執行身分 (Execute as)：**我 (您的信箱)**
   *   誰可以存取 (Who has access)：**所有人 (Anyone)**
6. 點擊授權並發佈。
7. 從成功畫面中，複製 **`網頁應用程式網址 (Web App URL)`**。這個網址將被作為後續設定前端的重要關鍵。

---

## ⚙️ 前端環境參數設定 (.env)

有了後端網址後，接著回到這個專案配置參數，讓前端知道如何與 Google Sheets 溝通：

1. 在專案的根目錄中，請參考 **`.env.example`** 檔。
2. 建立一個新的檔案命名為 **`.env`** (或是直接將 `.env.example` 複製一份並重新命名)。
3. 把內容依照您的實際情況填入：

```env
# Google Apps Script 佈署後獲得的 Web App URL
VITE_GOOGLE_APP_SCRIPT_URL="https://script.google.com/macros/s/.../exec"

# 過關門檻 (答對幾題算過關)
VITE_PASS_THRESHOLD=3

# 每一局遊戲要抽取的總題數
VITE_QUESTION_COUNT=5
```

> [!IMPORTANT]
> 修改了 `.env` 檔後，請務必重啟開發伺服器 (`npm run dev`)，否則新設定不會生效。

---

## 🌐 自動化部署 (GitHub Actions)

本專案已內建 GitHub Actions 流程，可以將您的遊戲自動部署至 GitHub Pages 分享給其他人。

### 第一階段：建立 GitHub 儲存庫 (Repository)

1.  登入您的 [GitHub 帳號](https://github.com/)。
2.  點擊網頁左側綠色的 **「Create repository」** 按鈕（或右上角的 **+** 號 -> **New repository**）。
3.  **Repository name**：輸入名稱（例如 `Pixel-game`）。
4.  其餘選項保持預設，直接拉到最下方點擊綠色的 **「Create repository」**。

### 第二階段：將程式碼上傳到 GitHub

在您的電腦專案資料夾下開啟終端機 (Terminal/PowerShell)，依序執行以下指令：

```bash
# 1. 初始化 Git 專案
git init

# 2. 將所有檔案加入暫存區
git add .

# 3. 提交變更
git commit -m "Initial commit"

# 4. 強制分支名稱為 main
git branch -M main

# 5. 設定遠端儲存庫位址 (請將 <帳號名稱> 換成您的 GitHub 帳號)
git remote add origin https://github.com/<帳號名稱>/Pixel-game.git

# 6. 上傳程式碼
git push -u origin main
```

### 第三階段：設定 Secrets 與 Pages 權限

程式碼上傳成功後，請回到 GitHub 網頁：

1.  **設定環境變數 (Secrets)**：
    *   進入專案頁面的 **Settings** > **Secrets and variables** > **Actions**。
    *   點擊 **New repository secret**，新增以下三個項目：
        *   `VITE_GOOGLE_APP_SCRIPT_URL`：您的 GAS 網址。
        *   `VITE_PASS_THRESHOLD`：過關題數（如 `3`）。
        *   `VITE_QUESTION_COUNT`：抽取題數（如 `5`）。

2.  **開啟 Pages 來源**：
    *   進入專案頁面的 **Settings** > **Pages**。
    *   在 **Build and deployment** > **Source** 下拉選單選擇 **「GitHub Actions」**。

3.  **查看部署成果**：
    *   點擊 GitHub 頂端的 **Actions** 分頁，可以看到名為 `Deploy to GitHub Pages` 的流程正在跑（顯示黃色圈圈）。
    *   跑完變成綠色勾勾後，點進去即可看到您的遊戲網址。

---

## 🎨 專案結構簡略說明
... (略)
