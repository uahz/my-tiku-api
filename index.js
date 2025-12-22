const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// 允许跨域（可选，方便前端调用）
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 读取题库文件（确保 tiku.txt 在项目根目录）
let questionBank = [];
try {
  const data = fs.readFileSync(path.join(__dirname, 'tiku.txt'), 'utf8');
  const lines = data.split('\n').filter(line => line.trim());
  for (const line of lines) {
    const [question, answer] = line.split('###').map(s => s.trim());
    if (question && answer) {
      questionBank.push({ question, answer });
    }
  }
  console.log(`✅ 成功加载 ${questionBank.length} 条题库数据`);
} catch (err) {
  console.error('❌ 无法读取 tiku.txt:', err.message);
  // 即使题库为空，服务也应启动（避免崩溃）
}

// 核心查询接口
app.get('/query', (req, res) => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ error: '缺少 title 参数' });
  }

  // 模糊匹配：包含关键词即可（你可根据需要改为精确匹配）
  const match = questionBank.find(item =>
    item.question.includes(title) || title.includes(item.question)
  );

  if (match) {
    res.json({ answer: match.answer });
  } else {
    res.json({ answer: '未找到答案' });
  }
});

// 健康检查（用于验证服务是否运行）
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    loadedQuestions: questionBank.length,
    timestamp: new Date().toISOString()
  });
});

// 启动服务（关键！）
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 题库 API 已启动，监听端口 ${PORT}`);
});