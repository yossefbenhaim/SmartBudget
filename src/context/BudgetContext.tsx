import React, { createContext, useContext, ReactNode } from "react";
import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from "@/hooks/useTransactions";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useCategories";
import { Transaction as DBTransaction, Category as DBCategory, TransactionType as DBTransactionType } from "@/types/database";

// Re-export TransactionType for backward compatibility
export type TransactionType = DBTransactionType;

// Legacy types for backward compatibility
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string;
  description?: string;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
}

interface BudgetContextType {
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  isLoading: boolean;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

// Helper: Convert DB transaction to legacy format
const dbToLegacyTransaction = (dbTx: DBTransaction & { category?: DBCategory | null }): Transaction => ({
  id: dbTx.id,
  type: dbTx.type,
  amount: Number(dbTx.amount),
  categoryId: dbTx.category_id || '',
  date: dbTx.transaction_date,
  description: dbTx.description || undefined,
  notes: dbTx.notes || undefined,
});

// Helper: Convert DB category to legacy format
const dbToLegacyCategory = (dbCat: DBCategory): Category => ({
  id: dbCat.id,
  name: dbCat.name,
  icon: dbCat.icon || '📦',
  type: dbCat.type,
});

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  // Fetch data from Supabase
  const { data: dbTransactions = [], isLoading: transactionsLoading } = useTransactions();
  const { data: dbCategories = [], isLoading: categoriesLoading } = useCategories();

  // Mutations
  const createTransaction = useCreateTransaction();
  const updateTransactionMutation = useUpdateTransaction();
  const deleteTransactionMutation = useDeleteTransaction();
  const createCategory = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  // Convert to legacy format for backward compatibility
  const transactions: Transaction[] = dbTransactions.map(dbToLegacyTransaction);
  const categories: Category[] = dbCategories.map(dbToLegacyCategory);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    createTransaction.mutate({
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description || null,
      notes: transaction.notes || null,
      transaction_date: transaction.date,
      category_id: transaction.categoryId || null,
    });
  };

  const updateTransaction = (transaction: Transaction) => {
    updateTransactionMutation.mutate({
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description || null,
      notes: transaction.notes || null,
      transaction_date: transaction.date,
      category_id: transaction.categoryId || null,
    });
  };

  const deleteTransaction = (id: string) => {
    deleteTransactionMutation.mutate(id);
  };

  const addCategory = (category: Omit<Category, "id">) => {
    createCategory.mutate({
      name: category.name,
      type: category.type,
      icon: category.icon,
      color: '#6366f1', // Default color
      is_active: true,
    });
  };

  const updateCategory = (category: Category) => {
    updateCategoryMutation.mutate({
      id: category.id,
      name: category.name,
      icon: category.icon,
    });
  };

  const deleteCategory = (id: string) => {
    deleteCategoryMutation.mutate(id);
  };

  const value: BudgetContextType = {
    transactions,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    isLoading: transactionsLoading || categoriesLoading,
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
};
