import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Wallet, Building2, Smartphone, Landmark, PiggyBank, BarChart3, Shield, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MonthSelector } from "@/components/MonthSelector";
import { CategoryIcon } from "@/components/CategoryIcon";
import { useBudget } from "@/context/BudgetContext";
import { getMonthlyStats, getCategoryStats, formatCurrency } from "@/utils/calculations";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const hebrewMonths = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

// Investment recommendations
const INVESTMENT_RECOMMENDATIONS = [
  {
    id: "1",
    name: "קניית מניות בנק הפועלים",
    provider: "בנק הפועלים",
    icon: Building2,
    riskLevel: "בינוני",
    riskColor: "bg-yellow-500",
    expectedReturn: "6-10%",
    minInvestment: 1000,
    description: "השקעה במניות הבנק דרך חשבון המסחר בבנק הפועלים. מתאים למשקיעים לטווח בינוני-ארוך.",
    benefits: ["נזילות גבוהה", "דיבידנדים", "פיקוח בנק ישראל"],
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "2",
    name: "פתיחת תיק השקעות",
    provider: "Bit",
    icon: Smartphone,
    riskLevel: "נמוך-בינוני",
    riskColor: "bg-green-500",
    expectedReturn: "4-8%",
    minInvestment: 500,
    description: "תיק השקעות מנוהל באפליקציית Bit. מתאים למתחילים ולמי שרוצה ניהול אוטומטי.",
    benefits: ["ניהול אוטומטי", "עמלות נמוכות", "ממשק ידידותי"],
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "3",
    name: "קרן השתלמות",
    provider: "חברות ביטוח",
    icon: PiggyBank,
    riskLevel: "נמוך",
    riskColor: "bg-green-500",
    expectedReturn: "3-6%",
    minInvestment: 0,
    description: "חיסכון עם הטבות מס משמעותיות. ניתן למשיכה לאחר 6 שנים או לצורך השתלמות.",
    benefits: ["הטבות מס", "חיסכון לטווח ארוך", "ביטחון"],
    color: "from-emerald-500 to-emerald-600",
  },
  {
    id: "4",
    name: "קרנות סל (ETF)",
    provider: "בורסה לני״ע",
    icon: BarChart3,
    riskLevel: "בינוני",
    riskColor: "bg-yellow-500",
    expectedReturn: "5-12%",
    minInvestment: 100,
    description: "קרנות העוקבות אחרי מדדים כמו ת״א 125 או S&P 500. פיזור סיכונים אוטומטי.",
    benefits: ["פיזור רחב", "עמלות נמוכות", "שקיפות"],
    color: "from-orange-500 to-orange-600",
  },
  {
    id: "5",
    name: "אג״ח ממשלתי",
    provider: "בנק ישראל",
    icon: Landmark,
    riskLevel: "נמוך מאוד",
    riskColor: "bg-blue-500",
    expectedReturn: "2-4%",
    minInvestment: 1000,
    description: "איגרות חוב של מדינת ישראל. השקעה בטוחה עם תשואה קבועה.",
    benefits: ["בטיחות גבוהה", "תשואה קבועה", "נזילות"],
    color: "from-slate-500 to-slate-600",
  },
  {
    id: "6",
    name: "ביטוח מנהלים",
    provider: "חברות ביטוח",
    icon: Shield,
    riskLevel: "נמוך",
    riskColor: "bg-green-500",
    expectedReturn: "3-5%",
    minInvestment: 0,
    description: "חיסכון פנסיוני עם כיסוי ביטוחי. מתאים לשכירים ועצמאים.",
    benefits: ["כיסוי ביטוחי", "הטבות מס", "חיסכון לפנסיה"],
    color: "from-indigo-500 to-indigo-600",
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
          {/* Header */}
          <Card 
            className={cn(
              "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 transition-all duration-500",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-primary/20">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">המלצות השקעה</h2>
                  <p className="text-muted-foreground">אפשרויות השקעה מומלצות בהתאם לפרופיל הסיכון שלך</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Recommendations */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {INVESTMENT_RECOMMENDATIONS.map((investment, index) => {
              const Icon = investment.icon;
              return (
                <Card 
                  key={investment.id}
                  className={cn(
                    "overflow-hidden transition-all duration-500 hover:shadow-xl hover:scale-[1.02] cursor-pointer group",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                  style={{ transitionDelay: `${100 + index * 80}ms` }}
                >
                  <div className={cn("h-2 bg-gradient-to-r", investment.color)} />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-3 rounded-xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110",
                          investment.color
                        )}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold">{investment.name}</h3>
                          <p className="text-xs text-muted-foreground">{investment.provider}</p>
                        </div>
                      </div>
                      <Badge className={cn("text-white text-xs", investment.riskColor)}>
                        {investment.riskLevel}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {investment.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {investment.benefits.map((benefit, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">תשואה צפויה</p>
                        <p className="font-bold text-income">{investment.expectedReturn}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground">מינימום השקעה</p>
                        <p className="font-bold">{formatCurrency(investment.minInvestment)}</p>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full mt-4 gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <ExternalLink className="h-4 w-4" />
                      למידע נוסף
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Disclaimer */}
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground text-center">
                ⚠️ המידע המוצג הינו לצורכי מידע כללי בלבד ואינו מהווה ייעוץ השקעות. יש להתייעץ עם יועץ פיננסי מוסמך לפני קבלת החלטות השקעה.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}