import { useState, useMemo } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { CategoryCard } from "@/components/CategoryCard";
import { MonthNavigation } from "@/components/MonthNavigation";
import { TransactionList } from "@/components/TransactionList";
import { TransactionForm } from "@/components/TransactionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InsertTransaction, Transaction } from "@shared/schema";

export default function Dashboard() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const { 
    transactions, 
    loading, 
    error, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
    getTransactionsByMonth, 
    getCategorySummary, 
    getNetBalance 
  } = useTransactions();

  const monthlyTransactions = useMemo(() => {
    return getTransactionsByMonth(currentMonth);
  }, [transactions, currentMonth, getTransactionsByMonth]);

  const categorySummary = useMemo(() => {
    return getCategorySummary(monthlyTransactions);
  }, [monthlyTransactions, getCategorySummary]);

  const netBalance = useMemo(() => {
    return getNetBalance(monthlyTransactions);
  }, [monthlyTransactions, getNetBalance]);

  const recentTransactions = useMemo(() => {
    return monthlyTransactions.slice(0, 5);
  }, [monthlyTransactions]);

  const handlePreviousMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    setCurrentMonth(`${prevYear}-${String(prevMonth).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    setCurrentMonth(`${nextYear}-${String(nextMonth).padStart(2, '0')}`);
  };

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
          <p className="text-muted-foreground">Loading...</p>
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
      {/* Month Navigation */}
      <MonthNavigation
        currentMonth={currentMonth}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />

      {/* Main Content */}
      <main className="pb-20">
        <div className="p-4 space-y-4">
          {/* Balance Summary */}
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">Net Balance</p>
              <p className={`text-3xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`} data-testid="text-net-balance">
                {netBalance >= 0 ? '+' : ''}₹{netBalance.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">This Month</p>
            </CardContent>
          </Card>

          {/* Category Cards */}
          <div className="grid grid-cols-2 gap-3">
            <CategoryCard
              summary={categorySummary.find(c => c.category === "Saving")!}
              icon="savings"
              description="Money saved"
            />
            <CategoryCard
              summary={categorySummary.find(c => c.category === "Expense")!}
              icon="remove_circle"
              description="Money spent"
            />
            <CategoryCard
              summary={categorySummary.find(c => c.category === "Debt")!}
              icon="credit_card"
              description="Borrowed money"
            />
            <CategoryCard
              summary={categorySummary.find(c => c.category === "Need")!}
              icon="local_grocery_store"
              description="Essential items"
            />
          </div>

          {/* Wants Card (Full width) */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-[hsl(271,81%,56%)] rounded-lg flex items-center justify-center">
                  <span className="material-icons text-white text-lg">shopping_bag</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Wants</p>
                  <p className="text-xs text-muted-foreground">Non-essential purchases</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-[hsl(271,81%,56%)]" data-testid="text-wants-total">
                    ₹{categorySummary.find(c => c.category === "Want")?.total.toLocaleString() || "0"}
                  </p>
                  <p className="text-xs text-muted-foreground" data-testid="text-wants-count">
                    {categorySummary.find(c => c.category === "Want")?.count || 0} transactions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="shadow-sm">
            <CardHeader className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-sm text-primary font-medium"
                  data-testid="button-view-all-transactions"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            
            {recentTransactions.length === 0 ? (
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-icons text-muted-foreground text-2xl">receipt_long</span>
                </div>
                <h4 className="text-lg font-medium text-foreground mb-2">No transactions yet</h4>
                <p className="text-muted-foreground text-sm mb-4">Start tracking your finances by adding your first transaction</p>
                <Button 
                  onClick={() => setShowTransactionForm(true)}
                  data-testid="button-add-first-transaction"
                >
                  Add Transaction
                </Button>
              </CardContent>
            ) : (
              <div className="divide-y divide-border">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-[hsl(${
                          transaction.category === "Saving" ? "142,71%,45%" :
                          transaction.category === "Expense" ? "0,84%,60%" :
                          transaction.category === "Debt" ? "25,95%,53%" :
                          transaction.category === "Need" ? "221,83%,53%" : "271,81%,56%"
                        })] rounded-lg flex items-center justify-center`}>
                          <span className="material-icons text-white text-sm">
                            {transaction.category === "Saving" ? "savings" :
                             transaction.category === "Expense" ? "remove_circle" :
                             transaction.category === "Debt" ? "credit_card" :
                             transaction.category === "Need" ? "local_grocery_store" : "shopping_bag"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{transaction.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold text-[hsl(${
                          transaction.category === "Saving" ? "142,71%,45%" :
                          transaction.category === "Expense" ? "0,84%,60%" :
                          transaction.category === "Debt" ? "25,95%,53%" :
                          transaction.category === "Need" ? "221,83%,53%" : "271,81%,56%"
                        })]`}>
                          {transaction.category === "Saving" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">{transaction.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
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
