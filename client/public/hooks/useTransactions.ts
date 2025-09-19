import { useState, useEffect } from "react";
import { Transaction, InsertTransaction, TransactionCategory, CategorySummary } from "@shared/schema";
import { indexedDBService } from "@/services/indexedDB";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await indexedDBService.getAllTransactions();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const addTransaction = async (transaction: InsertTransaction) => {
    try {
      const newTransaction: Transaction = {
        ...transaction,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await indexedDBService.addTransaction(newTransaction);
      await loadTransactions();
      return newTransaction;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add transaction");
      throw err;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<InsertTransaction>) => {
    try {
      const existing = transactions.find(t => t.id === id);
      if (!existing) throw new Error("Transaction not found");

      const updated: Transaction = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await indexedDBService.updateTransaction(updated);
      await loadTransactions();
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update transaction");
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await indexedDBService.deleteTransaction(id);
      await loadTransactions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete transaction");
      throw err;
    }
  };

  const getTransactionsByMonth = (month: string) => {
    return transactions.filter(t => t.date.startsWith(month));
  };

  const getCategorySummary = (transactionList: Transaction[]): CategorySummary[] => {
    const summaries: Record<TransactionCategory, CategorySummary> = {
      Saving: { category: "Saving", total: 0, count: 0 },
      Expense: { category: "Expense", total: 0, count: 0 },
      Debt: { category: "Debt", total: 0, count: 0 },
      Need: { category: "Need", total: 0, count: 0 },
      Want: { category: "Want", total: 0, count: 0 },
    };

    transactionList.forEach(transaction => {
      summaries[transaction.category].total += transaction.amount;
      summaries[transaction.category].count += 1;
    });

    return Object.values(summaries);
  };

  const getNetBalance = (transactionList: Transaction[]) => {
    return transactionList.reduce((balance, transaction) => {
      switch (transaction.category) {
        case "Saving":
          return balance + transaction.amount;
        case "Expense":
        case "Debt":
        case "Need":
        case "Want":
          return balance - transaction.amount;
        default:
          return balance;
      }
    }, 0);
  };

  const searchTransactions = async (query: string) => {
    try {
      const results = await indexedDBService.searchTransactions(query);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search transactions");
      return [];
    }
  };

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByMonth,
    getCategorySummary,
    getNetBalance,
    searchTransactions,
    refreshTransactions: loadTransactions,
  };
}
