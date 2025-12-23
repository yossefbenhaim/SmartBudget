import { Transaction, Category } from "@/types/budget";
import { formatDate, formatCurrency } from "./calculations";

export const exportToCSV = (
  transactions: Transaction[],
  categories: Category[],
  filename: string = "transactions"
): void => {
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "לא ידוע";
  };

  const headers = ["תאריך", "סוג", "קטגוריה", "סכום", "תיאור"];
  
  const rows = transactions.map((t) => [
    formatDate(t.date),
    t.type === "income" ? "הכנסה" : "הוצאה",
    getCategoryName(t.categoryId),
    t.amount.toString(),
    t.description,
  ]);

  // Add BOM for Hebrew support
  const BOM = "\uFEFF";
  const csvContent =
    BOM +
    [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};