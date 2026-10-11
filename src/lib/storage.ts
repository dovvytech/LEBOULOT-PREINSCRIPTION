import { createClient } from '@supabase/supabase-js';
import type { Preinscription, PreinscriptionInput, AdminStats, AdminFilters, TrackingStatus } from '../types';

// Supabase client - only initialized if env vars are present
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const hasSupabase = supabaseUrl && supabaseAnonKey;

const supabase = hasSupabase 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// LocalStorage fallback for development/demo
const STORAGE_KEY = 'leboulot_preinscriptions';
const ADMIN_KEY = 'leboulot_admin_session';

function getLocalData(): Preinscription[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setLocalData(data: Preinscription[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function generateId(): string {
  return `pre_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============ PUBLIC API (Preinscription) ============

export async function createPreinscription(input: PreinscriptionInput): Promise<{ success: boolean; error?: string; data?: Preinscription }> {
  const now = new Date().toISOString();
  const record: Preinscription = {
    id: generateId(),
    full_name: input.full_name.trim(),
    phone_number: input.phone_number,
    phone_country_code: input.phone_country_code,
    country: input.country,
    profile_type: input.profile_type,
    domain: input.domain,
    preferred_channel: input.preferred_channel,
    consent_given: input.consent_given,
    consent_date: now,
    tracking_status: 'new',
    created_at: now,
    updated_at: now,
  };

  if (hasSupabase && supabase) {
    // Use server-side API route for security
    try {
      const response = await fetch('/api/preinscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, error: errorData.error || 'Erreur serveur.' };
      }
      
      return { success: true, data: record };
    } catch {
      // Fallback to localStorage if API is unavailable
      return createPreinscriptionLocal(record);
    }
  }

  return createPreinscriptionLocal(record);
}

function createPreinscriptionLocal(record: Preinscription): { success: boolean; error?: string; data?: Preinscription } {
  const existing = getLocalData();
  
  // Check for duplicates by phone number
  const duplicate = existing.find(
    p => p.phone_number === record.phone_number && p.phone_country_code === record.phone_country_code
  );
  
  if (duplicate) {
    return { success: false, error: 'Ce numéro est déjà inscrit. Vous recevrez notre message de lancement.' };
  }

  const updated = [...existing, record];
  setLocalData(updated);
  return { success: true, data: record };
}

// ============ ADMIN API ============

export function isAdminAuthenticated(): boolean {
  try {
    const session = localStorage.getItem(ADMIN_KEY);
    if (!session) return false;
    const data = JSON.parse(session);
    return data.authenticated === true && data.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export function adminLogin(password: string): boolean {
  // In production, this would be a server-side authentication
  // For now, we use a simple check - the actual password should be set via env var
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || '';
  
  if (!adminPassword) {
    // If no password is configured, use a dev mode password
    if (password === 'leboulot2024') {
      const session = { authenticated: true, expiresAt: Date.now() + 24 * 60 * 60 * 1000 };
      localStorage.setItem(ADMIN_KEY, JSON.stringify(session));
      return true;
    }
    return false;
  }
  
  if (password === adminPassword) {
    const session = { authenticated: true, expiresAt: Date.now() + 24 * 60 * 60 * 1000 };
    localStorage.setItem(ADMIN_KEY, JSON.stringify(session));
    return true;
  }
  
  return false;
}

export function adminLogout(): void {
  localStorage.removeItem(ADMIN_KEY);
}

export async function getPreinscriptions(filters: AdminFilters): Promise<{ data: Preinscription[]; total: number }> {
  if (hasSupabase && supabase) {
    try {
      const response = await fetch('/api/admin/preinscriptions?' + new URLSearchParams({
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== '')),
      }).toString());
      if (response.ok) {
        return response.json();
      }
    } catch {
      // Fallback
    }
  }

  return getPreinscriptionsLocal(filters);
}

function getPreinscriptionsLocal(filters: AdminFilters): { data: Preinscription[]; total: number } {
  let data = getLocalData();

  // Apply filters
  if (filters.search) {
    const search = filters.search.toLowerCase();
    data = data.filter(p => 
      p.full_name.toLowerCase().includes(search) || 
      p.phone_number.includes(search)
    );
  }
  if (filters.country) {
    data = data.filter(p => p.country === filters.country);
  }
  if (filters.profileType) {
    data = data.filter(p => p.profile_type === filters.profileType);
  }
  if (filters.domain) {
    data = data.filter(p => p.domain === filters.domain);
  }
  if (filters.status) {
    data = data.filter(p => p.tracking_status === filters.status);
  }
  if (filters.dateFrom) {
    data = data.filter(p => p.created_at >= filters.dateFrom);
  }
  if (filters.dateTo) {
    data = data.filter(p => p.created_at <= filters.dateTo);
  }

  // Sort by date descending
  data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const total = data.length;
  
  // Paginate
  const start = (filters.page - 1) * filters.pageSize;
  const paginated = data.slice(start, start + filters.pageSize);

  return { data: paginated, total };
}

export async function getAdminStats(): Promise<AdminStats> {
  if (hasSupabase && supabase) {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        return response.json();
      }
    } catch {
      // Fallback
    }
  }

  return getAdminStatsLocal();
}

function getAdminStatsLocal(): AdminStats {
  const data = getLocalData();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const byCountry: Record<string, number> = {};
  const byProfile: Record<string, number> = { freelance: 0, client: 0, both: 0, other: 0 };
  const byDomain: Record<string, number> = {};
  const byStatus: Record<string, number> = { new: 0, to_contact: 0, contacted: 0, invited: 0, unsubscribed: 0 };
  const timelineMap: Record<string, number> = {};

  let newThisWeek = 0;

  data.forEach(p => {
    // By country
    byCountry[p.country] = (byCountry[p.country] || 0) + 1;
    
    // By profile
    byProfile[p.profile_type] = (byProfile[p.profile_type] || 0) + 1;
    
    // By domain
    byDomain[p.domain] = (byDomain[p.domain] || 0) + 1;
    
    // By status
    byStatus[p.tracking_status] = (byStatus[p.tracking_status] || 0) + 1;
    
    // New this week
    if (new Date(p.created_at) >= weekAgo) {
      newThisWeek++;
    }
    
    // Timeline
    const date = p.created_at.split('T')[0];
    timelineMap[date] = (timelineMap[date] || 0) + 1;
  });

  const timeline = Object.entries(timelineMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    total: data.length,
    newThisWeek,
    byCountry,
    byProfile: byProfile as AdminStats['byProfile'],
    byDomain,
    byStatus: byStatus as AdminStats['byStatus'],
    timeline,
  };
}

export async function updateTrackingStatus(id: string, status: TrackingStatus): Promise<boolean> {
  if (hasSupabase && supabase) {
    try {
      const response = await fetch(`/api/admin/preinscriptions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracking_status: status }),
      });
      if (response.ok) return true;
    } catch {
      // Fallback
    }
  }

  return updateTrackingStatusLocal(id, status);
}

function updateTrackingStatusLocal(id: string, status: TrackingStatus): boolean {
  const data = getLocalData();
  const index = data.findIndex(p => p.id === id);
  if (index === -1) return false;
  
  data[index].tracking_status = status;
  data[index].updated_at = new Date().toISOString();
  setLocalData(data);
  return true;
}

export async function exportPreinscriptions(filters: AdminFilters): Promise<Preinscription[]> {
  // Get all matching records (no pagination for export)
  const allFilters = { ...filters, page: 1, pageSize: 10000 };
  const { data } = await getPreinscriptions(allFilters);
  return data;
}
