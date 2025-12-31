import { Transaction, MonthlyStats, CategoryStats, Category } from "@/types/budget";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export const getMonthlyStats = (
  transactions: Transaction[],
  year: number,
  month: number
): MonthlyStats => {
  const startDate = startOfMonth(new Date(year, month));
  const endDate = endOfMonth(new Date(year, month));

  const filtered = transactions.filter((t) => {
    const date = parseISO(t.date);
    return isWithinInterval(date, { start: startDate, end: endDate });
  });

  const totalIncome = filtered
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filtered
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
  };
};

export const getCategoryStats = (
  transactions: Transaction[],
  categories: Category[],
  year: number,
  month: number,
  type: "income" | "expense"
): CategoryStats[] => {
  const startDate = startOfMonth(new Date(year, month));
  const endDate = endOfMonth(new Date(year, month));

  const filtered = transactions.filter((t) => {
    const date = parseISO(t.date);
    return (
      t.type === type &&
      isWithinInterval(date, { start: startDate, end: endDate })
    );
  });

  const total = filtered.reduce((sum, t) => sum + t.amount, 0);

  const categoryTotals = new Map<string, number>();
  filtered.forEach((t) => {
    const current = categoryTotals.get(t.categoryId) || 0;
    categoryTotals.set(t.categoryId, current + t.amount);
  });

  const stats: CategoryStats[] = [];
  categoryTotals.forEach((categoryTotal, categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    stats.push({
      categoryId,
      categoryName: category?.name || "לא ידוע",
      total: categoryTotal,
      percentage: total > 0 ? (categoryTotal / total) * 100 : 0,
    });
  });

  return stats.sort((a, b) => b.total - a.total);
};

export const getCategoryStatsForRange = (
  transactions: Transaction[],
  categories: Category[],
  type: "income" | "expense",
  startDate: Date,
  endDate: Date
): CategoryStats[] => {
  const filtered = transactions.filter((t) => {
    const date = parseISO(t.date);
    return (
      t.type === type &&
      isWithinInterval(date, { start: startDate, end: endDate })
    );
  });

  const total = filtered.reduce((sum, t) => sum + t.amount, 0);

  const categoryTotals = new Map<string, number>();
  filtered.forEach((t) => {
    const current = categoryTotals.get(t.categoryId) || 0;
    categoryTotals.set(t.categoryId, current + t.amount);
  });

  const stats: CategoryStats[] = [];
  categoryTotals.forEach((categoryTotal, categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    stats.push({
      categoryId,
      categoryName: category?.name || "לא ידוע",
      total: categoryTotal,
      percentage: total > 0 ? (categoryTotal / total) * 100 : 0,
    });
  });

  return stats.sort((a, b) => b.total - a.total);
};

export const getMonthlyComparison = (
  transactions: Transaction[],
  monthsBack: number = 6,
  offset: number = 0
): { month: string; monthName: string; year: number; income: number; expenses: number }[] => {
  const result: { month: string; monthName: string; year: number; income: number; expenses: number }[] = [];
  const now = new Date();
  const hebrewMonths = ['ינו׳', 'פבר׳', 'מרץ', 'אפר׳', 'מאי', 'יונ׳', 'יול׳', 'אוג׳', 'ספט׳', 'אוק׳', 'נוב׳', 'דצמ׳'];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i - offset, 1);
    const stats = getMonthlyStats(
      transactions,
      date.getFullYear(),
      date.getMonth()
    );
    result.push({
      month: format(date, "MM/yyyy"),
      monthName: hebrewMonths[date.getMonth()],
      year: date.getFullYear(),
      income: stats.totalIncome,
      expenses: stats.totalExpenses,
    });
  }

  return result;
};

export const getYearlyComparison = (
  transactions: Transaction[],
  year: number
): { month: string; monthName: string; year: number; income: number; expenses: number }[] => {
  const result: { month: string; monthName: string; year: number; income: number; expenses: number }[] = [];
  const hebrewMonths = ['ינו׳', 'פבר׳', 'מרץ', 'אפר׳', 'מאי', 'יונ׳', 'יול׳', 'אוג׳', 'ספט׳', 'אוק׳', 'נוב׳', 'דצמ׳'];

  for (let i = 0; i < 12; i++) {
    const stats = getMonthlyStats(transactions, year, i);
    result.push({
      month: format(new Date(year, i, 1), "MM/yyyy"),
      monthName: hebrewMonths[i],
      year: year,
      income: stats.totalIncome,
      expenses: stats.totalExpenses,
    });
  }

  return result;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), "dd/MM/yyyy");
};