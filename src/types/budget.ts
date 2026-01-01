export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string; // ISO format
  categoryId: string;
  description?: string;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
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