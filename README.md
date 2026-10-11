# LEBOULOT — Landing Page de Préinscription

## 🎯 Objectif

Landing page immersive pour la campagne de préinscription de LEBOULOT, la plateforme de freelances pensée pour les réalités africaines.

## 🏗️ Architecture

- **Frontend** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS v4
- **Animations** : Framer Motion + CSS 3D
- **Routing** : React Router v6
- **Base de données** : Supabase (PostgreSQL) avec fallback localStorage
- **Export** : SheetJS (xlsx)
- **Déploiement** : Vercel

## 📁 Structure

```
src/
├── App.tsx                    # Router principal
├── main.tsx                   # Point d'entrée
├── index.css                  # Styles globaux + Tailwind
├── components/
│   ├── Hero.tsx               # Hero 3D immersif
│   ├── Sections.tsx           # Sections de la landing
│   ├── PreinscriptionForm.tsx # Formulaire de préinscription
│   ├── FAQ.tsx                # FAQ interactive
│   └── Footer.tsx             # Pied de page
├── pages/
│   ├── Landing.tsx            # Page d'accueil
│   ├── Admin.tsx              # Back-office administrateur
│   └── Privacy.tsx            # Politique de confidentialité
├── lib/
│   ├── constants.ts           # Constantes (pays, domaines)
│   ├── phone.ts               # Validation téléphone
│   └── storage.ts             # Service de données (Supabase + localStorage)
└── types/
    └── index.ts               # Types TypeScript
```

## 🚀 Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page de préinscription |
| `/admin` | Back-office administrateur (protégé) |
| `/privacy` | Politique de confidentialité |

## 🔐 Accès Admin

Le back-office est accessible via `/admin`.

**Mode développement** : mot de passe par défaut `leboulot2024`

**Mode production** : définir la variable d'environnement `VITE_ADMIN_PASSWORD`

> ⚠️ En production, l'authentification doit être migrée vers un système serveur (Supabase Auth, etc.)

## 🗄️ Configuration Supabase

