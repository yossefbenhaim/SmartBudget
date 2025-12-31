import React from "react";

export type IncomeExpenseLegendItem = {
  label: string;
  color: string;
};

export function IncomeExpenseLegend({
  items,
  className,
}: {
  items: IncomeExpenseLegendItem[];
  className?: string;
}) {
  return (
    <div className={"flex flex-col items-end gap-1 " + (className ?? "")}
      aria-label="מקרא: הכנסות והוצאות"
    >
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-end gap-2">
          <span className="text-sm font-medium text-foreground">{item.label}</span>
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: item.color }}
            aria-hidden="true"
          />
        </div>
      ))}
    </div>
  );
}
