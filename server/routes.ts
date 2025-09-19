import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, transactionCategories } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all transactions
  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Get transactions by month
  app.get("/api/transactions/month/:month", async (req, res) => {
    try {
      const { month } = req.params;
      const transactions = await storage.getTransactionsByMonth(month);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions for month" });
    }
  });

  // Get transactions by category
  app.get("/api/transactions/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      if (!transactionCategories.includes(category as any)) {
        return res.status(400).json({ message: "Invalid category" });
      }
      const transactions = await storage.getTransactionsByCategory(category);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions for category" });
    }
  });

  // Search transactions
  app.get("/api/transactions/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const transactions = await storage.searchTransactions(query);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to search transactions" });
    }
  });

  // Get single transaction
  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const transaction = await storage.getTransaction(id);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction" });
    }
  });

  // Create transaction
  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Update transaction
  app.put("/api/transactions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertTransactionSchema.partial().parse(req.body);
      const transaction = await storage.updateTransaction(id, validatedData);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update transaction" });
    }
  });

  // Delete transaction
  app.delete("/api/transactions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTransaction(id);
      if (!deleted) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete transaction" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
