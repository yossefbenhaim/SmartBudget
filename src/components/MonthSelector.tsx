import { ChevronRight, ChevronLeft, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, startOfMonth, endOfMonth, isSameDay } from "date-fns";
import { he } from "date-fns/locale";
import { useBudget } from "@/context/BudgetContext";
import { cn } from "@/lib/utils";

interface MonthSelectorProps {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}

export function MonthSelector({ year, month, onChange }: MonthSelectorProps) {
  const { transactions } = useBudget();
  const date = new Date(year, month);

  // Get days with transactions for the current month
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  
  const daysWithTransactions = transactions
    .filter((t) => {
      const tDate = new Date(t.date);
      return tDate >= monthStart && tDate <= monthEnd;
    })
    .map((t) => new Date(t.date));

  const handlePrevMonth = () => {
    if (month === 0) {
      onChange(year - 1, 11);
    } else {
      onChange(year, month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      onChange(year + 1, 0);
    } else {
      onChange(year, month + 1);
    }
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    onChange(now.getFullYear(), now.getMonth());
  };

  const handleDaySelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onChange(selectedDate.getFullYear(), selectedDate.getMonth());
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={handleNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="min-w-[160px] justify-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span className="font-semibold">
              {format(date, "MMMM yyyy", { locale: he })}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDaySelect}
            month={date}
            onMonthChange={(newMonth) => {
              onChange(newMonth.getFullYear(), newMonth.getMonth());
            }}
            locale={he}
            className="pointer-events-auto"
            modifiers={{
              hasTransaction: (day) =>
                daysWithTransactions.some((d) => isSameDay(d, day)),
            }}
            modifiersClassNames={{
              hasTransaction: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-expense after:rounded-full",
            }}
          />
          <div className="p-3 border-t flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 bg-expense rounded-full"></span>
            <span>ימים עם תנועות</span>
          </div>
        </PopoverContent>
      </Popover>
      
      <Button variant="outline" size="icon" onClick={handlePrevMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={handleCurrentMonth}>
        היום
      </Button>
    </div>
  );
}