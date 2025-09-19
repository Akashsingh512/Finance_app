import { Transaction } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  showEmpty?: boolean;
}

const categoryIcons = {
  Saving: "savings",
  Expense: "remove_circle", 
  Debt: "credit_card",
  Need: "local_grocery_store",
  Want: "shopping_bag",
};

const categoryColors = {
  Saving: "bg-[hsl(142,71%,45%)]",
  Expense: "bg-[hsl(0,84%,60%)]",
  Debt: "bg-[hsl(25,95%,53%)]",
  Need: "bg-[hsl(221,83%,53%)]",
  Want: "bg-[hsl(271,81%,56%)]",
};

const categoryTextColors = {
  Saving: "text-[hsl(142,71%,45%)]",
  Expense: "text-[hsl(0,84%,60%)]",
  Debt: "text-[hsl(25,95%,53%)]",
  Need: "text-[hsl(221,83%,53%)]",
  Want: "text-[hsl(271,81%,56%)]",
};

export function TransactionList({ transactions, onEdit, onDelete, showEmpty = true }: TransactionListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatAmount = (amount: number, category: string) => {
    const sign = category === "Saving" ? "+" : "-";
    return `${sign}₹${amount.toLocaleString()}`;
  };

  if (transactions.length === 0 && showEmpty) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-muted-foreground text-2xl">receipt_long</span>
          </div>
          <h4 className="text-lg font-medium text-foreground mb-2">No transactions found</h4>
          <p className="text-muted-foreground text-sm">Your transaction history will appear here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <div className="divide-y divide-border">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className="p-4 hover:bg-muted transition-colors"
            data-testid={`transaction-item-${transaction.id}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className={`w-10 h-10 ${categoryColors[transaction.category]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <span className="material-icons text-white text-sm">
                    {categoryIcons[transaction.category]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate" data-testid={`text-transaction-title-${transaction.id}`}>
                    {transaction.title}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid={`text-transaction-date-${transaction.id}`}>
                    {formatDate(transaction.date)}
                  </p>
                  {transaction.notes && (
                    <p className="text-xs text-muted-foreground truncate mt-1" data-testid={`text-transaction-notes-${transaction.id}`}>
                      {transaction.notes}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className={`font-semibold ${categoryTextColors[transaction.category]}`} data-testid={`text-transaction-amount-${transaction.id}`}>
                    {formatAmount(transaction.amount, transaction.category)}
                  </p>
                  <p className="text-xs text-muted-foreground" data-testid={`text-transaction-category-${transaction.id}`}>
                    {transaction.category}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" data-testid={`button-transaction-menu-${transaction.id}`}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(transaction)} data-testid={`button-edit-transaction-${transaction.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(transaction.id)}
                      className="text-destructive"
                      data-testid={`button-delete-transaction-${transaction.id}`}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
