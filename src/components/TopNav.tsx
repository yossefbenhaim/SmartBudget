import { LayoutDashboard, Plus, List, Tags, Wallet } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { title: "עמוד הבית", url: "/", icon: LayoutDashboard, dataTour: undefined },
  { title: "יתרה והשקעות", url: "/balance", icon: Wallet, dataTour: "balance" },
  { title: "הוספת תנועה", url: "/add", icon: Plus, dataTour: "add-transaction" },
  { title: "תנועות", url: "/transactions", icon: List, dataTour: "transactions" },
  { title: "קטגוריות", url: "/categories", icon: Tags, dataTour: "categories" },
];

export function TopNav() {
  return (
    <nav className="hidden md:flex items-center gap-1">
      {navItems.map((item) => (
        <div key={item.url} data-tour={item.dataTour}>
          <NavLink
            to={item.url}
            end={item.url === "/"}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            activeClassName="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
          >
            <item.icon className="h-4 w-4" />
            <span className="text-sm font-medium">{item.title}</span>
          </NavLink>
        </div>
      ))}
    </nav>
  );
}
