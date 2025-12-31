import { ReactNode } from "react";
import { TopNav } from "@/components/TopNav";
import { MobileNav } from "@/components/MobileNav";
import { ThemeToggle } from "@/components/ThemeToggle";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">₪</span>
            </div>
            <span className="font-bold text-lg hidden sm:block">תקציב חכם</span>
          </div>
          <div className="hidden md:block h-6 w-px bg-border" />
          <TopNav />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MobileNav />
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
