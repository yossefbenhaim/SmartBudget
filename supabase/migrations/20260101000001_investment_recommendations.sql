-- ============================================================================
-- INVESTMENT RECOMMENDATIONS TABLE
-- ============================================================================
-- Reference data for available investment products
-- This table contains static data that's the same for all users

-- Create table only if it doesn't exist
CREATE TABLE IF NOT EXISTS public.investment_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    provider TEXT NOT NULL,
    icon TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    risk_color TEXT NOT NULL,
    expected_return TEXT NOT NULL,
    min_investment DECIMAL(12, 2) NOT NULL DEFAULT 0,
    description TEXT NOT NULL,
    benefits TEXT[] NOT NULL,
    color TEXT NOT NULL,
    link_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (but allow all authenticated users to read)
ALTER TABLE public.investment_recommendations ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if exists and recreate
DROP POLICY IF EXISTS "Anyone can view investment recommendations" ON public.investment_recommendations;
CREATE POLICY "Anyone can view investment recommendations"
    ON public.investment_recommendations FOR SELECT
    TO authenticated
    USING (is_active = true);

-- Create index if it doesn't exist
DROP INDEX IF EXISTS idx_investment_recommendations_active;
CREATE INDEX idx_investment_recommendations_active ON public.investment_recommendations(is_active, display_order);

-- ============================================================================
-- SEED DATA: Insert investment recommendations
-- ============================================================================
-- Only insert if table is empty
INSERT INTO public.investment_recommendations (name, provider, icon, risk_level, risk_color, expected_return, min_investment, description, benefits, color, link_url, display_order)
SELECT * FROM (VALUES
    ('קניית מניות בנק הפועלים', 'בנק הפועלים', 'Building2', 'בינוני', 'bg-yellow-500', '6-10%', 1000, 'השקעה במניות הבנק דרך חשבון המסחר בבנק הפועלים. מתאים למשקיעים לטווח בינוני-ארוך.', ARRAY['נזילות גבוהה', 'דיבידנדים', 'פיקוח בנק ישראל'], 'from-blue-500 to-blue-600', 'https://www.bankhapoalim.co.il/he/private/investments', 1),
    ('פתיחת תיק השקעות', 'Bit', 'Smartphone', 'נמוך-בינוני', 'bg-green-500', '4-8%', 500, 'תיק השקעות מנוהל באפליקציית Bit. מתאים למתחילים ולמי שרוצה ניהול אוטומטי.', ARRAY['ניהול אוטומטי', 'עמלות נמוכות', 'ממשק ידידותי'], 'from-purple-500 to-purple-600', 'https://www.bitinvest.co.il/', 2),
    ('קרן השתלמות', 'חברות ביטוח', 'PiggyBank', 'נמוך', 'bg-green-500', '3-6%', 0, 'חיסכון עם הטבות מס משמעותיות. ניתן למשיכה לאחר 6 שנים או לצורך השתלמות.', ARRAY['הטבות מס', 'חיסכון לטווח ארוך', 'ביטחון'], 'from-emerald-500 to-emerald-600', 'https://www.isa.gov.il/%D7%94%D7%A9%D7%A7%D7%A2%D7%95%D7%AA/%D7%9E%D7%95%D7%A6%D7%A8%D7%99%D7%9D-%D7%A4%D7%A0%D7%A1%D7%99%D7%95%D7%A0%D7%99%D7%99%D7%9D/pages/study-funds.aspx', 3),
    ('קרנות סל (ETF)', 'בורסה לני״ע', 'BarChart3', 'בינוני', 'bg-yellow-500', '5-12%', 100, 'קרנות העוקבות אחרי מדדים כמו ת״א 125 או S&P 500. פיזור סיכונים אוטומטי.', ARRAY['פיזור רחב', 'עמלות נמוכות', 'שקיפות'], 'from-orange-500 to-orange-600', 'https://www.tase.co.il/he/market_data/etf', 4),
    ('אג״ח ממשלתי', 'בנק ישראל', 'Landmark', 'נמוך מאוד', 'bg-blue-500', '2-4%', 1000, 'איגרות חוב של מדינת ישראל. השקעה בטוחה עם תשואה קבועה.', ARRAY['בטיחות גבוהה', 'תשואה קבועה', 'נזילות'], 'from-slate-500 to-slate-600', 'https://www.tase.co.il/he/market_data/bonds/government_bonds', 5),
    ('ביטוח מנהלים', 'חברות ביטוח', 'Shield', 'נמוך', 'bg-green-500', '3-5%', 0, 'חיסכון פנסיוני עם כיסוי ביטוחי. מתאים לשכירים ועצמאים.', ARRAY['כיסוי ביטוחי', 'הטבות מס', 'חיסכון לפנסיה'], 'from-indigo-500 to-indigo-600', 'https://www.isa.gov.il/%D7%94%D7%A9%D7%A7%D7%A2%D7%95%D7%AA/%D7%9E%D7%95%D7%A6%D7%A8%D7%99%D7%9D-%D7%A4%D7%A0%D7%A1%D7%99%D7%95%D7%A0%D7%99%D7%99%D7%9D/pages/provident-funds.aspx', 6)
) AS v(name, provider, icon, risk_level, risk_color, expected_return, min_investment, description, benefits, color, link_url, display_order)
WHERE NOT EXISTS (
    SELECT 1 FROM public.investment_recommendations
);
