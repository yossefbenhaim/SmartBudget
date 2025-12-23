import { LayoutDashboard, Plus, List, Tags, RotateCcw } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { title: "דשבורד", url: "/", icon: LayoutDashboard },
  { title: "הוספת תנועה", url: "/add", icon: Plus },
  { title: "רשימת תנועות", url: "/transactions", icon: List },
  { title: "קטגוריות", url: "/categories", icon: Tags },
];

export function AppSidebar() {
  const location = useLocation();
  const { resetAll } = useBudget();
  const { toast } = useToast();

  const handleReset = () => {
    resetAll();
    toast({
      title: "הנתונים אופסו",
      description: "כל הנתונים נמחקו בהצלחה",
    });
  };

  return (
    <Sidebar className="border-l-0">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <span className="text-xl">💰</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">Family Budget</h1>
            <p className="text-xs text-sidebar-foreground/70">ניהול תקציב משפחתי</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">תפריט ראשי</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className="hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent"
                  >
                    <NavLink to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <RotateCcw className="h-4 w-4" />
              איפוס נתונים
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>האם למחוק את כל הנתונים?</AlertDialogTitle>
              <AlertDialogDescription>
                פעולה זו תמחק את כל התנועות ותאפס את הקטגוריות לברירת המחדל.
                לא ניתן לבטל פעולה זו.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel>ביטול</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
                מחק הכל
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
    </Sidebar>
  );
}