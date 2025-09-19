import { type Transaction, type InsertTransaction } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Transaction CRUD operations
  getTransaction(id: string): Promise<Transaction | undefined>;
  getAllTransactions(): Promise<Transaction[]>;
  getTransactionsByMonth(month: string): Promise<Transaction[]>;
  getTransactionsByCategory(category: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: string): Promise<boolean>;
  searchTransactions(query: string): Promise<Transaction[]>;
}

export class MemStorage implements IStorage {
  private transactions: Map<string, Transaction>;

  constructor() {
    this.transactions = new Map();
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getTransactionsByMonth(month: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(t => t.date.startsWith(month))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getTransactionsByCategory(category: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(t => t.category === category)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: string, updates: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const existing = this.transactions.get(id);
    if (!existing) return undefined;

    const updated: Transaction = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.transactions.set(id, updated);
    return updated;
  }

  async deleteTransaction(id: string): Promise<boolean> {
    return this.transactions.delete(id);
  }

  async searchTransactions(query: string): Promise<Transaction[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.transactions.values())
      .filter(t => 
        t.title.toLowerCase().includes(lowercaseQuery) ||
        t.notes?.toLowerCase().includes(lowercaseQuery) ||
        t.category.toLowerCase().includes(lowercaseQuery)
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}

export const storage = new MemStorage();
