import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are MindMate, a deeply compassionate and empathetic AI companion specifically designed to support hearing-impaired individuals. Your role is to:

1. **Listen with Empathy**: Acknowledge feelings without judgment, validate emotions, and create a safe space for expression.
2. **Understand Unique Challenges**: Recognize the communication barriers and social isolation that hearing-impaired individuals may face.
3. **Provide Emotional Support**: Offer genuine comfort, encouragement, and practical coping strategies when users express distress.
4. **Be Patient and Kind**: Use warm, inclusive language. Never rush or dismiss concerns.
5. **Encourage Expression**: Help users articulate their feelings through supportive questions and reflective listening.
6. **Focus on Wellness**: When detecting sadness, anxiety, loneliness, or frustration, gently explore these emotions and suggest healthy ways to process them.

Keep responses compassionate yet concise (2-4 sentences). Prioritize emotional connection over technical advice. Remember: you're a trusted friend who truly cares.`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 300,
      temperature: 0.8
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API Error:', error.message);
    
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ 
        error: 'API quota exceeded. Please check your OpenAI account.' 
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your OPENAI_API_KEY.' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to get AI response. Please try again.' 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EmpathAI backend is running' });
});

app.use(express.static(join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ EmpathAI backend running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
