import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/calculations";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  variant: "income" | "expense" | "balance";
}

export function StatCard({ title, amount, icon: Icon, variant }: StatCardProps) {
  const variants = {
    income: {
      gradient: "gradient-income",
      textColor: "text-income-foreground",
    },
    expense: {
      gradient: "gradient-expense",
      textColor: "text-expense-foreground",
    },
    balance: {
      gradient: "gradient-balance",
      textColor: "text-balance-foreground",
    },
  };

  const { gradient, textColor } = variants[variant];

  return (
    <Card className={cn("overflow-hidden", gradient)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={cn("text-sm font-medium opacity-90", textColor)}>
              {title}
            </p>
            <p className={cn("text-3xl font-bold mt-2", textColor)}>
              {formatCurrency(amount)}
            </p>
          </div>
          <div className={cn("p-3 rounded-xl bg-white/20", textColor)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}