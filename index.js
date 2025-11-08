import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { db } from './server/db.js';
import { chatSessions, chatMessages } from './shared/schema.js';
import { eq, desc } from 'drizzle-orm';

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

const PERSONALITIES = {
  listener: {
    name: 'Soft Listener 👂',
    prompt: `You are a gentle, patient listener who validates emotions without judgment. Use empathetic phrases like "I hear you", "That sounds really tough", and "Your feelings are valid". Focus on active listening and emotional validation.`
  },
  coach: {
    name: 'Encouraging Coach 💪',
    prompt: `You are an uplifting, motivational coach who inspires confidence and action. Use encouraging phrases like "You've got this!", "I believe in you", and "Let's tackle this together". Focus on building resilience and celebrating small wins.`
  },
  counselor: {
    name: 'Calm Counselor 🧘',
    prompt: `You are a mindful, grounding counselor who promotes inner peace and self-reflection. Use calming phrases like "Take a deep breath", "Let's explore that feeling", and "What does your inner voice say?". Focus on mindfulness and self-discovery.`
  }
};

app.post('/api/chat', async (req, res) => {
  try {
    const { message, personality = 'listener', sessionId } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const personalityConfig = PERSONALITIES[personality] || PERSONALITIES.listener;
    
    const basePrompt = `You are MindMate, a deeply compassionate and empathetic AI companion specifically designed to support hearing-impaired individuals. Your role is to:

1. **Listen with Empathy**: Acknowledge feelings without judgment, validate emotions, and create a safe space for expression.
2. **Understand Unique Challenges**: Recognize the communication barriers and social isolation that hearing-impaired individuals may face.
3. **Provide Emotional Support**: Offer genuine comfort, encouragement, and practical coping strategies when users express distress.
4. **Be Patient and Kind**: Use warm, inclusive language. Never rush or dismiss concerns.
5. **Encourage Expression**: Help users articulate their feelings through supportive questions and reflective listening.
6. **Focus on Wellness**: When detecting sadness, anxiety, loneliness, or frustration, gently explore these emotions and suggest healthy ways to process them.

${personalityConfig.prompt}

Keep responses compassionate yet concise (2-4 sentences). Prioritize emotional connection over technical advice. Remember: you're a trusted friend who truly cares.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: basePrompt
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

    if (sessionId) {
      try {
        await db.insert(chatMessages).values([
          {
            sessionId: parseInt(sessionId),
            role: 'user',
            content: message
          },
          {
            sessionId: parseInt(sessionId),
            role: 'assistant',
            content: aiResponse
          }
        ]);
      } catch (dbError) {
        console.error('Database save error:', dbError);
      }
    }

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

app.post('/api/sessions', async (req, res) => {
  try {
    const { userId, personality = 'listener' } = req.body;
    const [session] = await db.insert(chatSessions).values({ userId, personality }).returning();
    res.json(session);
  } catch (error) {
    console.error('Session create error:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

app.get('/api/sessions/:sessionId/messages', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, parseInt(sessionId)))
      .orderBy(chatMessages.timestamp);
    res.json(messages);
  } catch (error) {
    console.error('Messages fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
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
