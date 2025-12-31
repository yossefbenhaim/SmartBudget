import { Transaction, Category, DEFAULT_CATEGORIES } from "@/types/budget";

const TRANSACTIONS_KEY = "family_budget_transactions";
const CATEGORIES_KEY = "family_budget_categories";

// Bank transactions from imported data
const bankTransactions: Transaction[] = [
  {
    id: "bank-1",
    type: "expense",
    amount: 3800,
    date: "2025-12-29",
    categoryId: "bills",
    description: "שיק",
  },
  {
    id: "bank-2",
    type: "expense",
    amount: 500,
    date: "2025-12-29",
    categoryId: "transport",
    description: "העב' לאחר-נייד",
  },
  {
    id: "bank-3",
    type: "expense",
    amount: 8,
    date: "2025-12-28",
    categoryId: "bills",
    description: "מקס איט פיננסי",
  },
];

// Sample transactions for demo
const generateSampleTransactions = (): Transaction[] => {
  const now = new Date();
  const transactions: Transaction[] = [...bankTransactions];
  
  // Generate data for the last 8 months
  for (let monthOffset = 0; monthOffset < 8; monthOffset++) {
    const date = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Income - salary
    transactions.push({
      id: `salary-${year}-${month}`,
      type: "income",
      amount: 15000 + Math.floor(Math.random() * 2000),
      date: new Date(year, month, 10).toISOString().split('T')[0],
      categoryId: "salary",
      description: "משכורת חודשית",
    });
    
    // Occasional bonus
    if (Math.random() > 0.7) {
      transactions.push({
        id: `bonus-${year}-${month}`,
        type: "income",
        amount: 2000 + Math.floor(Math.random() * 3000),
        date: new Date(year, month, 15).toISOString().split('T')[0],
        categoryId: "bonus",
        description: "בונוס",
      });
    }
    
    // Expenses
    const expenseData = [
      { categoryId: "food", description: "סופר", minAmount: 800, maxAmount: 1500, count: 4 },
      { categoryId: "transport", description: "דלק", minAmount: 400, maxAmount: 800, count: 2 },
      { categoryId: "rent", description: "שכירות", minAmount: 4500, maxAmount: 5500, count: 1 },
      { categoryId: "bills", description: "חשבון חשמל", minAmount: 200, maxAmount: 500, count: 1 },
      { categoryId: "bills", description: "חשבון מים", minAmount: 100, maxAmount: 200, count: 1 },
      { categoryId: "entertainment", description: "מסעדה", minAmount: 150, maxAmount: 400, count: 2 },
      { categoryId: "health", description: "קופת חולים", minAmount: 100, maxAmount: 300, count: 1 },
      { categoryId: "shopping", description: "קניות", minAmount: 200, maxAmount: 600, count: 2 },
    ];
    
    expenseData.forEach(({ categoryId, description, minAmount, maxAmount, count }) => {
      for (let i = 0; i < count; i++) {
        const day = Math.floor(Math.random() * 28) + 1;
        transactions.push({
          id: `${categoryId}-${year}-${month}-${i}`,
          type: "expense",
          amount: minAmount + Math.floor(Math.random() * (maxAmount - minAmount)),
          date: new Date(year, month, day).toISOString().split('T')[0],
          categoryId,
          description: `${description}${count > 1 ? ` ${i + 1}` : ''}`,
        });
      }
    });
  }
  
  return transactions;
};

// Transactions
export const getTransactions = (): Transaction[] => {
  try {
    const stored = localStorage.getItem(TRANSACTIONS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.length > 0) return parsed;
    }
    // Initialize with sample data if empty
    const sampleData = generateSampleTransactions();
    saveTransactions(sampleData);
    return sampleData;
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