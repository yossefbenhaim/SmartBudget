-- ============================================================================
-- SmartBudget Database Schema
-- ============================================================================
-- This schema creates a complete personal budget management system with:
-- - Multi-user support with strict data isolation
-- - Categories for income and expenses
-- - Transactions tracking
-- - Budget goals and limits
-- - Investment tracking
-- - Row Level Security (RLS) to ensure each user only sees their own data
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. USER PROFILES TABLE
-- ============================================================================
-- Extended user information beyond auth.users
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    currency TEXT DEFAULT 'ILS',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 2. CATEGORIES TABLE
-- ============================================================================
-- Categories for organizing transactions (income/expense)
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    color TEXT DEFAULT '#6366f1',
    icon TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name, type)
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
CREATE POLICY "Users can view own categories"
    ON public.categories FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
    ON public.categories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
    ON public.categories FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
    ON public.categories FOR DELETE
    USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_categories_user_id ON public.categories(user_id);
CREATE INDEX idx_categories_type ON public.categories(user_id, type);

-- ============================================================================
-- 3. TRANSACTIONS TABLE
-- ============================================================================
-- All financial transactions (income and expenses)
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    description TEXT,
    notes TEXT,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transactions
CREATE POLICY "Users can view own transactions"
    ON public.transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
    ON public.transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
    ON public.transactions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
    ON public.transactions FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes for faster queries
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_date ON public.transactions(user_id, transaction_date DESC);
CREATE INDEX idx_transactions_category ON public.transactions(category_id);
CREATE INDEX idx_transactions_type ON public.transactions(user_id, type);

-- ============================================================================
-- 4. BUDGETS TABLE
-- ============================================================================
-- Monthly budget limits per category
CREATE TABLE public.budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount >= 0),
    period TEXT NOT NULL CHECK (period IN ('monthly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for budgets
CREATE POLICY "Users can view own budgets"
    ON public.budgets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets"
    ON public.budgets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets"
    ON public.budgets FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets"
    ON public.budgets FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_budgets_user_id ON public.budgets(user_id);
CREATE INDEX idx_budgets_category ON public.budgets(category_id);
CREATE INDEX idx_budgets_dates ON public.budgets(user_id, start_date, end_date);

-- ============================================================================
-- 5. INVESTMENTS TABLE
-- ============================================================================
-- Track investments and savings
CREATE TABLE public.investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('stocks', 'bonds', 'crypto', 'real_estate', 'savings', 'other')),
    initial_amount DECIMAL(12, 2) NOT NULL CHECK (initial_amount >= 0),
    current_value DECIMAL(12, 2) NOT NULL CHECK (current_value >= 0),
    currency TEXT DEFAULT 'ILS',
    purchase_date DATE NOT NULL,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for investments
CREATE POLICY "Users can view own investments"
    ON public.investments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investments"
    ON public.investments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own investments"
    ON public.investments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own investments"
    ON public.investments FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_investments_user_id ON public.investments(user_id);
CREATE INDEX idx_investments_type ON public.investments(user_id, type);

-- ============================================================================
-- 6. SAVINGS GOALS TABLE
-- ============================================================================
-- Track savings goals
CREATE TABLE public.savings_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL CHECK (target_amount > 0),
    current_amount DECIMAL(12, 2) DEFAULT 0 CHECK (current_amount >= 0),
    deadline DATE,
    description TEXT,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for savings_goals
CREATE POLICY "Users can view own savings goals"
    ON public.savings_goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own savings goals"
    ON public.savings_goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own savings goals"
    ON public.savings_goals FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own savings goals"
    ON public.savings_goals FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_savings_goals_user_id ON public.savings_goals(user_id);

-- ============================================================================
-- 7. RECURRING TRANSACTIONS TABLE
-- ============================================================================
-- Track recurring income/expenses
CREATE TABLE public.recurring_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    description TEXT NOT NULL,
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE,
    last_processed_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.recurring_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recurring_transactions
CREATE POLICY "Users can view own recurring transactions"
    ON public.recurring_transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recurring transactions"
    ON public.recurring_transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recurring transactions"
    ON public.recurring_transactions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recurring transactions"
    ON public.recurring_transactions FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_recurring_transactions_user_id ON public.recurring_transactions(user_id);
CREATE INDEX idx_recurring_transactions_active ON public.recurring_transactions(user_id, is_active);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON public.budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON public.investments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_savings_goals_updated_at BEFORE UPDATE ON public.savings_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_transactions_updated_at BEFORE UPDATE ON public.recurring_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTION: Auto-create profile on user signup
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- INSERT DEFAULT CATEGORIES FOR NEW USERS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.create_default_categories()
RETURNS TRIGGER AS $$
BEGIN
    -- Default expense categories
    INSERT INTO public.categories (user_id, name, type, color, icon) VALUES
        (NEW.id, 'מזון', 'expense', '#ef4444', '🍔'),
        (NEW.id, 'תחבורה', 'expense', '#f59e0b', '🚗'),
        (NEW.id, 'דיור', 'expense', '#8b5cf6', '🏠'),
        (NEW.id, 'בריאות', 'expense', '#10b981', '⚕️'),
        (NEW.id, 'בידור', 'expense', '#ec4899', '🎮'),
        (NEW.id, 'קניות', 'expense', '#06b6d4', '🛍️'),
        (NEW.id, 'חינוך', 'expense', '#6366f1', '📚'),
        (NEW.id, 'חשבונות', 'expense', '#f97316', '📱'),
        (NEW.id, 'אחר', 'expense', '#64748b', '📦');

    -- Default income categories
    INSERT INTO public.categories (user_id, name, type, color, icon) VALUES
        (NEW.id, 'משכורת', 'income', '#22c55e', '💰'),
        (NEW.id, 'פרילנס', 'income', '#3b82f6', '💼'),
        (NEW.id, 'השקעות', 'income', '#a855f7', '📈'),
        (NEW.id, 'מתנות', 'income', '#f43f5e', '🎁'),
        (NEW.id, 'אחר', 'income', '#14b8a6', '💵');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default categories on profile creation
CREATE TRIGGER on_profile_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.create_default_categories();

-- ============================================================================
-- HELPFUL VIEWS
-- ============================================================================

-- View: Monthly summary per user
CREATE OR REPLACE VIEW public.monthly_summary AS
SELECT
    user_id,
    DATE_TRUNC('month', transaction_date) as month,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as net_amount
FROM public.transactions
GROUP BY user_id, DATE_TRUNC('month', transaction_date);

-- View: Category spending summary
CREATE OR REPLACE VIEW public.category_summary AS
SELECT
    t.user_id,
    c.name as category_name,
    c.type,
    c.color,
    COUNT(t.id) as transaction_count,
    SUM(t.amount) as total_amount
FROM public.transactions t
LEFT JOIN public.categories c ON t.category_id = c.id
GROUP BY t.user_id, c.id, c.name, c.type, c.color;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.profiles IS 'Extended user profile information';
COMMENT ON TABLE public.categories IS 'Transaction categories (income/expense) - isolated per user';
COMMENT ON TABLE public.transactions IS 'All financial transactions - isolated per user';
COMMENT ON TABLE public.budgets IS 'Budget limits per category - isolated per user';
COMMENT ON TABLE public.investments IS 'Investment tracking - isolated per user';
COMMENT ON TABLE public.savings_goals IS 'Savings goals - isolated per user';
COMMENT ON TABLE public.recurring_transactions IS 'Recurring transactions setup - isolated per user';
