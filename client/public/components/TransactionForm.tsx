import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTransactionSchema, InsertTransaction, TransactionCategory } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { X } from "lucide-react";

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (transaction: InsertTransaction) => Promise<void>;
  initialData?: Partial<InsertTransaction>;
}

const categories: { value: TransactionCategory; label: string; icon: string; color: string }[] = [
  { value: "Saving", label: "Saving", icon: "savings", color: "bg-[hsl(142,71%,45%)]" },
  { value: "Expense", label: "Expense", icon: "remove_circle", color: "bg-[hsl(0,84%,60%)]" },
  { value: "Debt", label: "Debt", icon: "credit_card", color: "bg-[hsl(25,95%,53%)]" },
  { value: "Need", label: "Need", icon: "local_grocery_store", color: "bg-[hsl(221,83%,53%)]" },
  { value: "Want", label: "Want", icon: "shopping_bag", color: "bg-[hsl(271,81%,56%)]" },
];

export function TransactionForm({ open, onClose, onSubmit, initialData }: TransactionFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | null>(
    initialData?.category || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InsertTransaction>({
    resolver: zodResolver(insertTransactionSchema),
    defaultValues: {
      title: initialData?.title || "",
      amount: initialData?.amount || 0,
      date: initialData?.date || new Date().toISOString().split('T')[0],
      category: initialData?.category || "Expense",
      notes: initialData?.notes || "",
    },
  });

  // Reset form when initialData changes or modal opens
  useEffect(() => {
    if (open) {
      const formData = {
        title: initialData?.title || "",
        amount: initialData?.amount || 0,
        date: initialData?.date || new Date().toISOString().split('T')[0],
        category: initialData?.category || "Expense",
        notes: initialData?.notes || "",
      };
      form.reset(formData);
      setSelectedCategory(initialData?.category || null);
    }
  }, [open, initialData, form]);

  const handleSubmit = async (data: InsertTransaction) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      form.reset();
      setSelectedCategory(null);
      onClose();
    } catch (error) {
      console.error("Failed to submit transaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md mx-4 rounded-t-xl">
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b border-border">
          <DialogTitle className="text-lg font-semibold">
            {initialData ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-close-modal">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="p-4 space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter transaction title..." 
                      {...field} 
                      data-testid="input-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₹)</FormLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00"
                        className="pl-8"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        data-testid="input-amount"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {categories.slice(0, 4).map((category) => (
                          <button
                            key={category.value}
                            type="button"
                            className={`p-3 border border-border rounded-lg text-left hover:bg-muted transition-colors ${
                              field.value === category.value ? "bg-primary text-primary-foreground" : ""
                            }`}
                            onClick={() => {
                              field.onChange(category.value);
                              setSelectedCategory(category.value);
                            }}
                            data-testid={`button-category-${category.value.toLowerCase()}`}
                          >
                            <div className="flex items-center space-x-2">
                              <div className={`w-6 h-6 ${category.color} rounded flex items-center justify-center`}>
                                <span className="material-icons text-white text-sm">{category.icon}</span>
                              </div>
                              <span className="text-sm font-medium">{category.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        className={`w-full p-3 border border-border rounded-lg text-left hover:bg-muted transition-colors ${
                          field.value === "Want" ? "bg-primary text-primary-foreground" : ""
                        }`}
                        onClick={() => {
                          field.onChange("Want");
                          setSelectedCategory("Want");
                        }}
                        data-testid="button-category-want"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-[hsl(271,81%,56%)] rounded flex items-center justify-center">
                            <span className="material-icons text-white text-sm">shopping_bag</span>
                          </div>
                          <span className="text-sm font-medium">Want</span>
                        </div>
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} data-testid="input-date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add notes about this transaction..."
                      className="resize-none"
                      rows={3}
                      {...field}
                      data-testid="input-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-3 pt-4 border-t border-border">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1" 
                onClick={onClose}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isSubmitting}
                data-testid="button-save"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
