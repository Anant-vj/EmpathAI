import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

export const chatSessions = pgTable('chat_sessions', {
  id: serial('id').primaryKey(),
  userId: text('user_id'),
  personality: text('personality').default('listener'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  sessionId: integer('session_id').references(() => chatSessions.id),
  role: text('role').notNull(),
  content: text('content').notNull(),
  timestamp: timestamp('timestamp').defaultNow(),
  hasCrisis: boolean('has_crisis').default(false),
});

export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = typeof chatSessions.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;
