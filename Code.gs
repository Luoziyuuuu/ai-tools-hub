/**
 * =====================================================================
 * AI Tools Hub - 智能客服後端 (Google Apps Script)
 * 透過 OpenRouter API 連接 Claude Haiku 提供即時智能問答服務
 * =====================================================================
 */

// 1. 在此處填入您的 OpenRouter API Key
const OPENROUTER_API_KEY = "YOUR_OPENROUTER_API_KEY_HERE";

// 2. 指定 OpenRouter 模型 (支援 anthropic/claude-haiku-5.5、anthropic/claude-3.5-haiku 或 openrouter/auto)
const MODEL_NAME = "anthropic/claude-haiku-5.5";

/**
 * 接收前端 GitHub 網頁傳送的 POST 訊息
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ success: false, error: "未收到任何資料內容" });
    }

    // 解析前端傳來的 JSON 資料 (包含使用者的問題與歷史上下文)
    const requestData = JSON.parse(e.postData.contents);
    const userMessage = (requestData.message || "").trim();
    const history = requestData.history || [];

    if (!userMessage) {
      return createJsonResponse({ success: false, error: "提問內容不可為空" });
    }

    // 智能客服系統提示詞 (包含 AI Tools Hub 完整背景與知識庫)
    const systemPrompt = `你是由「AI Tools Hub 2026」網站官方派駐的吉祥物兼智能客服「小蘿蔔 🥕」。
你的外型是一隻頭頂有可愛綠葉的元氣小蘿蔔，任務是親切、有禮貌、精準且專業地回答訪客關於本站與各類 AI 工具的所有問題。

【本站背景與核心收錄】：
- 官方名稱：AI Tools Hub 2026 (精選人工智慧工具導航站)
- 網站網址：https://luoziyuuuu.github.io/ai-tools-hub/
- 六大分類精選工具：
  1. 💬 對話與寫作：ChatGPT (全方位), Claude 3.7 (代碼與長文推理最佳), Google Gemini (多模態與Google生態), DeepSeek R1 (開源推理性價比之王), Perplexity AI (即時聯網查證)
  2. 💻 程式開發：Cursor (AI 編輯器首選), v0 by Vercel (前端UI網頁生成), GitHub Copilot (代碼補全伴侶), Bolt.new (瀏覽器全端開發)
  3. 🎨 圖像與視覺：Midjourney (頂級藝術生圖), Stable Diffusion (本機自由控制), Ideogram (海報字型設計), Flux.1 (真實手部細節)
  4. 🎬 影音創作：Runway Gen-3 (電影級運鏡), Suno AI (一鍵歌詞編曲成歌), ElevenLabs (逼真擬真語音), Pika Art (創意特效動畫)
  5. ⚡ 辦公效率：Gamma (一句話生成完整PPT), Notion AI (知識庫問答整理), ChatPDF (論文文檔秒讀), Manus AI (自主執行Agent)
- 站內核心特色功能：
  - ＋ 新增自訂 AI 工具：點擊頂部導航列「＋ 新增工具」或工具列表底部的「＋ 新增自訂 AI 工具」虛線卡片，即可輸入名稱、網址與介紹，即時收錄至個人網站清單中，隨時可收藏或刪除 🗑️！
  - 頂部搜尋欄：可輸入名稱、標籤（例如：#免費、#程式必備）或功能即時篩選。
  - 收藏功能：點擊工具卡片上的星星即可加入「我的收藏」（本機保存）。
  - 內建 Prompt 助手：位於頁面下方，可選取任務（代碼審查、社群文案、除錯、Midjourney 繪圖等）一鍵生成高品質提問詞。

【回答規範】：
1. 一律使用繁體中文（台灣繁體習慣用語）回答。
2. 語氣溫暖親切、活力活潑、專業、條理清晰，適當搭配生動 Emoji（如 🥕、✨、💡、🚀）。
3. 當訪客詢問工具推薦時，優先推薦本站收錄的優質工具並簡述特色與適用場合。
4. 當訪客詢問如何新增工具時，引導他們使用頁面上的「＋ 新增工具」功能。
5. 回答請保持重點分明、精簡扼要，避免過於冗長。`;

    // 組裝對話歷史記錄 (保留最近 8 輪避免超出 token)
    const messages = [
      { role: "system", content: systemPrompt }
    ];

    if (Array.isArray(history)) {
      history.slice(-8).forEach(item => {
        if (item.role && item.content) {
          messages.push({
            role: item.role,
            content: item.content
          });
        }
      });
    }

    // 加入當前使用者問題
    messages.push({ role: "user", content: userMessage });

    // 組裝請求 OpenRouter API 的負載資料
    const payload = {
      model: MODEL_NAME,
      messages: messages,
      reasoning: { enabled: true }
    };

    const options = {
      method: "post",
      contentType: "application/json",
      headers: {
        "Authorization": "Bearer " + OPENROUTER_API_KEY,
        "HTTP-Referer": "https://luoziyuuuu.github.io/ai-tools-hub/",
        "X-Title": "AI Tools Hub Customer Service Bot"
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    // 發送請求至 OpenRouter
    const response = UrlFetchApp.fetch("https://openrouter.ai/api/v1/chat/completions", options);
    const resText = response.getContentText();
    const json = JSON.parse(resText);

    // 成功取得回答
    if (json.choices && json.choices.length > 0) {
      const reply = json.choices[0].message.content;
      return createJsonResponse({
        success: true,
        reply: reply
      });
    } else if (json.error) {
      return createJsonResponse({
        success: false,
        error: "OpenRouter 錯誤: " + (json.error.message || JSON.stringify(json.error))
      });
    } else {
      return createJsonResponse({
        success: false,
        error: "未知的 API 回應格式"
      });
    }

  } catch (err) {
    return createJsonResponse({
      success: false,
      error: "執行異常: " + err.toString()
    });
  }
}

/**
 * 支援 GET 請求用於健康檢查確認服務在線
 */
function doGet(e) {
  return createJsonResponse({
    status: "online",
    service: "AI Tools Hub Customer Service Backend",
    timestamp: new Date().toISOString()
  });
}

/**
 * 統一格式化 JSON 輸出
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