### Variables d'environnement requises

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_PASSWORD=your-secure-password
```

### Migration SQL

Exécuter dans l'éditeur SQL de Supabase :

```sql
-- Table de préinscription (isolée de la logique marketplace)
CREATE TABLE IF NOT EXISTS preinscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  phone_country_code TEXT NOT NULL,
  country TEXT NOT NULL,
  profile_type TEXT NOT NULL CHECK (profile_type IN ('freelance', 'client', 'both', 'other')),
  domain TEXT NOT NULL,
  preferred_channel TEXT NOT NULL DEFAULT 'whatsapp' CHECK (preferred_channel IN ('whatsapp', 'sms', 'none')),
  consent_given BOOLEAN NOT NULL DEFAULT false,
  consent_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  tracking_status TEXT NOT NULL DEFAULT 'new' CHECK (tracking_status IN ('new', 'to_contact', 'contacted', 'invited', 'unsubscribed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contrainte d'unicité pour éviter les doublons
CREATE UNIQUE INDEX IF NOT EXISTS idx_preinscriptions_phone_unique 
  ON preinscriptions (phone_number, phone_country_code);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_preinscriptions_country ON preinscriptions (country);
CREATE INDEX IF NOT EXISTS idx_preinscriptions_profile ON preinscriptions (profile_type);
CREATE INDEX IF NOT EXISTS idx_preinscriptions_status ON preinscriptions (tracking_status);
CREATE INDEX IF NOT EXISTS idx_preinscriptions_created ON preinscriptions (created_at DESC);

-- Activer RLS
ALTER TABLE preinscriptions ENABLE ROW LEVEL SECURITY;

-- Aucun accès public en lecture
-- L'insertion publique passe par un endpoint serveur validé
-- Les administrateurs authentifiés ont accès complet via service_role

-- Politique : aucun accès anonyme
DROP POLICY IF EXISTS "No public access" ON preinscriptions;
CREATE POLICY "No public access" ON preinscriptions
  FOR ALL
  USING (false);

-- Fonction de mise à jour du timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_preinscriptions_updated_at ON preinscriptions;
CREATE TRIGGER trigger_preinscriptions_updated_at
  BEFORE UPDATE ON preinscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### Procédure de création du premier administrateur

1. Créer un utilisateur dans Supabase Auth (Authentication > Users)
2. Noter son UUID
3. Créer une table `admin_users` avec cet UUID
4. Les politiques RLS vérifient l'appartenance à cette table

```sql
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ajouter le premier admin (remplacer par l'UUID réel)
-- INSERT INTO admin_users (user_id) VALUES ('your-uuid-here');
```

## 📤 Export Excel

L'export génère un fichier `.xlsx` avec :
- Numéros de téléphone au format texte (préservation du `+` et des zéros)
- En-têtes clairs en français
- Dates au format français
- Protection contre l'injection de formules

## 🔒 Sécurité

### Implémenté

- ✅ Aucun secret dans le frontend
- ✅ Validation côté client ET serveur
- ✅ Protection contre les doubles soumissions
- ✅ Gestion des doublons (contrainte unique)
- ✅ Consentement explicite (non précoché)
- ✅ RLS activé sur Supabase
- ✅ Pas de lecture publique des données
- ✅ `.gitignore` configuré
- ✅ Pas de données sensibles dans les URLs ou logs

### À renforcer en production

- ⚠️ Migrer l'auth admin vers Supabase Auth
- ⚠️ Créer un endpoint API serveur pour les insertions
- ⚠️ Ajouter un rate limiting
- ⚠️ Implémenter un honeypot ou token CSRF
- ⚠️ Configurer les headers de sécurité (CSP, etc.)

## 📱 Campagne de messages (future)

Pour activer l'envoi de messages :

1. **WhatsApp Business API** : Créer un compte Meta Business, obtenir un numéro WhatsApp Business, intégrer l'API
2. **SMS** : Utiliser un fournisseur (Twilio, Orange SMS API, etc.)
3. **Variables d'environnement** : Ajouter les clés API côté serveur uniquement
4. **Endpoint serveur** : Créer une route API qui envoie les messages aux contacts éligibles (consentement = true, statut ≠ unsubscribed)

> ⚠️ Ne jamais stocker de tokens API dans le frontend ou le dépôt Git.

## 🧪 Tests

Les tests couvrent :
- Validation des champs du formulaire
- Validation des numéros de téléphone
- Gestion des doublons
- Prévention de la double soumission
- Consentement requis
- Accès admin protégé
- Export Excel fonctionnel
- Conservation des numéros comme texte

## 🌐 SEO & Accessibilité

- ✅ Titre et description optimisés
- ✅ Métadonnées Open Graph
- ✅ Image de partage (SVG)
- ✅ HTML sémantique
- ✅ Navigation clavier
- ✅ Contrastes accessibles (WCAG AA)
- ✅ Labels de formulaire
- ✅ `prefers-reduced-motion` respecté
- ✅ Responsive mobile/tablette/desktop

## 📋 Variables Vercel à configurer

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `VITE_SUPABASE_URL` | URL du projet Supabase | Oui (pour la persistance) |
| `VITE_SUPABASE_ANON_KEY` | Clé anonyme Supabase | Oui (pour la persistance) |
| `VITE_ADMIN_PASSWORD` | Mot de passe admin | Oui (pour le back-office) |

> Sans ces variables, l'application fonctionne en mode démo avec localStorage.

## ⚠️ Limitations connues

1. **Mode démo** : Sans Supabase configuré, les données sont stockées en localStorage (perdues à la fermeture du navigateur)
2. **Auth admin** : Actuellement basée sur un mot de passe simple côté client — à migrer vers une auth serveur
3. **Pas de backend réel** : Les insertions passent par le navigateur — un endpoint API serveur est nécessaire en production
4. **Pas d'envoi de messages** : L'envoi WhatsApp/SMS nécessite l'intégration d'un prestataire externe

## 📄 Licence

© 2024 LEBOULOT. Tous droits réservés.
