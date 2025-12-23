import { useState } from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { MonthSelector } from "@/components/MonthSelector";
import { useBudget } from "@/context/BudgetContext";
import {
  getMonthlyStats,
  getCategoryStats,
  getMonthlyComparison,
  formatCurrency,
} from "@/utils/calculations";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "hsl(250, 84%, 54%)",
  "hsl(280, 84%, 54%)",
  "hsl(200, 84%, 54%)",
  "hsl(170, 84%, 54%)",
  "hsl(30, 84%, 54%)",
  "hsl(340, 84%, 54%)",
  "hsl(60, 84%, 54%)",
  "hsl(120, 84%, 54%)",
];

export default function Dashboard() {
  const { transactions, categories } = useBudget();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  const stats = getMonthlyStats(transactions, year, month);
  const expensesByCategory = getCategoryStats(
    transactions,
    categories,
    year,
    month,
    "expense"
  );
  const monthlyComparison = getMonthlyComparison(transactions, 6);

  const pieData = expensesByCategory.map((item) => ({
    name: item.categoryName,
    value: item.total,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">עמוד הבית</h1>
          <p className="text-muted-foreground">סקירה כללית של התקציב</p>
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

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="סה״כ הכנסות"
          amount={stats.totalIncome}
          icon={TrendingUp}
          variant="income"
        />
        <StatCard
          title="סה״כ הוצאות"
          amount={stats.totalExpenses}
          icon={TrendingDown}
          variant="expense"
        />
        <StatCard
          title="יתרה"
          amount={stats.balance}
          icon={Wallet}
          variant="balance"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>הוצאות לפי קטגוריה</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent, x, y }) => (
                        <text
                          x={x}
                          y={y}
                          fill="#000000"
                          fontWeight="bold"
                          fontSize={14}
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          {`${name} (${(percent * 100).toFixed(0)}%)`}
                        </text>
                      )}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                אין הוצאות בחודש זה
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>הכנסות מול הוצאות (6 חודשים)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyComparison}>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₪${value / 1000}k`} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Bar
                    dataKey="income"
                    name="הכנסות"
                    fill="hsl(142, 76%, 36%)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expenses"
                    name="הוצאות"
                    fill="hsl(0, 84%, 60%)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {expensesByCategory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>פירוט הוצאות לפי קטגוריה</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expensesByCategory.map((item, index) => (
                <div key={item.categoryId} className="flex items-center gap-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{item.categoryName}</span>
                      <span className="text-muted-foreground">
                        {formatCurrency(item.total)} ({item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}