import { CategorySummary } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryCardProps {
  summary: CategorySummary;
  icon: string;
  description: string;
}

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

export function CategoryCard({ summary, icon, description }: CategoryCardProps) {
  const formatAmount = (amount: number) => {
    return `₹${Math.abs(amount).toLocaleString()}`;
  };

  return (
    <Card className="shadow-sm" data-testid={`card-category-${summary.category.toLowerCase()}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className={`w-10 h-10 ${categoryColors[summary.category]} rounded-lg flex items-center justify-center`}>
            <span className="material-icons text-white text-lg">{icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">{summary.category}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <p className={`text-lg font-semibold ${categoryTextColors[summary.category]}`} data-testid={`text-${summary.category.toLowerCase()}-total`}>
          {formatAmount(summary.total)}
        </p>
        <p className="text-xs text-muted-foreground" data-testid={`text-${summary.category.toLowerCase()}-count`}>
          {summary.count} transactions
        </p>
      </CardContent>
    </Card>
  );
}
