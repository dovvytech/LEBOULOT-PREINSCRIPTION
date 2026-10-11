export type ProfileType = 'freelance' | 'client' | 'both' | 'other';

export type ContactChannel = 'whatsapp' | 'sms' | 'none';

export type TrackingStatus = 'new' | 'to_contact' | 'contacted' | 'invited' | 'unsubscribed';

export interface Preinscription {
  id: string;
  full_name: string;
  phone_number: string;
  phone_country_code: string;
  country: string;
  profile_type: ProfileType;
  domain: string;
  preferred_channel: ContactChannel;
  consent_given: boolean;
  consent_date: string;
  tracking_status: TrackingStatus;
  created_at: string;
  updated_at: string;
}

export interface PreinscriptionInput {
  full_name: string;
  phone_number: string;
  phone_country_code: string;
  country: string;
  profile_type: ProfileType;
  domain: string;
  preferred_channel: ContactChannel;
  consent_given: boolean;
}

export interface AdminStats {
  total: number;
  newThisWeek: number;
  byCountry: Record<string, number>;
  byProfile: Record<ProfileType, number>;
  byDomain: Record<string, number>;
  byStatus: Record<TrackingStatus, number>;
  timeline: { date: string; count: number }[];
}

export interface AdminFilters {
  search: string;
  country: string;
  profileType: string;
  domain: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  page: number;
  pageSize: number;
}
