import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COUNTRIES, DOMAINS } from '../lib/constants';
import { validatePhone } from '../lib/phone';
import { createPreinscription } from '../lib/storage';
import type { ProfileType, ContactChannel, PreinscriptionInput } from '../types';

type FormStep = 'form' | 'loading' | 'success' | 'error';

export default function PreinscriptionForm() {
  const [step, setStep] = useState<FormStep>('form');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('CI');
  const [profileType, setProfileType] = useState<ProfileType>('freelance');
  const [domain, setDomain] = useState('');
  const [preferredChannel, setPreferredChannel] = useState<ContactChannel>('whatsapp');
  const [consent, setConsent] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const selectedCountry = COUNTRIES.find(c => c.code === countryCode);

  const validate = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = 'Veuillez entrer votre nom complet.';
    }

    const phoneResult = validatePhone(phone, countryCode);
    if (!phoneResult.valid) {
      errors.phone = phoneResult.error || 'Numéro invalide.';
    }

    if (!domain) {
      errors.domain = 'Veuillez sélectionner un domaine.';
    }

    if (!consent) {
      errors.consent = 'Vous devez accepter de recevoir notre message de lancement.';
    }

    if (!privacyAccepted) {
      errors.privacy = 'Vous devez accepter la politique de confidentialité.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [fullName, phone, countryCode, domain, consent, privacyAccepted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitting) return; // Prevent double submission
    
    if (!validate()) return;

    setSubmitting(true);
    setStep('loading');
    setError('');

    const phoneResult = validatePhone(phone, countryCode);
    
    const input: PreinscriptionInput = {
      full_name: fullName.trim(),
      phone_number: phoneResult.normalized,
      phone_country_code: selectedCountry?.dialCode || '',
      country: countryCode,
      profile_type: profileType,
      domain,
      preferred_channel: preferredChannel,
      consent_given: consent,
    };

    try {
      const result = await createPreinscription(input);
      
      if (result.success) {
        setStep('success');
      } else {
        setStep('error');
        setError(result.error || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } catch {
      setStep('error');
      setError('Erreur de connexion. Veuillez vérifier votre réseau et réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep('form');
    setError('');
    setFullName('');
    setPhone('');
    setCountryCode('CI');
    setProfileType('freelance');
    setDomain('');
    setPreferredChannel('whatsapp');
    setConsent(false);
    setPrivacyAccepted(false);
    setFieldErrors({});
  };

  return (
    <Section id="preinscription">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-leboulot-green text-sm font-semibold uppercase tracking-wider">Préinscription</span>
          <h2 className="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl font-bold mt-3">
            Rejoignez la liste de lancement
          </h2>
          <p className="text-gray-400 mt-3">
            Gratuit, sans engagement. Soyez parmi les premiers à découvrir LEBOULOT.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="glass-strong rounded-2xl p-6 sm:p-8 space-y-6"
              noValidate
            >
              {/* Full name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                  Nom complet <span className="text-red-400">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setFieldErrors(prev => ({ ...prev, fullName: '' })); }}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-leboulot-green/50 focus:ring-1 focus:ring-leboulot-green/50 transition-all"
                  placeholder="Ex: Awa Koné"
                  autoComplete="name"
                  required
                />
                {fieldErrors.fullName && <p className="mt-1 text-sm text-red-400">{fieldErrors.fullName}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Numéro de téléphone <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-leboulot-green/50 focus:ring-1 focus:ring-leboulot-green/50 transition-all min-w-[140px]"
                    aria-label="Pays"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code} className="bg-gray-900">
                        {c.name} {c.dialCode && `(${c.dialCode})`}
                      </option>
                    ))}
                  </select>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setFieldErrors(prev => ({ ...prev, phone: '' })); }}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-leboulot-green/50 focus:ring-1 focus:ring-leboulot-green/50 transition-all"
                    placeholder="07 00 00 00 00"
                    autoComplete="tel"
                    required
                  />
                </div>
                {fieldErrors.phone && <p className="mt-1 text-sm text-red-400">{fieldErrors.phone}</p>}
              </div>

              {/* Profile type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Vous êtes <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { value: 'freelance' as ProfileType, label: 'Freelance' },
                    { value: 'client' as ProfileType, label: 'Client' },
                    { value: 'both' as ProfileType, label: 'Les deux' },
                    { value: 'other' as ProfileType, label: 'Autre' },
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setProfileType(option.value)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        profileType === option.value
                          ? 'bg-leboulot-green text-black'
                          : 'bg-white/5 border border-white/10 text-gray-300 hover:border-leboulot-green/30'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Domain */}
              <div>
                <label htmlFor="domain" className="block text-sm font-medium text-gray-300 mb-2">
                  {profileType === 'client' ? 'Secteur recherché' : 'Domaine de compétence'} <span className="text-red-400">*</span>
                </label>
                <select
                  id="domain"
                  value={domain}
                  onChange={(e) => { setDomain(e.target.value); setFieldErrors(prev => ({ ...prev, domain: '' })); }}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-leboulot-green/50 focus:ring-1 focus:ring-leboulot-green/50 transition-all"
                  required
                >
                  <option value="" className="bg-gray-900">Sélectionnez un domaine</option>
                  {DOMAINS.map(d => (
                    <option key={d} value={d} className="bg-gray-900">{d}</option>
                  ))}
                </select>
                {fieldErrors.domain && <p className="mt-1 text-sm text-red-400">{fieldErrors.domain}</p>}
              </div>

              {/* Preferred channel */}
              {(profileType !== 'other') && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Comment souhaitez-vous être contacté(e) ?
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPreferredChannel('whatsapp')}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        preferredChannel === 'whatsapp'
                          ? 'bg-leboulot-green text-black'
                          : 'bg-white/5 border border-white/10 text-gray-300 hover:border-leboulot-green/30'
                      }`}
                    >
                      <span>💬</span> WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreferredChannel('sms')}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        preferredChannel === 'sms'
                          ? 'bg-leboulot-green text-black'
                          : 'bg-white/5 border border-white/10 text-gray-300 hover:border-leboulot-green/30'
                      }`}
                    >
                      <span>📱</span> SMS
                    </button>
                  </div>
                </div>
              )}

              {/* Consent */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => { setConsent(e.target.checked); setFieldErrors(prev => ({ ...prev, consent: '' })); }}
                    className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-leboulot-green focus:ring-leboulot-green/50"
                  />
                  <span className="text-sm text-gray-300">
                    J'accepte de recevoir un message m'annonçant l'ouverture de la plateforme LEBOULOT. <span className="text-red-400">*</span>
                  </span>
                </label>
                {fieldErrors.consent && <p className="text-sm text-red-400 ml-7">{fieldErrors.consent}</p>}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(e) => { setPrivacyAccepted(e.target.checked); setFieldErrors(prev => ({ ...prev, privacy: '' })); }}
                    className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-leboulot-green focus:ring-leboulot-green/50"
                  />
                  <span className="text-sm text-gray-300">
                    J'ai lu et j'accepte la{' '}
                    <a href="/privacy" className="text-leboulot-green underline hover:text-leboulot-green/80">
                      politique de confidentialité
                    </a>. <span className="text-red-400">*</span>
                  </span>
                </label>
                {fieldErrors.privacy && <p className="text-sm text-red-400 ml-7">{fieldErrors.privacy}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-leboulot-green text-black font-semibold rounded-xl hover:bg-leboulot-green/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {submitting ? 'Envoi en cours...' : "S'inscrire à la liste de lancement"}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Vos données sont protégées et ne seront jamais partagées avec des tiers.
              </p>
            </motion.form>
          )}

          {step === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-strong rounded-2xl p-12 text-center"
            >
              <div className="w-12 h-12 border-4 border-leboulot-green/30 border-t-leboulot-green rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-300">Inscription en cours...</p>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-strong rounded-2xl p-8 sm:p-12 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-leboulot-green/20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-leboulot-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Inscription confirmée !</h3>
              <p className="text-gray-400 mb-6">
                Merci <strong className="text-white">{fullName}</strong> ! Vous faites maintenant partie de la liste de lancement LEBOULOT. 
                Vous recevrez un message dès que la plateforme sera disponible.
              </p>
              <button
                onClick={resetForm}
                className="text-leboulot-green hover:underline text-sm"
              >
                Inscrire une autre personne
              </button>
            </motion.div>
          )}

          {step === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-strong rounded-2xl p-8 sm:p-12 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Une erreur est survenue</h3>
              <p className="text-gray-400 mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setStep('form')}
                  className="px-6 py-2.5 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all"
                >
                  Réessayer
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-leboulot-green/10 text-leboulot-green rounded-xl hover:bg-leboulot-green/20 transition-all"
                >
                  Nouveau formulaire
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}

function Section({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`py-20 lg:py-28 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
}
