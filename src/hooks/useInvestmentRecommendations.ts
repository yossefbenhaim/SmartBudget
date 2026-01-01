import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { InvestmentRecommendation } from '@/types/database';

// ============================================================================
// QUERY KEYS
// ============================================================================
export const investmentRecommendationKeys = {
  all: ['investment-recommendations'] as const,
  lists: () => [...investmentRecommendationKeys.all, 'list'] as const,
};

// ============================================================================
// FETCH INVESTMENT RECOMMENDATIONS
// ============================================================================
export function useInvestmentRecommendations() {
  return useQuery({
    queryKey: investmentRecommendationKeys.lists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investment_recommendations')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as InvestmentRecommendation[];
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour since this is reference data
  });
}
