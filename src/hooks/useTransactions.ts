import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { Transaction, TransactionWithCategory } from '@/types/database'
import { toast } from 'sonner'

export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters: string) => [...transactionKeys.lists(), { filters }] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
}

// ─── Fetch all transactions ────────────────────────────────────────────────────
export function useTransactions(startDate?: string, endDate?: string) {
  const { user } = useAuth()

  return useQuery({
    queryKey: transactionKeys.list(`${startDate}-${endDate}`),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (startDate) params.set('from', startDate)
      if (endDate)   params.set('to', endDate)
      params.set('limit', '200')

      const qs = params.toString()
      return api.get<TransactionWithCategory[]>(`/api/transactions${qs ? `?${qs}` : ''}`)
    },
    enabled: !!user,
  })
}

// ─── Fetch single transaction ─────────────────────────────────────────────────
export function useTransaction(id: string) {
  const { user } = useAuth()

  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => api.get<TransactionWithCategory>(`/api/transactions/${id}`),
    enabled: !!user && !!id,
  })
}

// ─── Create ───────────────────────────────────────────────────────────────────
export function useCreateTransaction() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (transaction: {
      amount: number
      type: string
      transaction_date: string
      category_id?: string | null
      description?: string | null
      notes?: string | null
    }) => api.post<Transaction>('/api/transactions', transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['monthly-summary'] })
      queryClient.invalidateQueries({ queryKey: ['category-summary'] })
      toast.success('התנועה נוספה בהצלחה')
    },
    onError: (error: Error) => {
      toast.error('שגיאה בהוספת תנועה', { description: error.message })
    },
    meta: { user },
  })
}

// ─── Update ───────────────────────────────────────────────────────────────────
export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...updates }: {
      id: string
      amount?: number
      type?: string
      transaction_date?: string
      category_id?: string | null
      description?: string | null
      notes?: string | null
    }) => api.put<Transaction>(`/api/transactions/${id}`, updates),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: ['monthly-summary'] })
      toast.success('התנועה עודכנה בהצלחה')
    },
    onError: (error: Error) => {
      toast.error('שגיאה בעדכון תנועה', { description: error.message })
    },
  })
}

// ─── Delete ───────────────────────────────────────────────────────────────────
export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/api/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['monthly-summary'] })
      toast.success('התנועה נמחקה בהצלחה')
    },
    onError: (error: Error) => {
      toast.error('שגיאה במחיקת תנועה', { description: error.message })
    },
  })
}

// ─── Monthly summary ──────────────────────────────────────────────────────────
export function useMonthlySummary(month?: string) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['monthly-summary', month],
    queryFn: () => {
      const qs = month ? `?month=${month}` : ''
      return api.get<unknown[]>(`/api/summary/monthly${qs}`)
    },
    enabled: !!user,
  })
}
