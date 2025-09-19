import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthNavigationProps {
  currentMonth: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function MonthNavigation({ currentMonth, onPreviousMonth, onNextMonth }: MonthNavigationProps) {
  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <button 
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={onPreviousMonth}
          data-testid="button-previous-month"
        >
          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div className="text-center">
          <h2 className="text-lg font-medium" data-testid="text-current-month">
            {formatMonth(currentMonth)}
          </h2>
          <p className="text-sm text-muted-foreground">Current Month</p>
        </div>
        <button 
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={onNextMonth}
          data-testid="button-next-month"
        >
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
