import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { CSVService } from "@/services/csvService";
import { indexedDBService } from "@/services/indexedDB";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  Upload, 
  ArchiveRestore, 
  Shield, 
  Info, 
  Trash2,
  AlertTriangle 
} from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [clearing, setClearing] = useState(false);
  
  const { transactions, addTransaction, refreshTransactions } = useTransactions();
  const { toast } = useToast();

  const handleExportData = async () => {
    try {
      setExporting(true);
      CSVService.downloadCSV(transactions);
      toast({
        title: "Export successful",
        description: "Your transactions have been exported to CSV",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export data",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      const importedTransactions = await CSVService.importFromFile(file);
      
      for (const transaction of importedTransactions) {
        await addTransaction(transaction);
      }

      toast({
        title: "Import successful",
        description: `Imported ${importedTransactions.length} transactions`,
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import data",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
      event.target.value = ""; // Reset file input
    }
  };

  const handleClearAllData = async () => {
    try {
      setClearing(true);
      await indexedDBService.clearAllTransactions();
      await refreshTransactions();
      toast({
        title: "Data cleared",
        description: "All transactions have been deleted",
      });
    } catch (error) {
      toast({
        title: "Clear failed",
        description: error instanceof Error ? error.message : "Failed to clear data",
        variant: "destructive",
      });
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Data Export</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Export your transactions to CSV format for backup or analysis
            </p>
            <Button 
              onClick={handleExportData}
              disabled={exporting || transactions.length === 0}
              className="w-full"
              data-testid="button-export-data"
            >
              {exporting ? "Exporting..." : "Export to CSV"}
            </Button>
            {transactions.length === 0 && (
              <p className="text-xs text-muted-foreground">No transactions to export</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Data Import</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Import transactions from a CSV file to restore your data
            </p>
            <div className="relative">
              <Input
                type="file"
                accept=".csv"
                onChange={handleImportData}
                disabled={importing}
                className="cursor-pointer"
                data-testid="input-import-file"
              />
              {importing && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                  <span className="text-sm">Importing...</span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Supported format: CSV with Title, Amount, Date, Category, Notes columns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ArchiveRestore className="h-5 w-5" />
              <span>Auto ArchiveRestore</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Automatic backup settings (Coming soon)
            </p>
            <Button variant="outline" disabled className="w-full">
              Configure Auto ArchiveRestore
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              PIN & biometric lock settings (Coming soon)
            </p>
            <Button variant="outline" disabled className="w-full">
              Configure Security
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trash2 className="h-5 w-5" />
              <span>Clear All Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Permanently delete all transactions. This cannot be undone.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  disabled={clearing || transactions.length === 0}
                  className="w-full"
                  data-testid="button-clear-data"
                >
                  Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <span>Clear All Data</span>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all {transactions.length} transactions. 
                    This action cannot be undone. Make sure you have exported your data first.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-testid="button-cancel-clear">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleClearAllData}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    data-testid="button-confirm-clear"
                  >
                    {clearing ? "Clearing..." : "Clear All Data"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>About</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Personal Finance Tracker</p>
              <p className="text-xs text-muted-foreground">Version 1.0.0</p>
              <p className="text-xs text-muted-foreground">
                A simple, offline-first personal finance tracking app for managing your income and expenses.
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium">Features:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Offline functionality with local storage</li>
                <li>• 5 category tracking (Savings, Expenses, Debt, Needs, Wants)</li>
                <li>• CSV export and import</li>
                <li>• Monthly view and navigation</li>
                <li>• Search and filter transactions</li>
                <li>• Progressive Web App (PWA) support</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
