/**
 * SmartBudget API Client
 * All data operations go through the backend — no Supabase keys in browser
 */
import { supabase } from './supabase'

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.smart-budget.byclick.co.il'

async function getToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) throw new Error('Not authenticated')
  return session.access_token
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const token = await getToken()

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return undefined as T

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.error || `API error ${res.status}`)
  }

  return data as T
}

export const api = {
  get:    <T>(path: string)                    => request<T>('GET',    path),
  post:   <T>(path: string, body: unknown)     => request<T>('POST',   path, body),
  put:    <T>(path: string, body: unknown)     => request<T>('PUT',    path, body),
  patch:  <T>(path: string, body?: unknown)    => request<T>('PATCH',  path, body),
  delete: <T>(path: string)                    => request<T>('DELETE', path),
}
