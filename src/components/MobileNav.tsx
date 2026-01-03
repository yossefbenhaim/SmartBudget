import { Menu, LayoutDashboard, Plus, List, Tags, Wallet } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobileMenu } from "@/contexts/MobileMenuContext";

const navItems = [
  { title: "עמוד הבית", url: "/", icon: LayoutDashboard, dataTour: undefined },
  { title: "יתרה והשקעות", url: "/balance", icon: Wallet, dataTour: "balance-mobile" },
  { title: "הוספת תנועה", url: "/add", icon: Plus, dataTour: "add-transaction-mobile" },
  { title: "תנועות", url: "/transactions", icon: List, dataTour: "transactions-mobile" },
  { title: "קטגוריות", url: "/categories", icon: Tags, dataTour: "categories-mobile" },
];

export function MobileNav() {
  const { isOpen, setOpen, isTourActive } = useMobileMenu();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" data-tour="mobile-menu-button">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        isTourActive={isTourActive}
        className="w-72 p-0"
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b bg-gradient-to-l from-primary/10 to-secondary/10">
            <h2 className="text-lg font-bold text-primary">Family Budget</h2>
            <p className="text-xs text-muted-foreground">ניהול תקציב משפחתי</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.url} data-tour={item.dataTour}>
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  activeClassName="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </NavLink>
              </div>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
