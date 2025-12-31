import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MonthSelector } from "@/components/MonthSelector";
import { CategoryIcon } from "@/components/CategoryIcon";
import { useBudget } from "@/context/BudgetContext";
import { getMonthlyStats, getCategoryStats, formatCurrency } from "@/utils/calculations";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const hebrewMonths = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

export default function Balance() {
  const navigate = useNavigate();
  const { transactions, categories } = useBudget();
  const [searchParams] = useSearchParams();
  
  const initialYear = searchParams.get("year") ? parseInt(searchParams.get("year")!) : new Date().getFullYear();
  const initialMonth = searchParams.get("month") ? parseInt(searchParams.get("month")!) : new Date().getMonth();
  
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const stats = getMonthlyStats(transactions, year, month);
  
  const incomeByCategory = useMemo(() => {
    return getCategoryStats(transactions, categories, year, month, "income")
      .sort((a, b) => b.total - a.total);
  }, [transactions, categories, year, month]);

  const expenseByCategory = useMemo(() => {
    return getCategoryStats(transactions, categories, year, month, "expense")
      .sort((a, b) => b.total - a.total);
  }, [transactions, categories, year, month]);

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.icon || "CircleDot";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">יתרה חודשית</h1>
            <p className="text-muted-foreground">
              {hebrewMonths[month]} {year}
            </p>
          </div>
        </div>
        <MonthSelector
          year={year}
          month={month}
          onChange={(y, m) => {
            setYear(y);
            setMonth(m);
          }}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card 
          className={cn(
            "gradient-income transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/20">
                <TrendingUp className="h-6 w-6 text-income-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-income-foreground opacity-90">סה״כ הכנסות</p>
                <p className="text-2xl font-bold text-income-foreground">{formatCurrency(stats.totalIncome)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={cn(
            "gradient-expense transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: "100ms" }}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/20">
                <TrendingDown className="h-6 w-6 text-expense-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-expense-foreground opacity-90">סה״כ הוצאות</p>
                <p className="text-2xl font-bold text-expense-foreground">{formatCurrency(stats.totalExpenses)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={cn(
            "gradient-balance transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: "200ms" }}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/20">
                <Wallet className="h-6 w-6 text-balance-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-balance-foreground opacity-90">יתרה</p>
                <p className="text-2xl font-bold text-balance-foreground">{formatCurrency(stats.balance)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdowns */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Income by Category */}
        <Card 
          className={cn(
            "transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: "300ms" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-income" />
              הכנסות לפי קטגוריה
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {incomeByCategory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">אין הכנסות בחודש זה</p>
            ) : (
              incomeByCategory.map((cat, index) => (
                <div 
                  key={cat.categoryId} 
                  className={cn(
                    "space-y-2 transition-all duration-500",
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  )}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CategoryIcon iconName={getCategoryIcon(cat.categoryId)} />
                      <span className="font-medium">{cat.categoryName}</span>
                    </div>
                    <div className="text-left">
                      <span className="font-bold text-income">{formatCurrency(cat.total)}</span>
                      <span className="text-muted-foreground text-sm mr-2">({cat.percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <Progress 
                    value={cat.percentage} 
                    className="h-2 bg-income/20"
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Expenses by Category */}
        <Card 
          className={cn(
            "transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: "350ms" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-expense" />
              הוצאות לפי קטגוריה
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {expenseByCategory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">אין הוצאות בחודש זה</p>
            ) : (
              expenseByCategory.map((cat, index) => (
                <div 
                  key={cat.categoryId} 
                  className={cn(
                    "space-y-2 transition-all duration-500",
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  )}
                  style={{ transitionDelay: `${450 + index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CategoryIcon iconName={getCategoryIcon(cat.categoryId)} />
                      <span className="font-medium">{cat.categoryName}</span>
                    </div>
                    <div className="text-left">
                      <span className="font-bold text-expense">{formatCurrency(cat.total)}</span>
                      <span className="text-muted-foreground text-sm mr-2">({cat.percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <Progress 
                    value={cat.percentage} 
                    className="h-2 bg-expense/20"
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}