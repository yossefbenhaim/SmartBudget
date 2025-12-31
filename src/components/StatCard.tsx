import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/calculations";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface StatCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  variant: "income" | "expense" | "balance";
  year: number;
  month: number;
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

export function StatCard({ title, amount, icon: Icon, variant, year, month }: StatCardProps) {
  const navigate = useNavigate();
  const animatedAmount = useCountUp(amount, 1200);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const variants = {
    income: {
      gradient: "gradient-income",
      textColor: "text-income-foreground",
      delay: "0ms",
      hoverGlow: "shadow-[0_0_40px_rgba(34,197,94,0.4)]",
    },
    expense: {
      gradient: "gradient-expense",
      textColor: "text-expense-foreground",
      delay: "150ms",
      hoverGlow: "shadow-[0_0_40px_rgba(239,68,68,0.4)]",
    },
    balance: {
      gradient: "gradient-balance",
      textColor: "text-balance-foreground",
      delay: "300ms",
      hoverGlow: "shadow-[0_0_40px_rgba(59,130,246,0.4)]",
    },
  };

  const { gradient, textColor, delay, hoverGlow } = variants[variant];

  const handleClick = () => {
    if (variant === "balance") {
      navigate(`/balance?year=${year}&month=${month}`);
    } else {
      navigate(`/transactions?year=${year}&month=${month}&type=${variant}`);
    }
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-500 ease-out cursor-pointer group relative",
        gradient,
        isVisible 
          ? "opacity-100 translate-y-0 scale-100" 
          : "opacity-0 translate-y-8 scale-95",
        isHovered && [hoverGlow, "scale-[1.02] -translate-y-1"]
      )}
      style={{ transitionDelay: isVisible ? "0ms" : delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Shine effect on hover */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-700 ease-out",
          isHovered && "translate-x-full"
        )}
      />
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className={cn(
              "text-sm font-medium opacity-90 transition-all duration-300",
              textColor,
              isHovered && "opacity-100"
            )}>
              {title}
            </p>
            <p className={cn(
              "text-3xl font-bold mt-2 tabular-nums transition-all duration-300",
              textColor,
              isHovered && "tracking-wide"
            )}>
              {formatCurrency(animatedAmount)}
            </p>
            <p className={cn(
              "text-xs mt-2 opacity-0 transition-all duration-300 transform translate-y-2",
              textColor,
              isHovered && "opacity-70 translate-y-0"
            )}>
              לחץ לצפייה בפרטים →
            </p>
          </div>
          <div 
            className={cn(
              "p-3 rounded-xl bg-white/20 transition-all duration-500",
              textColor,
              isVisible ? "rotate-0 scale-100" : "rotate-12 scale-75",
              isHovered && "scale-110 bg-white/30 rotate-6"
            )}
            style={{ transitionDelay: isVisible ? "0ms" : `calc(${delay} + 200ms)` }}
          >
            <Icon className={cn(
              "h-6 w-6 transition-transform duration-300",
              isHovered && "scale-110"
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}