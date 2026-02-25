import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { InvestmentRecommendation } from '@/types/database'
import { useAuth } from '@/contexts/AuthContext'

export const investmentRecommendationKeys = {
  all: ['investment-recommendations'] as const,
  lists: () => [...investmentRecommendationKeys.all, 'list'] as const,
}

export function useInvestmentRecommendations() {
  const { user } = useAuth()

  return useQuery({
    queryKey: investmentRecommendationKeys.lists(),
    queryFn: () => api.get<InvestmentRecommendation[]>('/api/recommendations'),
    enabled: !!user,
    staleTime: 1000 * 60 * 60, // Cache 1 hour
  })
}
