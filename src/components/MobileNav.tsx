import { useState } from "react";
import { Menu, X, LayoutDashboard, Plus, List, Tags, RotateCcw, Wallet } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useBudget } from "@/context/BudgetContext";

const navItems = [
  { title: "עמוד הבית", url: "/", icon: LayoutDashboard },
  { title: "יתרה והשקעות", url: "/balance", icon: Wallet },
  { title: "הוספת תנועה", url: "/add", icon: Plus },
  { title: "תנועות", url: "/transactions", icon: List },
  { title: "קטגוריות", url: "/categories", icon: Tags },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { resetAll } = useBudget();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b bg-gradient-to-l from-primary/10 to-secondary/10">
            <h2 className="text-lg font-bold text-primary">Family Budget</h2>
            <p className="text-xs text-muted-foreground">ניהול תקציב משפחתי</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                end={item.url === "/"}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                activeClassName="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                onClick={() => setOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive">
                  <RotateCcw className="h-4 w-4" />
                  איפוס נתונים
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
                  <AlertDialogDescription>
                    פעולה זו תמחק את כל הנתונים ותחזיר את האפליקציה למצב התחלתי. לא ניתן לבטל פעולה זו.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>ביטול</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      resetAll();
                      setOpen(false);
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    אפס הכל
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
