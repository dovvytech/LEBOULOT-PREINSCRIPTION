import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COUNTRIES, DOMAINS } from '../lib/constants';
import { validatePhone } from '../lib/phone';
import { createPreinscription } from '../lib/storage';
import { sendWhatsApp } from '../lib/whatsapp';
import type { ProfileType, ContactChannel, PreinscriptionInput } from '../types';

type FormStep = 'form' | 'loading' | 'success' | 'error';

export default function PreinscriptionForm() {
  const [step, setStep] = useState<FormStep>('form');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('CI');
  const [profileType, setProfileType] = useState<ProfileType>('freelance');
  const [domain, setDomain] = useState('');
  const [consent, setConsent] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const selectedCountry = COUNTRIES.find(c => c.code === countryCode);

  const validate = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = 'Nom requis';
    }

    const phoneResult = validatePhone(phone, countryCode);
    if (!phoneResult.valid) {
      errors.phone = phoneResult.error || 'Numéro invalide';
    }

    if (!domain) {
      errors.domain = 'Domaine requis';
    }

    if (!consent) {
      errors.consent = 'Consentement requis';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [fullName, phone, countryCode, domain, consent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitting) return;
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
      preferred_channel: 'whatsapp' as ContactChannel,
      consent_given: consent,
    };

    try {
      const result = await createPreinscription(input);
      
      if (result.success) {
        setStep('success');
        
        const message = `Nouvelle préinscription LEBOULOT:\n\nNom: ${fullName}\nTéléphone: ${phoneResult.normalized}\nPays: ${selectedCountry?.name}\nProfil: ${profileType}\nDomaine: ${domain}`;
        sendWhatsApp(message);
      } else {
        setStep('error');
        setError(result.error || 'Erreur. Réessayez.');
      }
    } catch {
      setStep('error');
      setError('Erreur de connexion.');
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
    setConsent(false);
    setFieldErrors({});
  };

  return (
    <section id="preinscription" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl font-bold mb-3"
          >
            Rejoignez la liste
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400"
          >
            Gratuit. Sans engagement.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="glass-strong rounded-2xl p-6 sm:p-8 space-y-5"
              noValidate
            >
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                  Nom complet
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setFieldErrors(prev => ({ ...prev, fullName: '' })); }}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-leboulot-green/50 focus:ring-1 focus:ring-leboulot-green/50 transition-all"
                  placeholder="Votre nom"
                  required
                />
                {fieldErrors.fullName && <p className="mt-1 text-sm text-red-400">{fieldErrors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Téléphone
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-leboulot-green/50 focus:ring-1 focus:ring-leboulot-green/50 transition-all min-w-[120px]"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code} className="bg-gray-900">
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setFieldErrors(prev => ({ ...prev, phone: '' })); }}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-leboulot-green/50 focus:ring-1 focus:ring-leboulot-green/50 transition-all"
                    placeholder="Numéro"
                    required
                  />
                </div>
                {fieldErrors.phone && <p className="mt-1 text-sm text-red-400">{fieldErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Vous êtes
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'freelance' as ProfileType, label: 'Freelance' },
                    { value: 'client' as ProfileType, label: 'Client' },
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

              <div>
                <label htmlFor="domain" className="block text-sm font-medium text-gray-300 mb-2">
                  Domaine
                </label>
                <select
                  id="domain"
                  value={domain}
                  onChange={(e) => { setDomain(e.target.value); setFieldErrors(prev => ({ ...prev, domain: '' })); }}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-leboulot-green/50 focus:ring-1 focus:ring-leboulot-green/50 transition-all"
                  required
                >
                  <option value="" className="bg-gray-900">Sélectionnez</option>
                  {DOMAINS.map(d => (
                    <option key={d} value={d} className="bg-gray-900">{d}</option>
                  ))}
                </select>
                {fieldErrors.domain && <p className="mt-1 text-sm text-red-400">{fieldErrors.domain}</p>}
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => { setConsent(e.target.checked); setFieldErrors(prev => ({ ...prev, consent: '' })); }}
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-leboulot-green focus:ring-leboulot-green/50"
                />
                <span className="text-sm text-gray-300">
                  J'accepte de recevoir un message lors du lancement. <a href="/privacy" className="text-leboulot-green underline">Politique</a>
                </span>
              </label>
              {fieldErrors.consent && <p className="text-sm text-red-400 ml-7">{fieldErrors.consent}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-leboulot-green text-black font-semibold rounded-xl hover:bg-leboulot-green/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {submitting ? 'Envoi...' : "S'inscrire"}
              </button>
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
              className="glass-strong rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-leboulot-green/20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-leboulot-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Inscription confirmée !</h3>
              <p className="text-gray-400 mb-6">
                Merci {fullName} ! Vous recevrez un message dès l'ouverture.
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
              className="glass-strong rounded-2xl p-8 text-center"
            >
              <h3 className="text-xl font-bold mb-3">Erreur</h3>
              <p className="text-gray-400 mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setStep('form')}
                  className="px-6 py-2.5 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all"
                >
                  Réessayer
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
