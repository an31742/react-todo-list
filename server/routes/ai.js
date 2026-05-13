const express = require("express");
const router = express.Router();
const axios = require("axios");

// 从环境变量获取配置
const AI_API_KEY = process.env.SILICONFLOW_API_KEY;
const AI_API_BASE_URL = process.env.SILICONFLOW_API_BASE_URL || "https://api.siliconflow.cn/v1";
const AI_MODEL = process.env.SILICONFLOW_API_MODEL || "Qwen/Qwen2.5-7B-Instruct";

router.post("/chat/stream", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  if (!AI_API_KEY) {
    return res.status(503).json({ error: "AI service not configured" });
  }

  try {
    // 设置响应头以支持 SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const response = await axios({
      method: "post",
      url: `${AI_API_BASE_URL}/chat/completions`,
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      data: {
        model: AI_MODEL,
        messages: [{ role: "user", content: message }],
        stream: true,
      },
      responseType: "stream",
    });

    response.data.on("data", (chunk) => {
      // 转发流数据
      res.write(chunk);
    });

    response.data.on("end", () => {
      res.end();
    });

    response.data.on("error", (err) => {
      console.error("Stream error:", err);
      res.write(`data: ${JSON.stringify({ error: "Stream error occurred" })}\n\n`);
      res.end();
    });
  } catch (error) {
    console.error("AI API Error:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Internal Server Error", 
      details: error.response?.data || error.message 
    });
  }
});

module.exports = router;
