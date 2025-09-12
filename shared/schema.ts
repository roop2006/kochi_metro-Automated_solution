import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Documents table
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  department: text("department").notNull(),
  type: text("type").notNull(), // 'maintenance', 'safety', 'finance', 'hr'
  summary: text("summary").notNull(),
  content: text("content"), // Full document content
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  status: text("status").default('active'), // 'active', 'archived'
});

// Workflow items table
export const workflowItems = pgTable("workflow_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  currentStage: text("current_stage").notNull().default('submitted'), // 'submitted', 'review', 'approved', 'complete'
  priority: text("priority").notNull().default('normal'), // 'normal', 'urgent'
  department: text("department").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// QR codes table (for maintenance job cards)
export const qrCodes = pgTable("qr_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(), // QR code content
  title: text("title").notNull(),
  equipment: text("equipment").notNull(),
  status: text("status").notNull().default('pending'), // 'pending', 'in_progress', 'completed'
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Stats tracking table
export const stats = pgTable("stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metric: text("metric").notNull().unique(), // 'documents_processed', 'pending_approvals', etc.
  value: text("value").notNull(), // stored as text, parsed as needed
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Create insert schemas
export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
});

export const insertWorkflowItemSchema = createInsertSchema(workflowItems).omit({
  id: true,
  submittedAt: true,
  updatedAt: true,
});

export const insertQrCodeSchema = createInsertSchema(qrCodes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStatsSchema = createInsertSchema(stats).omit({
  id: true,
  updatedAt: true,
});

// Types
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type WorkflowItem = typeof workflowItems.$inferSelect;
export type InsertWorkflowItem = z.infer<typeof insertWorkflowItemSchema>;

export type QrCode = typeof qrCodes.$inferSelect;
export type InsertQrCode = z.infer<typeof insertQrCodeSchema>;

export type Stats = typeof stats.$inferSelect;
export type InsertStats = z.infer<typeof insertStatsSchema>;

// Search result type
export const searchResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  department: z.string(),
  date: z.string(),
  summary: z.string(),
  type: z.enum(['maintenance', 'safety', 'finance', 'hr']),
});
export type SearchResult = z.infer<typeof searchResultSchema>;
