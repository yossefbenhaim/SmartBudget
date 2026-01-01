import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Transaction, TransactionInsert, TransactionUpdate, TransactionWithCategory } from '@/types/database';
import { toast } from 'sonner';

// ============================================================================
// QUERY KEYS
// ============================================================================
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters: string) => [...transactionKeys.lists(), { filters }] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
};

// ============================================================================
// FETCH TRANSACTIONS
// ============================================================================
export function useTransactions(startDate?: string, endDate?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: transactionKeys.list(`${startDate}-${endDate}`),
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('transactions')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false });

      if (startDate) {
        query = query.gte('transaction_date', startDate);
      }
      if (endDate) {
        query = query.lte('transaction_date', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as TransactionWithCategory[];
    },
    enabled: !!user,
  });
}

// ============================================================================
// GET SINGLE TRANSACTION
// ============================================================================
export function useTransaction(id: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data as TransactionWithCategory;
    },
    enabled: !!user && !!id,
  });
}

// ============================================================================
// CREATE TRANSACTION
// ============================================================================
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (transaction: Omit<TransactionInsert, 'user_id'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('transactions')
        .insert({ ...transaction, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      toast.success('התנועה נוספה בהצלחה');
    },
    onError: (error) => {
      toast.error('שגיאה בהוספת תנועה', {
        description: error.message,
      });
    },
  });
}

// ============================================================================
// UPDATE TRANSACTION
// ============================================================================
export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...updates }: TransactionUpdate & { id: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.id) });
      toast.success('התנועה עודכנה בהצלחה');
    },
    onError: (error) => {
      toast.error('שגיאה בעדכון תנועה', {
        description: error.message,
      });
    },
  });
}

// ============================================================================
// DELETE TRANSACTION
// ============================================================================
export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      toast.success('התנועה נמחקה בהצלחה');
    },
    onError: (error) => {
      toast.error('שגיאה במחיקת תנועה', {
        description: error.message,
      });
    },
  });
}

// ============================================================================
// GET MONTHLY SUMMARY
// ============================================================================
export function useMonthlySummary(month?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['monthly-summary', month],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('monthly_summary')
        .select('*')
        .eq('user_id', user.id);

      if (month) {
        query = query.eq('month', month);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
