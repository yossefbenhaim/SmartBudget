import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, isSameDay, startOfMonth, endOfMonth } from "date-fns";
import { he } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useBudget } from "@/context/BudgetContext";
import { CategoryIcon } from "@/components/CategoryIcon";
import { formatCurrency } from "@/utils/calculations";
import { Transaction } from "@/types/budget";
import { cn } from "@/lib/utils";

interface TransactionCalendarProps {
  month: Date;
  onMonthChange: (date: Date) => void;
  onDaySelect?: (date: Date) => void;
  selectedDate?: Date;
}

export function TransactionCalendar({
  month,
  onMonthChange,
  onDaySelect,
  selectedDate,
}: TransactionCalendarProps) {
  const navigate = useNavigate();
  const { transactions, categories } = useBudget();
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);

  const getTransactionsForDay = (day: Date): Transaction[] => {
    return transactions.filter((t) => isSameDay(new Date(t.date), day));
  };

  const getCategoryName = (categoryId: string): string => {
    return categories.find((c) => c.id === categoryId)?.name || "לא ידוע";
  };

  const getCategoryIcon = (categoryId: string): string => {
    return categories.find((c) => c.id === categoryId)?.icon || "Circle";
  };

  const handleTransactionClick = (transactionId: string) => {
    navigate(`/transactions?highlight=${transactionId}`);
  };

  const daysWithTransactions = transactions
    .filter((t) => {
      const tDate = new Date(t.date);
      return tDate >= monthStart && tDate <= monthEnd;
    })
    .map((t) => new Date(t.date));

  return (
    <div className="relative">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDaySelect?.(date)}
        month={month}
        onMonthChange={onMonthChange}
        locale={he}
        className="pointer-events-auto"
        modifiers={{
          hasTransaction: (day) =>
            daysWithTransactions.some((d) => isSameDay(d, day)),
        }}
        modifiersClassNames={{
          hasTransaction:
            "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-expense after:rounded-full",
        }}
        components={{
          Day: ({ date, ...props }) => {
            const dayTransactions = getTransactionsForDay(date);
            const hasTransactions = dayTransactions.length > 0;
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());
            const isOutside = date.getMonth() !== month.getMonth();

            if (!hasTransactions) {
              return (
                <button
                  {...props}
                  onClick={() => onDaySelect?.(date)}
                  className={cn(
                    "h-9 w-9 p-0 font-normal rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                    isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                    isToday && !isSelected && "bg-accent text-accent-foreground",
                    isOutside && "text-muted-foreground opacity-50"
                  )}
                >
                  {date.getDate()}
                </button>
              );
            }

            return (
              <HoverCard openDelay={100} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <button
                    {...props}
                    onClick={() => onDaySelect?.(date)}
                    className={cn(
                      "h-9 w-9 p-0 font-normal rounded-md hover:bg-accent hover:text-accent-foreground transition-colors relative",
                      isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                      isToday && !isSelected && "bg-accent text-accent-foreground",
                      isOutside && "text-muted-foreground opacity-50",
                      "after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-expense after:rounded-full"
                    )}
                  >
                    {date.getDate()}
                  </button>
                </HoverCardTrigger>
                <HoverCardContent
                  side="left"
                  align="center"
                  className="w-64 p-0"
                >
                  <div className="p-3 border-b bg-muted/50">
                    <p className="font-semibold text-sm">
                      {format(date, "EEEE, d MMMM", { locale: he })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dayTransactions.length} תנועות
                    </p>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {dayTransactions.map((transaction) => (
                      <button
                        key={transaction.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTransactionClick(transaction.id);
                        }}
                        className="w-full p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-right border-b last:border-b-0"
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            transaction.type === "income"
                              ? "bg-income-muted text-income"
                              : "bg-expense-muted text-expense"
                          )}
                        >
                          <CategoryIcon
                            iconName={getCategoryIcon(transaction.categoryId)}
                            className="h-4 w-4"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {getCategoryName(transaction.categoryId)}
                          </p>
                          {transaction.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {transaction.description}
                            </p>
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-sm font-semibold shrink-0",
                            transaction.type === "income"
                              ? "text-income"
                              : "text-expense"
                          )}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </button>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          },
        }}
      />
      <div className="p-3 border-t flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span className="w-2 h-2 bg-expense rounded-full"></span>
        <span>ימים עם תנועות</span>
      </div>
    </div>
  );
}
