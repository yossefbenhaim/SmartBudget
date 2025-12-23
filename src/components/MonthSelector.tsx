import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { he } from "date-fns/locale";

interface MonthSelectorProps {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}

export function MonthSelector({ year, month, onChange }: MonthSelectorProps) {
  const date = new Date(year, month);

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

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={handleNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
      <div className="min-w-[140px] text-center">
        <span className="font-semibold">
          {format(date, "MMMM yyyy", { locale: he })}
        </span>
      </div>
      <Button variant="outline" size="icon" onClick={handlePrevMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={handleCurrentMonth}>
        היום
      </Button>
    </div>
  );
}