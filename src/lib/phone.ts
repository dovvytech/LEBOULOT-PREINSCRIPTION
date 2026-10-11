import { COUNTRIES } from './constants';

export function validatePhone(phone: string, countryCode: string): { valid: boolean; normalized: string; error?: string } {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  if (!digits) {
    return { valid: false, normalized: '', error: 'Le numéro de téléphone est requis.' };
  }

  // Minimum 6 digits for any valid phone number
  if (digits.length < 6) {
    return { valid: false, normalized: '', error: 'Le numéro est trop court.' };
  }

  // Maximum 15 digits (ITU-T E.164 standard)
  if (digits.length > 15) {
    return { valid: false, normalized: '', error: 'Le numéro est trop long.' };
  }

  const country = COUNTRIES.find(c => c.code === countryCode);
  if (!country) {
    return { valid: false, normalized: '', error: 'Pays non reconnu.' };
  }

  // Build the full international number
  const dialCode = country.dialCode.replace(/\D/g, '');
  const fullNumber = dialCode ? `${country.dialCode}${digits}` : `+${digits}`;
  
  return { valid: true, normalized: fullNumber };
}

export function formatPhoneDisplay(phone: string): string {
  return phone || '';
}

export function getCountryByCode(code: string) {
  return COUNTRIES.find(c => c.code === code);
}
