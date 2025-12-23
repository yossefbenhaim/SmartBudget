import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryIcon } from "@/components/CategoryIcon";
import { useBudget } from "@/context/BudgetContext";
import { useToast } from "@/hooks/use-toast";
import { TransactionType } from "@/types/budget";
import { cn } from "@/lib/utils";

export default function AddTransaction() {
  const navigate = useNavigate();
  const { categories, addTransaction } = useBudget();
  const { toast } = useToast();

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredCategories = categories.filter(
    (c) => c.type === type || c.type === "both"
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
      date,
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
              <Label htmlFor="date">תאריך</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={cn(errors.date && "border-destructive")}
              />
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