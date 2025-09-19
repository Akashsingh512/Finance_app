import { Transaction, InsertTransaction } from "@shared/schema";

export class CSVService {
  static exportToCSV(transactions: Transaction[]): string {
    const headers = ["ID", "Title", "Amount", "Date", "Category", "Notes", "Created At", "Updated At"];
    
    const csvContent = [
      headers.join(","),
      ...transactions.map(t => [
        t.id,
        `"${t.title.replace(/"/g, '""')}"`,
        t.amount,
        t.date,
        t.category,
        `"${(t.notes || "").replace(/"/g, '""')}"`,
        t.createdAt,
        t.updatedAt
      ].join(","))
    ].join("\n");

    return csvContent;
  }

  static downloadCSV(transactions: Transaction[], filename?: string): void {
    const csvContent = this.exportToCSV(transactions);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename || `transactions-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  static parseCSV(csvText: string): InsertTransaction[] {
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) throw new Error("CSV file must contain headers and at least one data row");

    const headers = lines[0].split(",").map(h => h.trim());
    const expectedHeaders = ["ID", "Title", "Amount", "Date", "Category", "Notes", "Created At", "Updated At"];
    
    // Check if this is our format or a simplified format
    const isOurFormat = expectedHeaders.every(h => headers.includes(h));
    
    const transactions: InsertTransaction[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = this.parseCSVLine(line);
      
      try {
        if (isOurFormat) {
          // Parse our full format
          const titleIndex = headers.indexOf("Title");
          const amountIndex = headers.indexOf("Amount");
          const dateIndex = headers.indexOf("Date");
          const categoryIndex = headers.indexOf("Category");
          const notesIndex = headers.indexOf("Notes");

          transactions.push({
            title: this.cleanValue(values[titleIndex]),
            amount: parseFloat(values[amountIndex]),
            date: values[dateIndex],
            category: this.cleanValue(values[categoryIndex]) as any,
            notes: this.cleanValue(values[notesIndex]) || undefined,
          });
        } else {
          // Try to parse simplified format (Title, Amount, Date, Category, Notes)
          if (values.length >= 4) {
            transactions.push({
              title: this.cleanValue(values[0]),
              amount: parseFloat(values[1]),
              date: values[2],
              category: this.cleanValue(values[3]) as any,
              notes: values[4] ? this.cleanValue(values[4]) : undefined,
            });
          }
        }
      } catch (error) {
        console.warn(`Skipping invalid row ${i + 1}:`, error);
      }
    }

    return transactions;
  }

  private static parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        values.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    
    values.push(current);
    return values;
  }

  private static cleanValue(value: string): string {
    return value?.replace(/^"(.*)"$/, "$1").trim() || "";
  }

  static async importFromFile(file: File): Promise<InsertTransaction[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const csvText = e.target?.result as string;
          const transactions = this.parseCSV(csvText);
          resolve(transactions);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  }
}
