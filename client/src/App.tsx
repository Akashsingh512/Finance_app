import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";
import { Home, Receipt, BarChart3, Settings as SettingsIcon, Wallet } from "lucide-react";

function BottomNavigation({ currentTab, onTabChange }: { currentTab: string; onTabChange: (tab: string) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
      <div className="flex">
        <button 
          className={`flex-1 py-3 px-4 flex flex-col items-center justify-center space-y-1 transition-colors ${
            currentTab === "home" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => onTabChange("home")}
          data-testid="nav-home"
        >
          <Home className="h-5 w-5" />
          <span className="text-xs font-medium">Home</span>
        </button>
        <button 
          className={`flex-1 py-3 px-4 flex flex-col items-center justify-center space-y-1 transition-colors ${
            currentTab === "transactions" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => onTabChange("transactions")}
          data-testid="nav-transactions"
        >
          <Receipt className="h-5 w-5" />
          <span className="text-xs font-medium">History</span>
        </button>
        <button 
          className={`flex-1 py-3 px-4 flex flex-col items-center justify-center space-y-1 transition-colors ${
            currentTab === "analytics" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => onTabChange("analytics")}
          data-testid="nav-analytics"
        >
          <BarChart3 className="h-5 w-5" />
          <span className="text-xs font-medium">Analytics</span>
        </button>
        <button 
          className={`flex-1 py-3 px-4 flex flex-col items-center justify-center space-y-1 transition-colors ${
            currentTab === "settings" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => onTabChange("settings")}
          data-testid="nav-settings"
        >
          <SettingsIcon className="h-5 w-5" />
          <span className="text-xs font-medium">Settings</span>
        </button>
      </div>
    </nav>
  );
}

function AppHeader() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-medium text-foreground">Personal Finance</h1>
          </div>
        </div>
      </div>
    </header>
  );
}

function App() {
  const [currentTab, setCurrentTab] = useState("home");

  const renderContent = () => {
    switch (currentTab) {
      case "home":
        return <Dashboard />;
      case "transactions":
        return <Transactions />;
      case "analytics":
        return (
          <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h4 className="text-lg font-medium text-foreground mb-2">Analytics Coming Soon</h4>
              <p className="text-muted-foreground text-sm">Charts and insights will be available here</p>
            </div>
          </div>
        );
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <AppHeader />
          {renderContent()}
          <BottomNavigation currentTab={currentTab} onTabChange={setCurrentTab} />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
