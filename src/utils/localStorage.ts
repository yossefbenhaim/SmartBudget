import { Transaction, Category, DEFAULT_CATEGORIES } from "@/types/budget";

const TRANSACTIONS_KEY = "family_budget_transactions";
const CATEGORIES_KEY = "family_budget_categories";

// Transactions
export const getTransactions = (): Transaction[] => {
  try {
    const stored = localStorage.getItem(TRANSACTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

export const addTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions();
  transactions.push(transaction);
  saveTransactions(transactions);
};

export const updateTransaction = (updated: Transaction): void => {
  const transactions = getTransactions();
  const index = transactions.findIndex((t) => t.id === updated.id);
  if (index !== -1) {
    transactions[index] = updated;
    saveTransactions(transactions);
  }
};

export const deleteTransaction = (id: string): void => {
  const transactions = getTransactions().filter((t) => t.id !== id);
  saveTransactions(transactions);
};

// Categories
export const getCategories = (): Category[] => {
  try {
    const stored = localStorage.getItem(CATEGORIES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with default categories
    saveCategories(DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategories = (categories: Category[]): void => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

export const addCategory = (category: Category): void => {
  const categories = getCategories();
  categories.push(category);
  saveCategories(categories);
};

export const updateCategory = (updated: Category): void => {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === updated.id);
  if (index !== -1) {
    categories[index] = updated;
    saveCategories(categories);
  }
};

export const deleteCategory = (id: string): void => {
  const categories = getCategories().filter((c) => c.id !== id);
  saveCategories(categories);
};

// Reset all data
export const resetAllData = (): void => {
  localStorage.removeItem(TRANSACTIONS_KEY);
  localStorage.removeItem(CATEGORIES_KEY);
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};