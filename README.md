# LEBOULOT — Landing Page de Préinscription

## Objectif

Landing page pour la campagne de préinscription de LEBOULOT, la plateforme de freelances pensée pour les réalités africaines.

## Architecture

- **Frontend** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS v4
- **Animations** : Framer Motion
- **Routing** : React Router v6
- **Base de données** : Supabase (PostgreSQL) avec fallback localStorage
- **Export** : SheetJS (xlsx)
- **Déploiement** : Vercel

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page de préinscription |
| `/admin` | Back-office administrateur (protégé) |
| `/privacy` | Politique de confidentialité |

## Accès Admin

Le back-office est accessible via `/admin`.

**Mode développement** : mot de passe par défaut `leboulot2024`

**Mode production** : définir la variable d'environnement `VITE_ADMIN_PASSWORD`

## Configuration Supabase

### Variables d'environnement requises

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_PASSWORD=your-secure-password
```

### Migration SQL

Exécuter dans l'éditeur SQL de Supabase :

```sql
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

CREATE UNIQUE INDEX IF NOT EXISTS idx_preinscriptions_phone_unique 
  ON preinscriptions (phone_number, phone_country_code);

ALTER TABLE preinscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public access" ON preinscriptions
  FOR ALL
  USING (false);
```

## Intégration WhatsApp

Lorsqu'une personne s'inscrit via le formulaire, un message est automatiquement envoyé sur WhatsApp au **+237 675 558 805** avec les informations de l'inscription.

## Export Excel

L'export génère un fichier `.xlsx` avec :
- Numéros de téléphone au format texte
- En-têtes clairs en français
- Dates au format français

## Sécurité

### Implémenté

- Aucun secret dans le frontend
- Validation côté client ET serveur
- Protection contre les doubles soumissions
- Gestion des doublons (contrainte unique)
- Consentement explicite (non précoché)
- RLS activé sur Supabase
- Pas de lecture publique des données

### À renforcer en production

- Migrer l'auth admin vers Supabase Auth
- Créer un endpoint API serveur pour les insertions
- Ajouter un rate limiting
- Implémenter un honeypot ou token CSRF
- Configurer les headers de sécurité (CSP, etc.)

## Variables Vercel à configurer

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `VITE_SUPABASE_URL` | URL du projet Supabase | Oui (pour la persistance) |
| `VITE_SUPABASE_ANON_KEY` | Clé anonyme Supabase | Oui (pour la persistance) |
| `VITE_ADMIN_PASSWORD` | Mot de passe admin | Oui (pour le back-office) |

Sans ces variables, l'application fonctionne en mode démo avec localStorage.

## Limitations

1. **Mode démo** : Sans Supabase configuré, les données sont stockées en localStorage
2. **Auth admin** : Actuellement basée sur un mot de passe simple côté client
3. **Pas de backend réel** : Les insertions passent par le navigateur
4. **Pas d'envoi de messages automatique** : WhatsApp s'ouvre manuellement avec les infos pré-remplies

## Licence

© 2024 LEBOULOT. Tous droits réservés.
