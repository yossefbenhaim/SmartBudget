import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Wallet, ChevronRight, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { MonthSelector } from "@/components/MonthSelector";
import { Button } from "@/components/ui/button";
import { useBudget } from "@/context/BudgetContext";
import {
  getMonthlyStats,
  getCategoryStats,
  getMonthlyComparison,
  formatCurrency,
} from "@/utils/calculations";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
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

const RANGE_OPTIONS = [3, 6, 12] as const;

export default function Dashboard() {
  const { transactions, categories } = useBudget();
  const { resolvedTheme } = useTheme();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [mounted, setMounted] = useState(false);
  const [chartRange, setChartRange] = useState<3 | 6 | 12>(6);
  const [chartOffset, setChartOffset] = useState(0);

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
  const monthlyComparison = getMonthlyComparison(transactions, chartRange, chartOffset);

  const nivoPieData = expensesByCategory.map((item, index) => ({
    id: item.categoryName,
    label: item.categoryName,
    value: item.total,
    color: COLORS[index % COLORS.length],
    percentage: item.percentage,
  }));

  const totalExpenses = expensesByCategory.reduce((sum, item) => sum + item.total, 0);

  const handlePrevPeriod = () => {
    setChartOffset(prev => prev + chartRange);
  };

  const handleNextPeriod = () => {
    setChartOffset(prev => Math.max(0, prev - chartRange));
  };

  const handleResetPeriod = () => {
    setChartOffset(0);
  };

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
            {nivoPieData.length > 0 ? (
              <div className="h-[320px]">
                <ResponsivePie
                  data={nivoPieData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  innerRadius={0.5}
                  padAngle={2}
                  cornerRadius={6}
                  activeOuterRadiusOffset={8}
                  colors={{ datum: 'data.color' }}
                  borderWidth={2}
                  borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
                  enableArcLinkLabels={true}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor={labelColor}
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  arcLinkLabelsDiagonalLength={12}
                  arcLinkLabelsStraightLength={16}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor="#ffffff"
                  arcLabel={d => `${d.data.percentage.toFixed(0)}%`}
                  tooltip={({ datum }) => (
                    <div className="bg-popover border border-border rounded-xl shadow-xl p-4 min-w-[160px]">
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: datum.color }}
                        />
                        <span className="font-bold text-foreground">{datum.label}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground text-sm">סכום:</span>
                          <span className="font-semibold text-foreground">{formatCurrency(datum.value)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground text-sm">אחוז:</span>
                          <span className="font-semibold text-foreground">{datum.data.percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                  motionConfig="gentle"
                  transitionMode="pushIn"
                  legends={[]}
                  theme={{
                    text: {
                      fontSize: 12,
                      fontWeight: 600,
                      fill: labelColor,
                    },
                  }}
                />
              </div>
            ) : (
              <div className="h-[320px] flex items-center justify-center text-muted-foreground">
                אין הוצאות בחודש זה
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">הכנסות מול הוצאות</CardTitle>
                <div className="flex items-center gap-1">
                  {RANGE_OPTIONS.map((range) => (
                    <Button
                      key={range}
                      variant={chartRange === range ? "default" : "outline"}
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => {
                        setChartRange(range);
                        setChartOffset(0);
                      }}
                    >
                      {range} חודשים
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handlePrevPeriod}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleResetPeriod}
                  disabled={chartOffset === 0}
                >
                  היום
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleNextPeriod}
                  disabled={chartOffset === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveBar
                data={monthlyComparison}
                keys={['income', 'expenses']}
                indexBy="monthName"
                margin={{ top: 50, right: 30, bottom: 70, left: 80 }}
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
                  tickPadding: 8,
                  tickRotation: 0,
                  legendPosition: 'middle',
                  legendOffset: 55,
                  truncateTickAt: 0,
                  renderTick: ({ x, y, value }) => {
                    const dataPoint = monthlyComparison.find(d => d.monthName === value);
                    const showYear = dataPoint && (
                      monthlyComparison.indexOf(dataPoint) === 0 ||
                      dataPoint.year !== monthlyComparison[monthlyComparison.indexOf(dataPoint) - 1]?.year
                    );
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text
                          textAnchor="middle"
                          dominantBaseline="middle"
                          y={16}
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            fill: labelColor,
                          }}
                        >
                          {value}
                        </text>
                        {showYear && dataPoint && (
                          <text
                            textAnchor="middle"
                            dominantBaseline="middle"
                            y={34}
                            style={{
                              fontSize: 11,
                              fontWeight: 500,
                              fill: labelColor,
                              opacity: 0.7,
                            }}
                          >
                            {dataPoint.year}
                          </text>
                        )}
                      </g>
                    );
                  },
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
                tooltip={({ data }) => {
                  const balance = data.income - data.expenses;
                  return (
                    <div className="bg-popover border border-border rounded-xl shadow-xl p-4 min-w-[180px]">
                      <div className="font-bold text-foreground text-center mb-3 pb-2 border-b border-border">
                        {data.monthName} {data.year}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-muted-foreground text-sm">הכנסות</span>
                          </div>
                          <span className="font-semibold text-green-600">{formatCurrency(data.income)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-muted-foreground text-sm">הוצאות</span>
                          </div>
                          <span className="font-semibold text-red-500">{formatCurrency(data.expenses)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 pt-2 mt-2 border-t border-border">
                          <span className="text-muted-foreground text-sm font-medium">יתרה</span>
                          <span className={`font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {formatCurrency(balance)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
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