import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { BudgetProvider } from "@/context/BudgetContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import AddTransaction from "@/pages/AddTransaction";
import Transactions from "@/pages/Transactions";
import Categories from "@/pages/Categories";
import Balance from "@/pages/Balance";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ResetPassword from "@/pages/auth/ResetPassword";
import UpdatePassword from "@/pages/auth/UpdatePassword";
import VerifyEmail from "@/pages/auth/VerifyEmail";
import Profile from "@/pages/auth/Profile";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <BudgetProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <AddTransaction />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Transactions />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/categories"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Categories />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/balance"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Balance />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Profile />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </BudgetProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;