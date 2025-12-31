import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/calculations";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

interface StatCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  variant: "income" | "expense" | "balance";
}

function useCountUp(end: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const prevEndRef = useRef(end);

  useEffect(() => {
    // Reset animation when end value changes significantly
    if (Math.abs(prevEndRef.current - end) > 1) {
      countRef.current = 0;
      startTimeRef.current = null;
    }
    prevEndRef.current = end;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      // Easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = easeOutQuart * end;
      
      setCount(currentValue);
      countRef.current = currentValue;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
}

export function StatCard({ title, amount, icon: Icon, variant }: StatCardProps) {
  const animatedAmount = useCountUp(amount, 1200);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const variants = {
    income: {
      gradient: "gradient-income",
      textColor: "text-income-foreground",
      delay: "0ms",
    },
    expense: {
      gradient: "gradient-expense",
      textColor: "text-expense-foreground",
      delay: "150ms",
    },
    balance: {
      gradient: "gradient-balance",
      textColor: "text-balance-foreground",
      delay: "300ms",
    },
  };

  const { gradient, textColor, delay } = variants[variant];

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-700 ease-out",
        gradient,
        isVisible 
          ? "opacity-100 translate-y-0 scale-100" 
          : "opacity-0 translate-y-8 scale-95"
      )}
      style={{ transitionDelay: delay }}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={cn("text-sm font-medium opacity-90", textColor)}>
              {title}
            </p>
            <p className={cn(
              "text-3xl font-bold mt-2 tabular-nums",
              textColor
            )}>
              {formatCurrency(animatedAmount)}
            </p>
          </div>
          <div 
            className={cn(
              "p-3 rounded-xl bg-white/20 transition-transform duration-500",
              textColor,
              isVisible ? "rotate-0 scale-100" : "rotate-12 scale-75"
            )}
            style={{ transitionDelay: `calc(${delay} + 200ms)` }}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}