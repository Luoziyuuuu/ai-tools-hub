# 🤖 AI Tools Hub 2026 (AI 工具導航站) + 智能客服小智

> 精選 2026 最新最強大的人工智慧工具導航站，涵蓋對話、寫作、繪圖、程式開發、影音創作與辦公效率工具。右下角內建基於 **Google Apps Script** 與 **OpenRouter (Claude Haiku)** 的智能客服小機器人。

🌐 **線上公開網址 (Live Website)**:  
👉 [https://luoziyuuuu.github.io/ai-tools-hub/](https://luoziyuuuu.github.io/ai-tools-hub/)

📦 **GitHub 原始碼庫**:  
👉 [https://github.com/Luoziyuuuu/ai-tools-hub](https://github.com/Luoziyuuuu/ai-tools-hub)

---

## 🤖 右下角智能客服（小智）架構說明

- **視覺外觀**：完全使用純 SVG 程式代碼繪製可愛小機器人大頭，具備眨眼動效與在線燈號。
- **前端介面**：嵌入 GitHub Pages 靜態頁面，支援自訂提問、快捷問題按鈕、思考動效與 Markdown 排版。
- **後端架構**：Google Apps Script (GAS) Web App (`Code.gs`)。
- **大腦模型**：OpenRouter API (`anthropic/claude-haiku-5.5` / `anthropic/claude-3.5-haiku`)。

---

## 🛠️ Google Apps Script (GAS) 建立與部署教學

請按照以下步驟完成您的後端建置：

### 第一步：建立 Google Apps Script 專案
1. 開啟瀏覽器造訪 [Google Apps Script 官網](https://script.google.com/)。
2. 點擊左上角 **「+ 新專案」**。
3. 將專案名稱重新命名為：`AI Tools Hub 客服後端`。

### 第二步：貼入後端程式碼
1. 將編輯器內原有的程式碼清空。
2. 開啟本專案內的 [`Code.gs`](./Code.gs) 檔案，複製全部內容並貼上。
3. 程式碼開頭請填入您的 OpenRouter API 金鑰：
   ```javascript
   const OPENROUTER_API_KEY = "YOUR_OPENROUTER_API_KEY_HERE";
   const MODEL_NAME = "anthropic/claude-haiku-5.5";
   ```
4. 點擊上方磁碟圖示 **「儲存專案」**（或按 `Ctrl + S`）。

### 第三步：部署為網頁應用程式 (Web App)
1. 點擊右上角藍色按鈕 **「部署」** ➔ 選擇 **「新增部署作業」**。
2. 點擊左側齒輪 ⚙️ 圖示，選擇 **「網頁應用程式」**。
3. 設定參數如下（**非常重要！**）：
   - **說明**：`v1.0 AI客服`
   - **以誰的身分執行**：選擇 **「我 (您的 Google 帳號)」**
   - **誰可以存取**：選擇 **「所有人 (Anyone)」** *(若沒選所有人，前端網頁會被權限阻擋)*
4. 點擊 **「部署」**。首次部署會跳出授權視窗，請點擊 **「進階」** ➔ **「前往 (不安全)」** ➔ **「允許」**。
5. 複製生成的 **網頁應用程式網址 (Web App URL)**（格式類似 `https://script.google.com/macros/s/AKfycb.../exec`）。

### 第四步：綁定至前端網站
1. 開啟您的線上網站：[https://luoziyuuuu.github.io/ai-tools-hub/](https://luoziyuuuu.github.io/ai-tools-hub/)。
2. 點擊右下角機器人按鈕打開聊天視窗。
3. 點擊右上角的 ⚙️ 齒輪按鈕，將複製的 GAS 網址貼入並點擊 **「儲存」**。
4. 現在您的機器人就正式具備 Claude Haiku 的即時思考大腦了！
