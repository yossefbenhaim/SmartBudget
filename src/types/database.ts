// Database types for SmartBudget application
// Auto-generated types based on Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================================================
// ENUMS
// ============================================================================

export type TransactionType = 'income' | 'expense';
export type BudgetPeriod = 'monthly' | 'yearly';
export type InvestmentType = 'stocks' | 'bonds' | 'crypto' | 'real_estate' | 'savings' | 'other';
export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

// ============================================================================
// TABLE TYPES
// ============================================================================

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  currency: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  type: TransactionType;
  description: string | null;
  notes: string | null;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  period: BudgetPeriod;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Investment {
  id: string;
  user_id: string;
  name: string;
  type: InvestmentType;
  initial_amount: number;
  current_value: number;
  currency: string;
  purchase_date: string;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  description: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecurringTransaction {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  type: TransactionType;
  description: string;
  frequency: RecurringFrequency;
  start_date: string;
  end_date: string | null;
  last_processed_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InvestmentRecommendation {
  id: string;
  name: string;
  provider: string;
  icon: string;
  risk_level: string;
  risk_color: string;
  expected_return: string;
  min_investment: number;
  description: string;
  benefits: string[];
  color: string;
  link_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// INSERT TYPES (without auto-generated fields)
// ============================================================================

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'>;
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;

export type CategoryInsert = Omit<Category, 'id' | 'created_at' | 'updated_at'>;
export type CategoryUpdate = Partial<Omit<Category, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

export type TransactionInsert = Omit<Transaction, 'id' | 'created_at' | 'updated_at'>;
export type TransactionUpdate = Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

export type BudgetInsert = Omit<Budget, 'id' | 'created_at' | 'updated_at'>;
export type BudgetUpdate = Partial<Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

export type InvestmentInsert = Omit<Investment, 'id' | 'created_at' | 'updated_at'>;
export type InvestmentUpdate = Partial<Omit<Investment, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

export type SavingsGoalInsert = Omit<SavingsGoal, 'id' | 'created_at' | 'updated_at'>;
export type SavingsGoalUpdate = Partial<Omit<SavingsGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

export type RecurringTransactionInsert = Omit<RecurringTransaction, 'id' | 'created_at' | 'updated_at'>;
export type RecurringTransactionUpdate = Partial<Omit<RecurringTransaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

// ============================================================================
// JOINED TYPES (with relations)
// ============================================================================

export interface TransactionWithCategory extends Transaction {
  category: Category | null;
}

export interface BudgetWithCategory extends Budget {
  category: Category | null;
}

// ============================================================================
// VIEW TYPES
// ============================================================================

export interface MonthlySummary {
  user_id: string;
  month: string;
  total_income: number;
  total_expenses: number;
  net_amount: number;
}

export interface CategorySummary {
  user_id: string;
  category_name: string;
  type: TransactionType;
  color: string;
  transaction_count: number;
  total_amount: number;
}

// ============================================================================
// DATABASE INTERFACE
// ============================================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          currency?: string;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          currency?: string;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: Category;
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: TransactionType;
          color: string;
          icon?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: TransactionType;
          color?: string;
          icon?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: Transaction;
        Insert: {
          id?: string;
          user_id: string;
          category_id?: string | null;
          amount: number;
          type: TransactionType;
          description?: string | null;
          notes?: string | null;
          transaction_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string | null;
          amount?: number;
          type?: TransactionType;
          description?: string | null;
          notes?: string | null;
          transaction_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      budgets: {
        Row: Budget;
        Insert: {
          id?: string;
          user_id: string;
          category_id?: string | null;
          amount: number;
          period: BudgetPeriod;
          start_date: string;
          end_date?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string | null;
          amount?: number;
          period?: BudgetPeriod;
          start_date?: string;
          end_date?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      investments: {
        Row: Investment;
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: InvestmentType;
          initial_amount: number;
          current_value: number;
          currency?: string;
          purchase_date: string;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: InvestmentType;
          initial_amount?: number;
          current_value?: number;
          currency?: string;
          purchase_date?: string;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      savings_goals: {
        Row: SavingsGoal;
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          target_amount: number;
          current_amount?: number;
          deadline?: string | null;
          description?: string | null;
          is_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          target_amount?: number;
          current_amount?: number;
          deadline?: string | null;
          description?: string | null;
          is_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      recurring_transactions: {
        Row: RecurringTransaction;
        Insert: {
          id?: string;
          user_id: string;
          category_id?: string | null;
          amount: number;
          type: TransactionType;
          description: string;
          frequency: RecurringFrequency;
          start_date: string;
          end_date?: string | null;
          last_processed_date?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string | null;
          amount?: number;
          type?: TransactionType;
          description?: string;
          frequency?: RecurringFrequency;
          start_date?: string;
          end_date?: string | null;
          last_processed_date?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      investment_recommendations: {
        Row: InvestmentRecommendation;
        Insert: {
          id?: string;
          name: string;
          provider: string;
          icon?: string;
          risk_level?: string;
          risk_color?: string;
          expected_return?: string;
          min_investment?: number;
          description?: string;
          benefits?: string[];
          color?: string;
          link_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          provider?: string;
          icon?: string;
          risk_level?: string;
          risk_color?: string;
          expected_return?: string;
          min_investment?: number;
          description?: string;
          benefits?: string[];
          color?: string;
          link_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      monthly_summary: {
        Row: MonthlySummary;
      };
      category_summary: {
        Row: CategorySummary;
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}