export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string; // ISO format
  categoryId: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionType | "both";
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface CategoryStats {
  categoryId: string;
  categoryName: string;
  total: number;
  percentage: number;
}

// Default categories
export const DEFAULT_CATEGORIES: Category[] = [
  { id: "salary", name: "משכורת", icon: "Wallet", type: "income" },
  { id: "bonus", name: "בונוס", icon: "Gift", type: "income" },
  { id: "investment", name: "השקעות", icon: "TrendingUp", type: "income" },
  { id: "food", name: "מזון", icon: "ShoppingCart", type: "expense" },
  { id: "transport", name: "רכב ותחבורה", icon: "Car", type: "expense" },
  { id: "rent", name: "שכירות/משכנתא", icon: "Home", type: "expense" },
  { id: "entertainment", name: "בילויים", icon: "Music", type: "expense" },
  { id: "bills", name: "חשבונות", icon: "FileText", type: "expense" },
  { id: "health", name: "בריאות", icon: "Heart", type: "expense" },
  { id: "shopping", name: "קניות", icon: "ShoppingBag", type: "expense" },
  { id: "education", name: "חינוך", icon: "GraduationCap", type: "expense" },
  { id: "other", name: "אחר", icon: "MoreHorizontal", type: "both" },
];