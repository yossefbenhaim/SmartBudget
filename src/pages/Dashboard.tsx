import { useState, useEffect } from "react";
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
  Tooltip,
} from "recharts";
import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "next-themes";

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
  const { resolvedTheme } = useTheme();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const labelColor = mounted && resolvedTheme === "dark" ? "#ffffff" : "#000000";

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
                          fill={labelColor}
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

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold">הכנסות מול הוצאות (6 חודשים)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveBar
                data={monthlyComparison}
                keys={['income', 'expenses']}
                indexBy="month"
                margin={{ top: 50, right: 30, bottom: 50, left: 80 }}
                padding={0.3}
                groupMode="grouped"
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={['hsl(142, 76%, 42%)', 'hsl(0, 84%, 60%)']}
                defs={[
                  {
                    id: 'incomeGradient',
                    type: 'linearGradient',
                    colors: [
                      { offset: 0, color: 'hsl(142, 76%, 52%)' },
                      { offset: 100, color: 'hsl(142, 76%, 36%)' },
                    ],
                  },
                  {
                    id: 'expenseGradient',
                    type: 'linearGradient',
                    colors: [
                      { offset: 0, color: 'hsl(0, 84%, 70%)' },
                      { offset: 100, color: 'hsl(0, 84%, 55%)' },
                    ],
                  },
                ]}
                fill={[
                  { match: { id: 'income' }, id: 'incomeGradient' },
                  { match: { id: 'expenses' }, id: 'expenseGradient' },
                ]}
                borderRadius={6}
                borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 0,
                  tickPadding: 12,
                  tickRotation: 0,
                  legendPosition: 'middle',
                  legendOffset: 40,
                  truncateTickAt: 0,
                }}
                axisLeft={{
                  tickSize: 0,
                  tickPadding: 12,
                  tickRotation: 0,
                  format: (value) => `₪${Number(value) / 1000}k`,
                  legendPosition: 'middle',
                  legendOffset: -60,
                }}
                enableGridY={true}
                gridYValues={5}
                enableLabel={false}
                legends={[
                  {
                    dataFrom: 'keys',
                    anchor: 'top',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: -40,
                    itemsSpacing: 20,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'right-to-left',
                    itemOpacity: 1,
                    symbolSize: 14,
                    symbolShape: 'circle',
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemOpacity: 0.85,
                        },
                      },
                    ],
                    data: [
                      { id: 'income', label: 'הכנסות', color: 'hsl(142, 76%, 42%)' },
                      { id: 'expenses', label: 'הוצאות', color: 'hsl(0, 84%, 60%)' },
                    ],
                  },
                ]}
                tooltip={({ id, value, indexValue, color }) => (
                  <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
                    <div className="font-bold text-foreground mb-1 border-b border-border pb-1">{indexValue}</div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-muted-foreground text-sm">
                        {id === 'income' ? 'הכנסות' : 'הוצאות'}:
                      </span>
                      <span className="font-semibold text-foreground">{formatCurrency(value)}</span>
                    </div>
                  </div>
                )}
                role="application"
                ariaLabel="Income vs Expenses chart"
                motionConfig="gentle"
                theme={{
                  text: {
                    fontSize: 13,
                    fontWeight: 600,
                    fill: labelColor,
                  },
                  axis: {
                    ticks: {
                      text: {
                        fontSize: 12,
                        fontWeight: 500,
                        fill: labelColor,
                      },
                    },
                  },
                  grid: {
                    line: {
                      stroke: mounted && resolvedTheme === 'dark' ? 'hsl(0, 0%, 25%)' : 'hsl(0, 0%, 85%)',
                      strokeDasharray: '4 4',
                    },
                  },
                  legends: {
                    text: {
                      fontSize: 13,
                      fontWeight: 600,
                      fill: labelColor,
                    },
                  },
                }}
              />
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