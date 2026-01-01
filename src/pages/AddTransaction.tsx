import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { he } from "date-fns/locale";
import { CategoryIcon } from "@/components/CategoryIcon";
import { useBudget } from "@/context/BudgetContext";
import { useToast } from "@/hooks/use-toast";
import { TransactionType } from "@/types/budget";
import { cn } from "@/lib/utils";

export default function AddTransaction() {
  const navigate = useNavigate();
  const { categories, addTransaction, transactions } = useBudget();
  const { toast } = useToast();

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get days with transactions
  const daysWithTransactions = transactions.map((t) => new Date(t.date));

  const filteredCategories = categories.filter(
    (c) => c.type === type
  );

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = "סכום חייב להיות חיובי";
    }

    if (!date) {
      newErrors.date = "תאריך הוא שדה חובה";
    }

    if (!categoryId) {
      newErrors.categoryId = "יש לבחור קטגוריה";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    addTransaction({
      type,
      amount: parseFloat(amount),
      date: format(date, "yyyy-MM-dd"),
      categoryId,
      description,
    });

    toast({
      title: type === "income" ? "הכנסה נוספה" : "הוצאה נוספה",
      description: `סכום: ₪${amount}`,
    });

    navigate("/transactions");
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">הוספת תנועה</h1>
        <p className="text-muted-foreground">הוסף הכנסה או הוצאה חדשה</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>פרטי התנועה</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>סוג תנועה</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setType("income");
                    setCategoryId("");
                  }}
                  className={cn(
                    "h-16 text-lg transition-all",
                    type === "income" &&
                      "bg-income text-income-foreground border-income hover:bg-income/90 hover:text-income-foreground"
                  )}
                >
                  💰 הכנסה
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setType("expense");
                    setCategoryId("");
                  }}
                  className={cn(
                    "h-16 text-lg transition-all",
                    type === "expense" &&
                      "bg-expense text-expense-foreground border-expense hover:bg-expense/90 hover:text-expense-foreground"
                  )}
                >
                  💸 הוצאה
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">סכום (₪)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={cn(
                  "text-xl h-14",
                  errors.amount && "border-destructive"
                )}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>תאריך</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-right font-normal",
                      !date && "text-muted-foreground",
                      errors.date && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {date ? format(date, "dd MMMM yyyy", { locale: he }) : "בחר תאריך"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
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
                    <span>ימים עם תנועות קיימות</span>
                  </div>
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>קטגוריה</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger
                  className={cn(errors.categoryId && "border-destructive")}
                >
                  <SelectValue placeholder="בחר קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <CategoryIcon iconName={category.icon} />
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-destructive">{errors.categoryId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">תיאור (אופציונלי)</Label>
              <Textarea
                id="description"
                placeholder="הוסף תיאור קצר..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1 gradient-primary h-12">
                שמור תנועה
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="h-12"
              >
                ביטול
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}