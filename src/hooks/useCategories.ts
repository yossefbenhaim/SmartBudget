import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Category, CategoryInsert, CategoryUpdate, TransactionType } from '@/types/database';
import { toast } from 'sonner';

// ============================================================================
// QUERY KEYS
// ============================================================================
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (type?: TransactionType) => [...categoryKeys.lists(), { type }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

// ============================================================================
// FETCH CATEGORIES
// ============================================================================
export function useCategories(type?: TransactionType) {
  const { user } = useAuth();

  return useQuery({
    queryKey: categoryKeys.list(type),
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('name');

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Category[];
    },
    enabled: !!user,
  });
}

// ============================================================================
// GET SINGLE CATEGORY
// ============================================================================
export function useCategory(id: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data as Category;
    },
    enabled: !!user && !!id,
  });
}

// ============================================================================
// CREATE CATEGORY
// ============================================================================
export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (category: Omit<CategoryInsert, 'user_id'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('categories')
        .insert({ ...category, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success('הקטגוריה נוספה בהצלחה');
    },
    onError: (error) => {
      toast.error('שגיאה בהוספת קטגוריה', {
        description: error.message,
      });
    },
  });
}

// ============================================================================
// UPDATE CATEGORY
// ============================================================================
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...updates }: CategoryUpdate & { id: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
      toast.success('הקטגוריה עודכנה בהצלחה');
    },
    onError: (error) => {
      toast.error('שגיאה בעדכון קטגוריה', {
        description: error.message,
      });
    },
  });
}

// ============================================================================
// DELETE CATEGORY
// ============================================================================
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success('הקטגוריה נמחקה בהצלחה');
    },
    onError: (error) => {
      toast.error('שגיאה במחיקת קטגוריה', {
        description: error.message,
      });
    },
  });
}

// ============================================================================
// GET CATEGORY SUMMARY
// ============================================================================
export function useCategorySummary() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['category-summary'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('category_summary')
        .select('*')
        .eq('user_id', user.id)
        .order('total_amount', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
