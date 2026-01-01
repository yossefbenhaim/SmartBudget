import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { CategoryIcon, availableIcons } from "@/components/CategoryIcon";
import { useBudget } from "@/context/BudgetContext";
import { useToast } from "@/hooks/use-toast";
import { Category, TransactionType } from "@/types/budget";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory, transactions } =
    useBudget();
  const { toast } = useToast();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    icon: "CircleDot",
    type: "expense" as TransactionType,
  });

  const resetForm = () => {
    setFormData({ name: "", icon: "CircleDot", type: "expense" });
  };

  const handleAdd = () => {
    if (!formData.name.trim()) {
      toast({
        title: "שגיאה",
        description: "שם הקטגוריה הוא שדה חובה",
        variant: "destructive",
      });
      return;
    }

    addCategory({
      name: formData.name,
      icon: formData.icon,
      type: formData.type,
    });

    toast({
      title: "קטגוריה נוספה",
      description: `${formData.name} נוספה בהצלחה`,
    });

    resetForm();
    setIsAddOpen(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon,
      type: category.type,
    });
  };

  const handleSaveEdit = () => {
    if (!editingCategory || !formData.name.trim()) return;

    updateCategory({
      ...editingCategory,
      name: formData.name,
      icon: formData.icon,
      type: formData.type,
    });

    toast({
      title: "קטגוריה עודכנה",
      description: "השינויים נשמרו בהצלחה",
    });

    setEditingCategory(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!deletingId) return;

    // Check if category is in use
    const inUse = transactions.some((t) => t.categoryId === deletingId);
    if (inUse) {
      toast({
        title: "לא ניתן למחוק",
        description: "קטגוריה זו בשימוש בתנועות קיימות",
        variant: "destructive",
      });
      setDeletingId(null);
      return;
    }

    deleteCategory(deletingId);

    toast({
      title: "קטגוריה נמחקה",
      description: "הקטגוריה הוסרה בהצלחה",
    });

    setDeletingId(null);
  };

  const getTypeLabel = (type: TransactionType) => {
    switch (type) {
      case "income":
        return "הכנסות";
      case "expense":
        return "הוצאות";
    }
  };

  const getTypeColor = (type: TransactionType) => {
    switch (type) {
      case "income":
        return "bg-income-muted text-income";
      case "expense":
        return "bg-expense-muted text-expense";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">קטגוריות</h1>
          <p className="text-muted-foreground">ניהול קטגוריות הכנסות והוצאות</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary">
              <Plus className="h-4 w-4" />
              קטגוריה חדשה
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>הוספת קטגוריה</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>שם הקטגוריה</Label>
                <Input
                  placeholder="שם הקטגוריה"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>סוג</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      type: value as TransactionType,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">הכנסות</SelectItem>
                    <SelectItem value="expense">הוצאות</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>אייקון</Label>
                <div className="grid grid-cols-6 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-lg">
                  {availableIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={cn(
                        "p-3 rounded-lg border transition-all hover:bg-accent",
                        formData.icon === icon &&
                          "border-primary bg-primary/10"
                      )}
                    >
                      <CategoryIcon iconName={icon} className="h-5 w-5 mx-auto" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdd} className="flex-1">
                  הוסף
                </Button>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  ביטול
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="group">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CategoryIcon
                      iconName={category.icon}
                      className="h-6 w-6 text-primary"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{category.name}</p>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs", getTypeColor(category.type))}
                    >
                      {getTypeLabel(category.type)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingId(category.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingCategory}
        onOpenChange={() => {
          setEditingCategory(null);
          resetForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>עריכת קטגוריה</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>שם הקטגוריה</Label>
              <Input
                placeholder="שם הקטגוריה"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>סוג</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    type: value as TransactionType,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">הכנסות</SelectItem>
                  <SelectItem value="expense">הוצאות</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>אייקון</Label>
              <div className="grid grid-cols-6 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-lg">
                {availableIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={cn(
                      "p-3 rounded-lg border transition-all hover:bg-accent",
                      formData.icon === icon && "border-primary bg-primary/10"
                    )}
                  >
                    <CategoryIcon iconName={icon} className="h-5 w-5 mx-auto" />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveEdit} className="flex-1">
                שמור
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingCategory(null);
                  resetForm();
                }}
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
            <AlertDialogTitle>האם למחוק את הקטגוריה?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו לא ניתנת לביטול. אם הקטגוריה בשימוש, לא ניתן יהיה למחוק אותה.
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