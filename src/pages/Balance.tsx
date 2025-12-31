import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Wallet, Building2, Smartphone, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonthSelector } from "@/components/MonthSelector";
import { CategoryIcon } from "@/components/CategoryIcon";
import { useBudget } from "@/context/BudgetContext";
import { getMonthlyStats, getCategoryStats, formatCurrency } from "@/utils/calculations";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const hebrewMonths = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

// Static investments data for now
const INVESTMENTS = [
  {
    id: "1",
    name: "קניית מניות בנק הפועלים",
    provider: "בנק הפועלים",
    icon: Building2,
    amount: 15000,
    returnPercentage: 8.5,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "2",
    name: "תיק השקעות",
    provider: "Bit",
    icon: Smartphone,
    amount: 25000,
    returnPercentage: 12.3,
    color: "from-purple-500 to-purple-600",
  },
];

export default function Balance() {
  const navigate = useNavigate();
  const { transactions, categories } = useBudget();
  const [searchParams] = useSearchParams();
  
  const initialYear = searchParams.get("year") ? parseInt(searchParams.get("year")!) : new Date().getFullYear();
  const initialMonth = searchParams.get("month") ? parseInt(searchParams.get("month")!) : new Date().getMonth();
  
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("balance");

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

  const totalInvestments = INVESTMENTS.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">יתרה והשקעות</h1>
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="balance" className="gap-2">
            <Wallet className="h-4 w-4" />
            יתרה חודשית
          </TabsTrigger>
          <TabsTrigger value="investments" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            השקעות
          </TabsTrigger>
        </TabsList>

        <TabsContent value="balance" className="mt-6 space-y-6">
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
        </TabsContent>

        <TabsContent value="investments" className="mt-6 space-y-6">
          {/* Total Investments Summary */}
          <Card 
            className={cn(
              "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 transition-all duration-500",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-primary/20">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">סה״כ השקעות</p>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(totalInvestments)}</p>
                  </div>
                </div>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  הוסף השקעה
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Investments List */}
          <div className="grid gap-4 md:grid-cols-2">
            {INVESTMENTS.map((investment, index) => {
              const Icon = investment.icon;
              return (
                <Card 
                  key={investment.id}
                  className={cn(
                    "overflow-hidden transition-all duration-500 hover:shadow-lg hover:scale-[1.02] cursor-pointer group",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                  style={{ transitionDelay: `${100 + index * 100}ms` }}
                >
                  <div className={cn("h-2 bg-gradient-to-r", investment.color)} />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-3 rounded-xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110",
                          investment.color
                        )}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{investment.name}</h3>
                          <p className="text-sm text-muted-foreground">{investment.provider}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex items-end justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">סכום מושקע</p>
                        <p className="text-2xl font-bold">{formatCurrency(investment.amount)}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-muted-foreground">תשואה</p>
                        <p className={cn(
                          "text-xl font-bold",
                          investment.returnPercentage >= 0 ? "text-income" : "text-expense"
                        )}>
                          {investment.returnPercentage >= 0 ? "+" : ""}{investment.returnPercentage}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Investment Types Info */}
          <Card>
            <CardHeader>
              <CardTitle>סוגי השקעות</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">מניות בנקאיות</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    השקעה במניות דרך בנקים מסורתיים כמו בנק הפועלים, לאומי ופועלים
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">תיקי השקעות דיגיטליים</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    פלטפורמות דיגיטליות כמו Bit, Pepper ו-eToro לניהול השקעות
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}