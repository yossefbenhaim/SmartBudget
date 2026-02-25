import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { Category, TransactionType } from '@/types/database'
import { toast } from 'sonner'

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (type?: TransactionType) => [...categoryKeys.lists(), { type }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
}

// ─── Fetch all ────────────────────────────────────────────────────────────────
export function useCategories(type?: TransactionType) {
  const { user } = useAuth()

  return useQuery({
    queryKey: categoryKeys.list(type),
    queryFn: () => {
      const qs = type ? `?type=${type}` : ''
      return api.get<Category[]>(`/api/categories${qs}`)
    },
    enabled: !!user,
  })
}

// ─── Fetch single ─────────────────────────────────────────────────────────────
export function useCategory(id: string) {
  const { user } = useAuth()

  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => api.get<Category>(`/api/categories/${id}`),
    enabled: !!user && !!id,
  })
}

// ─── Create ───────────────────────────────────────────────────────────────────
export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (category: {
      name: string
      type: TransactionType
      color: string
      icon?: string | null
      description?: string | null
    }) => api.post<Category>('/api/categories', category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      toast.success('הקטגוריה נוספה בהצלחה')
    },
    onError: (error: Error) => {
      toast.error('שגיאה בהוספת קטגוריה', { description: error.message })
    },
  })
}

// ─── Update ───────────────────────────────────────────────────────────────────
export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...updates }: {
      id: string
      name?: string
      type?: TransactionType
      color?: string
      icon?: string | null
      description?: string | null
      is_active?: boolean
    }) => api.put<Category>(`/api/categories/${id}`, updates),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) })
      toast.success('הקטגוריה עודכנה בהצלחה')
    },
    onError: (error: Error) => {
      toast.error('שגיאה בעדכון קטגוריה', { description: error.message })
    },
  })
}

// ─── Delete (soft) ────────────────────────────────────────────────────────────
export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/api/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      toast.success('הקטגוריה הוסרה בהצלחה')
    },
    onError: (error: Error) => {
      toast.error('שגיאה בהסרת קטגוריה', { description: error.message })
    },
  })
}

// ─── Category summary ─────────────────────────────────────────────────────────
export function useCategorySummary() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['category-summary'],
    queryFn: () => api.get<unknown[]>('/api/summary/categories'),
    enabled: !!user,
  })
}
