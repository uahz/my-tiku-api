// index.js
const express = require('express');
const axios = require('axios'); // 用于调用 Qwen AI（稍后安装）

const app = express();
const PORT = process.env.PORT || 3000;

// 允许跨域（OCS 从浏览器调用需要）
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 静态题库（你可以后续扩展）
const STATIC_QUESTIONS = {
  "中国的首都是哪里？": { answer: "C", options: ["A. 上海", "B. 广州", "C. 北京", "D. 深圳"] },
  "牛顿第一定律的内容是？": { answer: "B", options: ["A. F=ma", "B. 物体保持静止或匀速直线运动", "C. 作用力与反作用力", "D. 能量守恒"] }
};

// 模拟 Qwen AI 调用（先用 mock，后续替换为真实 API）
async function callAI(question) {
  // TODO: 后续替换为真实 Qwen 调用
  return "AI暂未接入，请填入答案";
}

app.get('/query', async (req, res) => {
  const { title } = req.query;
  
  if (!title) {
    return res.json({ code: 1, msg: "缺少题目参数", data: {} });
  }

  const normalized = title.trim();
  
  // 1. 查静态题库
  if (STATIC_QUESTIONS[normalized]) {
    const data = STATIC_QUESTIONS[normalized];
    return res.json({
      code: 0,
      msg: "success",
      data: { question: normalized, answer: data.answer, options: data.options }
    });
  }

  // 2. 题库无结果 → 调 AI（目前 mock）
  const aiAnswer = await callAI(normalized);
  res.json({
    code: 0,
    msg: "AI生成",
    data: { question: normalized, answer: aiAnswer }
  });
});

// 健康检查
app.get('/', (req, res) => {
  res.send('✅ 题库API运行中！支持OCS调用。');
});

app.listen(PORT, () => {
  console.log(`🚀 服务启动在 http://localhost:${PORT}`);
});