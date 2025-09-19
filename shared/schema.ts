import { z } from "zod";

export const transactionCategories = ["Saving", "Expense", "Debt", "Need", "Want"] as const;
export type TransactionCategory = typeof transactionCategories[number];

export const transactionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  amount: z.number().positive("Amount must be positive"),
  date: z.string(), // ISO date string
  category: z.enum(transactionCategories),
  notes: z.string().optional(),
  createdAt: z.string(), // ISO date string
  updatedAt: z.string(), // ISO date string
});

export const insertTransactionSchema = transactionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Transaction = z.infer<typeof transactionSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

// Category summary type
export type CategorySummary = {
  category: TransactionCategory;
  total: number;
  count: number;
};

// Monthly summary type
export type MonthlySummary = {
  month: string; // YYYY-MM format
  netBalance: number;
  categories: CategorySummary[];
  totalTransactions: number;
};
