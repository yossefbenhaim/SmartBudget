import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Download, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CategoryIcon } from "@/components/CategoryIcon";
import { MonthSelector } from "@/components/MonthSelector";
import { useBudget } from "@/context/BudgetContext";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate } from "@/utils/calculations";
import { exportToCSV } from "@/utils/csvExport";
import { Transaction, TransactionType } from "@/types/budget";
import { parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function Transactions() {
  const { transactions, categories, updateTransaction, deleteTransaction } =
    useBudget();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const highlightRef = useRef<HTMLTableRowElement>(null);

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    type: "expense" as TransactionType,
    amount: "",
    date: "",
    categoryId: "",
    description: "",
  });

  // Set month/year based on highlighted transaction
  useEffect(() => {
    if (highlightId) {
      const transaction = transactions.find((t) => t.id === highlightId);
      if (transaction) {
        const date = parseISO(transaction.date);
        setYear(date.getFullYear());
        setMonth(date.getMonth());
      }
    }
  }, [highlightId, transactions]);

  // Scroll to highlighted transaction
  useEffect(() => {
    if (highlightId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      // Clear the highlight param after a delay
      setTimeout(() => {
        setSearchParams({});
      }, 3000);
    }
  }, [highlightId, setSearchParams]);

  const filteredTransactions = useMemo(() => {
    const startDate = startOfMonth(new Date(year, month));
    const endDate = endOfMonth(new Date(year, month));

    return transactions.filter((t) => {
      const date = parseISO(t.date);
      const inMonth = isWithinInterval(date, { start: startDate, end: endDate });

      const matchesSearch =
        searchQuery === "" ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === "all" || t.type === typeFilter;

      const matchesCategory =
        categoryFilter === "all" || t.categoryId === categoryFilter;

      return inMonth && matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, year, month, searchQuery, typeFilter, categoryFilter]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "לא ידוע";
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.icon || "CircleDot";
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditForm({
      type: transaction.type,
      amount: transaction.amount.toString(),
      date: transaction.date,
      categoryId: transaction.categoryId,
      description: transaction.description,
    });
  };

  const handleSaveEdit = () => {
    if (!editingTransaction) return;

    updateTransaction({
      ...editingTransaction,
      type: editForm.type,
      amount: parseFloat(editForm.amount),
      date: editForm.date,
      categoryId: editForm.categoryId,
      description: editForm.description,
    });

    toast({
      title: "התנועה עודכנה",
      description: "השינויים נשמרו בהצלחה",
    });

    setEditingTransaction(null);
  };

  const handleDelete = () => {
    if (!deletingId) return;

    deleteTransaction(deletingId);

    toast({
      title: "התנועה נמחקה",
      description: "התנועה הוסרה בהצלחה",
    });

    setDeletingId(null);
  };

  const handleExportCSV = () => {
    exportToCSV(filteredTransactions, categories, `transactions_${year}_${month + 1}`);
    toast({
      title: "הקובץ יורד",
      description: `${filteredTransactions.length} תנועות יוצאו ל-CSV`,
    });
  };

  const filteredCategoriesForEdit = categories.filter(
    (c) => c.type === editForm.type || c.type === "both"
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">רשימת תנועות</h1>
          <p className="text-muted-foreground">
            {filteredTransactions.length} תנועות נמצאו
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MonthSelector
            year={year}
            month={month}
            onChange={(y, m) => {
              setYear(y);
              setMonth(m);
            }}
          />
          <Button variant="outline" onClick={handleExportCSV} className="gap-2">
            <Download className="h-4 w-4" />
            ייצוא CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>סינון וחיפוש</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חיפוש לפי תיאור..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="סוג תנועה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">הכל</SelectItem>
                <SelectItem value="income">הכנסות</SelectItem>
                <SelectItem value="expense">הוצאות</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="קטגוריה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הקטגוריות</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("all");
                setCategoryFilter("all");
              }}
            >
              נקה סינון
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>תאריך</TableHead>
                <TableHead>סוג</TableHead>
                <TableHead>קטגוריה</TableHead>
                <TableHead>תיאור</TableHead>
                <TableHead>סכום</TableHead>
                <TableHead className="w-[100px]">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <p className="text-muted-foreground">לא נמצאו תנועות</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      ref={transaction.id === highlightId ? highlightRef : null}
                      className={cn(
                        transaction.id === highlightId &&
                          "bg-primary/10 animate-pulse"
                      )}
                    >
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            transaction.type === "income"
                              ? "bg-income-muted text-income"
                              : "bg-expense-muted text-expense"
                          )}
                        >
                          {transaction.type === "income" ? "הכנסה" : "הוצאה"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CategoryIcon
                            iconName={getCategoryIcon(transaction.categoryId)}
                          />
                          {getCategoryName(transaction.categoryId)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {transaction.description || "-"}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "font-semibold",
                          transaction.type === "income"
                            ? "text-income"
                            : "text-expense"
                        )}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(transaction)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingId(transaction.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingTransaction}
        onOpenChange={() => setEditingTransaction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>עריכת תנועה</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>סוג תנועה</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setEditForm({ ...editForm, type: "income", categoryId: "" })
                  }
                  className={cn(
                    editForm.type === "income" &&
                      "bg-income text-income-foreground border-income"
                  )}
                >
                  הכנסה
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setEditForm({ ...editForm, type: "expense", categoryId: "" })
                  }
                  className={cn(
                    editForm.type === "expense" &&
                      "bg-expense text-expense-foreground border-expense"
                  )}
                >
                  הוצאה
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>סכום</Label>
              <Input
                type="number"
                value={editForm.amount}
                onChange={(e) =>
                  setEditForm({ ...editForm, amount: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>תאריך</Label>
              <Input
                type="date"
                value={editForm.date}
                onChange={(e) =>
                  setEditForm({ ...editForm, date: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>קטגוריה</Label>
              <Select
                value={editForm.categoryId}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, categoryId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategoriesForEdit.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>תיאור</Label>
              <Textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveEdit} className="flex-1">
                שמור
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingTransaction(null)}
              >
                ביטול
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>האם למחוק את התנועה?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו לא ניתנת לביטול.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              מחק
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}