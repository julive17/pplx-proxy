const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json({ limit: '4mb' }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Perplexity
app.post('/proxy', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return res.status(400).json({ error: 'Falta x-api-key' });
  try {
    const r = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
      body: JSON.stringify(req.body)
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// OpenAI
app.post('/proxy/openai', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return res.status(400).json({ error: 'Falta x-api-key' });
  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
      body: JSON.stringify(req.body)
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Claude
app.post('/proxy/claude', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return res.status(400).json({ error: 'Falta x-api-key' });
  try {
    const { model, messages, temperature, max_tokens } = req.body;
    const systemMsg = messages.find(m => m.role === 'system');
    const userMsgs  = messages.filter(m => m.role !== 'system');
    const body = {
      model: model || 'claude-sonnet-4-5',
      max_tokens: max_tokens || 2048,
      temperature: temperature || 0.2,
      messages: userMsgs,
      ...(systemMsg ? { system: systemMsg.content } : {})
    };
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });
    const data = await r.json();
    if (data.content && data.content[0]) {
      return res.status(r.status).json({
        choices: [{ message: { role: 'assistant', content: data.content[0].text } }]
      });
    }
    res.status(r.status).json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/', (req, res) => res.send('Proxy HDSAR OK'));
app.listen(process.env.PORT || 3000, () => console.log('Proxy listo'));
