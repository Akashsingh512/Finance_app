import { useState, useMemo } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionList } from "@/components/TransactionList";
import { TransactionForm } from "@/components/TransactionForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Plus } from "lucide-react";
import { InsertTransaction, Transaction, TransactionCategory } from "@shared/schema";

const categories: TransactionCategory[] = ["Saving", "Expense", "Debt", "Need", "Want"];

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | "All">("All");
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const { 
    transactions, 
    loading, 
    error, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
    searchTransactions 
  } = useTransactions();

  const filteredTransactions = useMemo(() => {
    let result = transactions;

    if (selectedCategory !== "All") {
      result = result.filter(t => t.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.notes?.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
      );
    }

    return result;
  }, [transactions, selectedCategory, searchQuery]);

  const handleAddTransaction = async (transaction: InsertTransaction) => {
    await addTransaction(transaction);
  };

  const handleEditTransaction = async (transaction: InsertTransaction) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, transaction);
      setEditingTransaction(null);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      await deleteTransaction(id);
    }
  };

  const openEditForm = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  const closeForm = () => {
    setShowTransactionForm(false);
    setEditingTransaction(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive mb-4">Error: {error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Search and Filter Bar */}
      <div className="bg-card border-b border-border p-4 sticky top-0 z-30">
        <div className="flex space-x-3 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search transactions..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-transactions"
            />
          </div>
          <Button variant="outline" size="icon" data-testid="button-filter-transactions">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Category Filter Chips */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === "All" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground hover:bg-border"
            }`}
            onClick={() => setSelectedCategory("All")}
            data-testid="button-filter-all"
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
              onClick={() => setSelectedCategory(category)}
              data-testid={`button-filter-${category.toLowerCase()}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <main className="p-4 pb-20">
        <TransactionList
          transactions={filteredTransactions}
          onEdit={openEditForm}
          onDelete={handleDeleteTransaction}
        />
      </main>

      {/* Floating Action Button */}
      <button 
        className="fixed bottom-20 right-4 z-50 bg-primary text-primary-foreground rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105"
        onClick={() => setShowTransactionForm(true)}
        data-testid="button-add-transaction-fab"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Transaction Form Modal */}
      <TransactionForm
        open={showTransactionForm}
        onClose={closeForm}
        onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
        initialData={editingTransaction || undefined}
      />
    </div>
  );
}
