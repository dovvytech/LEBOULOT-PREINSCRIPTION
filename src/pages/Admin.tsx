import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { isAdminAuthenticated, adminLogin, adminLogout, getPreinscriptions, getAdminStats, updateTrackingStatus, exportPreinscriptions } from '../lib/storage';
import { COUNTRIES, DOMAINS, TRACKING_STATUS_LABELS, PROFILE_LABELS } from '../lib/constants';
import type { Preinscription, AdminStats, AdminFilters, TrackingStatus } from '../types';
import * as XLSX from 'xlsx';

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    setAuthenticated(isAdminAuthenticated());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(password)) {
      setAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Mot de passe incorrect.');
    }
  };

  const handleLogout = () => {
    adminLogout();
    setAuthenticated(false);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-leboulot-dark flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-leboulot-green/20 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-leboulot-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mt-4 font-[family-name:var(--font-family-display)]">Espace Admin</h1>
            <p className="text-gray-400 text-sm mt-2">LEBOULOT — Back-office de gestion</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe administrateur
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-leboulot-green/50 focus:ring-1 focus:ring-leboulot-green/50 transition-all"
                placeholder="Entrez le mot de passe"
                required
              />
              {loginError && <p className="mt-1 text-sm text-red-400">{loginError}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-leboulot-green text-black font-semibold rounded-xl hover:bg-leboulot-green/90 transition-all"
            >
              Se connecter
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            Accès réservé aux administrateurs autorisés.
          </p>
          <Link to="/" className="block text-center text-sm text-leboulot-green hover:underline mt-4">
            ← Retour au site
          </Link>
        </motion.div>
      </div>
    );
  }

  return <AdminDashboard onLogout={handleLogout} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [preinscriptions, setPreinscriptions] = useState<Preinscription[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'dashboard' | 'contacts' | 'export'>('dashboard');
  const [filters, setFilters] = useState<AdminFilters>({
    search: '',
    country: '',
    profileType: '',
    domain: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    page: 1,
    pageSize: 20,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, contactsData] = await Promise.all([
        getAdminStats(),
        getPreinscriptions(filters),
      ]);
      setStats(statsData);
      setPreinscriptions(contactsData.data);
      setTotal(contactsData.total);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusUpdate = async (id: string, status: TrackingStatus) => {
    const success = await updateTrackingStatus(id, status);
    if (success) {
      loadData();
    }
  };

  const handleExport = async () => {
    const data = await exportPreinscriptions(filters);
    if (data.length === 0) {
      alert('Aucune donnée à exporter avec les filtres actuels.');
      return;
    }

    // Sanitize data for Excel (prevent formula injection)
    const sanitized = data.map(p => ({
      'Date': new Date(p.created_at).toLocaleDateString('fr-FR'),
      'Nom': p.full_name,
      'Téléphone': p.phone_number,
      'Pays': COUNTRIES.find(c => c.code === p.country)?.name || p.country,
      'Profil': PROFILE_LABELS[p.profile_type] || p.profile_type,
      'Domaine': p.domain,
      'Canal préféré': p.preferred_channel === 'whatsapp' ? 'WhatsApp' : p.preferred_channel === 'sms' ? 'SMS' : 'Non spécifié',
      'Consentement': p.consent_given ? 'Oui' : 'Non',
      'Statut': TRACKING_STATUS_LABELS[p.tracking_status] || p.tracking_status,
    }));

    const ws = XLSX.utils.json_to_sheet(sanitized);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 12 }, // Date
      { wch: 25 }, // Nom
      { wch: 20 }, // Téléphone
      { wch: 18 }, // Pays
      { wch: 15 }, // Profil
      { wch: 25 }, // Domaine
      { wch: 15 }, // Canal
      { wch: 12 }, // Consentement
      { wch: 12 }, // Statut
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Préinscriptions');
    XLSX.writeFile(wb, `leboulot_preinscriptions_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const totalPages = Math.ceil(total / filters.pageSize);

  return (
    <div className="min-h-screen bg-leboulot-dark">
      {/* Header */}
      <header className="border-b border-white/5 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl text-leboulot-green font-bold">L</span>
            <span className="font-[family-name:var(--font-family-display)] text-lg font-bold text-leboulot-green">LEBOULOT</span>
            <span className="text-sm text-gray-500 hidden sm:inline">— Back-office</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
              Voir le site
            </Link>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm bg-white/5 rounded-lg hover:bg-white/10 transition-all text-gray-300"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex gap-1">
          {[
            { id: 'dashboard' as const, label: 'Tableau de bord' },
            { id: 'contacts' as const, label: 'Contacts' },
            { id: 'export' as const, label: 'Export' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                tab === t.id
                  ? 'border-leboulot-green text-leboulot-green'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && !stats ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-leboulot-green/30 border-t-leboulot-green rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {tab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <DashboardView stats={stats} />
              </motion.div>
            )}
            {tab === 'contacts' && (
              <motion.div key="contacts" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ContactsView
                  preinscriptions={preinscriptions}
                  total={total}
                  filters={filters}
                  setFilters={setFilters}
                  totalPages={totalPages}
                  onStatusUpdate={handleStatusUpdate}
                />
              </motion.div>
            )}
            {tab === 'export' && (
              <motion.div key="export" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ExportView
                  filters={filters}
                  setFilters={setFilters}
                  total={total}
                  onExport={handleExport}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function DashboardView({ stats }: { stats: AdminStats | null }) {
  if (!stats || stats.total === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-12 h-12 rounded-full bg-leboulot-green/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-leboulot-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Aucune préinscription</h2>
        <p className="text-gray-400">Les statistiques apparaîtront ici dès les premières inscriptions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-5">
          <p className="text-sm text-gray-400">Total inscrits</p>
          <p className="text-3xl font-bold text-leboulot-green mt-1">{stats.total}</p>
        </div>
        <div className="glass rounded-xl p-5">
          <p className="text-sm text-gray-400">Cette semaine</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.newThisWeek}</p>
        </div>
        <div className="glass rounded-xl p-5">
          <p className="text-sm text-gray-400">Pays représentés</p>
          <p className="text-3xl font-bold text-white mt-1">{Object.keys(stats.byCountry).length}</p>
        </div>
        <div className="glass rounded-xl p-5">
          <p className="text-sm text-gray-400">À contacter</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.byStatus.new || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* By country */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4">Par pays</h3>
          <div className="space-y-2">
            {Object.entries(stats.byCountry)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 8)
              .map(([code, count]) => (
                <div key={code} className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 w-28 truncate">
                    {COUNTRIES.find(c => c.code === code)?.name || code}
                  </span>
                  <div className="flex-1 bg-white/5 rounded-full h-2">
                    <div
                      className="bg-leboulot-green h-2 rounded-full transition-all"
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-300 w-8 text-right">{count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* By profile */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4">Par profil</h3>
          <div className="space-y-3">
            {Object.entries(stats.byProfile).map(([key, count]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{PROFILE_LABELS[key] || key}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-white/5 rounded-full h-2">
                    <div
                      className="bg-leboulot-green h-2 rounded-full"
                      style={{ width: stats.total > 0 ? `${(count / stats.total) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By domain */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4">Par domaine</h3>
          <div className="space-y-2">
            {Object.entries(stats.byDomain)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 8)
              .map(([domain, count]) => (
                <div key={domain} className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 flex-1 truncate">{domain}</span>
                  <span className="text-sm text-leboulot-green font-medium">{count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* By status */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4">Par statut</h3>
          <div className="space-y-3">
            {Object.entries(stats.byStatus).map(([key, count]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{TRACKING_STATUS_LABELS[key] || key}</span>
                <span className="text-sm font-medium text-leboulot-green">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      {stats.timeline.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4">Évolution des inscriptions</h3>
          <div className="flex items-end gap-1 h-32">
            {stats.timeline.slice(-14).map((point, i) => {
              const maxCount = Math.max(...stats.timeline.map(p => p.count));
              const height = maxCount > 0 ? (point.count / maxCount) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-leboulot-green/60 rounded-t transition-all hover:bg-leboulot-green"
                    style={{ height: `${Math.max(height, 4)}%` }}
                    title={`${point.date}: ${point.count}`}
                  />
                  <span className="text-[9px] text-gray-500 rotate-45 origin-left hidden lg:block">
                    {point.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ContactsView({
  preinscriptions,
  total,
  filters,
  setFilters,
  totalPages,
  onStatusUpdate,
}: {
  preinscriptions: Preinscription[];
  total: number;
  filters: AdminFilters;
  setFilters: React.Dispatch<React.SetStateAction<AdminFilters>>;
  totalPages: number;
  onStatusUpdate: (id: string, status: TrackingStatus) => void;
}) {
  const [selectedContact, setSelectedContact] = useState<Preinscription | null>(null);

  if (preinscriptions.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-12 h-12 rounded-full bg-leboulot-green/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-leboulot-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Aucun contact</h2>
        <p className="text-gray-400">Les préinscriptions apparaîtront ici.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="glass rounded-xl p-4 space-y-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Rechercher par nom ou téléphone..."
            value={filters.search}
            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:border-leboulot-green/50 transition-all"
          />
          <select
            value={filters.country}
            onChange={(e) => setFilters(f => ({ ...f, country: e.target.value, page: 1 }))}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-leboulot-green/50 transition-all"
          >
            <option value="" className="bg-gray-900">Tous les pays</option>
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code} className="bg-gray-900">{c.name}</option>
            ))}
          </select>
          <select
            value={filters.profileType}
            onChange={(e) => setFilters(f => ({ ...f, profileType: e.target.value, page: 1 }))}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-leboulot-green/50 transition-all"
          >
            <option value="" className="bg-gray-900">Tous les profils</option>
            {Object.entries(PROFILE_LABELS).map(([k, v]) => (
              <option key={k} value={k} className="bg-gray-900">{v}</option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-leboulot-green/50 transition-all"
          >
            <option value="" className="bg-gray-900">Tous les statuts</option>
            {Object.entries(TRACKING_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k} className="bg-gray-900">{v}</option>
            ))}
          </select>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <select
            value={filters.domain}
            onChange={(e) => setFilters(f => ({ ...f, domain: e.target.value, page: 1 }))}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-leboulot-green/50 transition-all"
          >
            <option value="" className="bg-gray-900">Tous les domaines</option>
            {DOMAINS.map(d => (
              <option key={d} value={d} className="bg-gray-900">{d}</option>
            ))}
          </select>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters(f => ({ ...f, dateFrom: e.target.value, page: 1 }))}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-leboulot-green/50 transition-all"
            placeholder="Date début"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters(f => ({ ...f, dateTo: e.target.value, page: 1 }))}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-leboulot-green/50 transition-all"
            placeholder="Date fin"
          />
        </div>
        <p className="text-xs text-gray-500">{total} résultat(s)</p>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Date</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Nom</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Téléphone</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium hidden lg:table-cell">Pays</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium hidden sm:table-cell">Profil</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium hidden xl:table-cell">Domaine</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Statut</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {preinscriptions.map(p => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-gray-300">{new Date(p.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-3 text-white font-medium">{p.full_name}</td>
                  <td className="px-4 py-3 text-gray-300 hidden md:table-cell font-mono text-xs">{p.phone_number}</td>
                  <td className="px-4 py-3 text-gray-300 hidden lg:table-cell">{COUNTRIES.find(c => c.code === p.country)?.name || p.country}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs">{PROFILE_LABELS[p.profile_type]}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden xl:table-cell text-xs truncate max-w-[150px]">{p.domain}</td>
                  <td className="px-4 py-3">
                    <select
                      value={p.tracking_status}
                      onChange={(e) => onStatusUpdate(p.id, e.target.value as TrackingStatus)}
                      className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-white focus:border-leboulot-green/50 transition-all"
                    >
                      {Object.entries(TRACKING_STATUS_LABELS).map(([k, v]) => (
                        <option key={k} value={k} className="bg-gray-900">{v}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedContact(p)}
                      className="text-leboulot-green hover:underline text-xs"
                    >
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
            <button
              onClick={() => setFilters(f => ({ ...f, page: Math.max(1, f.page - 1) }))}
              disabled={filters.page === 1}
              className="px-3 py-1.5 rounded-lg bg-white/5 text-sm text-gray-300 disabled:opacity-30 hover:bg-white/10 transition-all"
            >
              ← Précédent
            </button>
            <span className="text-sm text-gray-400">
              Page {filters.page} / {totalPages}
            </span>
            <button
              onClick={() => setFilters(f => ({ ...f, page: Math.min(totalPages, f.page + 1) }))}
              disabled={filters.page === totalPages}
              className="px-3 py-1.5 rounded-lg bg-white/5 text-sm text-gray-300 disabled:opacity-30 hover:bg-white/10 transition-all"
            >
              Suivant →
            </button>
          </div>
        )}
      </div>

      {/* Contact detail modal */}
      <AnimatePresence>
        {selectedContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedContact(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="glass-strong rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Détail du contact</h3>
                <button onClick={() => setSelectedContact(null)} className="text-gray-400 hover:text-white">✕</button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Nom</p>
                    <p className="font-medium">{selectedContact.full_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Téléphone</p>
                    <p className="font-mono text-sm">{selectedContact.phone_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pays</p>
                    <p>{COUNTRIES.find(c => c.code === selectedContact.country)?.name || selectedContact.country}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Profil</p>
                    <p>{PROFILE_LABELS[selectedContact.profile_type]}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Domaine</p>
                    <p>{selectedContact.domain}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Canal préféré</p>
                    <p>{selectedContact.preferred_channel === 'whatsapp' ? 'WhatsApp' : selectedContact.preferred_channel === 'sms' ? 'SMS' : 'Non spécifié'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Consentement</p>
                    <p className={selectedContact.consent_given ? 'text-leboulot-green' : 'text-red-400'}>
                      {selectedContact.consent_given ? 'Donné' : 'Non donné'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date de consentement</p>
                    <p className="text-sm">{new Date(selectedContact.consent_date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Inscrit le</p>
                    <p className="text-sm">{new Date(selectedContact.created_at).toLocaleString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Statut</p>
                    <p className="text-leboulot-green">{TRACKING_STATUS_LABELS[selectedContact.tracking_status]}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExportView({
  filters,
  setFilters,
  total,
  onExport,
}: {
  filters: AdminFilters;
  setFilters: React.Dispatch<React.SetStateAction<AdminFilters>>;
  total: number;
  onExport: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-4">Exporter les préinscriptions</h3>
        <p className="text-gray-400 text-sm mb-6">
          Générez un fichier Excel (.xlsx) contenant les contacts correspondant aux filtres sélectionnés.
          Les numéros de téléphone sont conservés au format texte pour préserver le format international.
        </p>

        {/* Filters for export */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <select
            value={filters.country}
            onChange={(e) => setFilters(f => ({ ...f, country: e.target.value }))}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
          >
            <option value="" className="bg-gray-900">Tous les pays</option>
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code} className="bg-gray-900">{c.name}</option>
            ))}
          </select>
          <select
            value={filters.profileType}
            onChange={(e) => setFilters(f => ({ ...f, profileType: e.target.value }))}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
          >
            <option value="" className="bg-gray-900">Tous les profils</option>
            {Object.entries(PROFILE_LABELS).map(([k, v]) => (
              <option key={k} value={k} className="bg-gray-900">{v}</option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
          >
            <option value="" className="bg-gray-900">Tous les statuts</option>
            {Object.entries(TRACKING_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k} className="bg-gray-900">{v}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onExport}
            disabled={total === 0}
            className="px-6 py-3 bg-leboulot-green text-black font-semibold rounded-xl hover:bg-leboulot-green/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Télécharger Excel ({total} contact{total > 1 ? 's' : ''})
          </button>
          <span className="text-sm text-gray-400">
            Format .xlsx — Les téléphones sont au format texte
          </span>
        </div>
      </div>

      {/* Message template */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-4">Modèle de message de lancement</h3>
        <p className="text-gray-400 text-sm mb-4">
          Ce modèle sera utilisé pour contacter les inscrits éligibles (consentement donné, non désabonnés).
        </p>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-sm text-gray-300 leading-relaxed">
            Bonjour {'{Prénom}'},<br /><br />
            C'est avec plaisir que nous vous annonçons l'ouverture de <strong className="text-leboulot-green">LEBOULOT</strong>, 
            la plateforme de freelances pensée pour l'Afrique.<br /><br />
            En tant qu'inscrit(e) de la première heure, vous bénéficiez d'un accès prioritaire.<br /><br />
            👉 {'{lien_plateforme}'}<br /><br />
            À très bientôt sur LEBOULOT !<br />
            L'équipe LEBOULOT
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Ce modèle est modifiable. L'envoi réel nécessite l'intégration d'un fournisseur WhatsApp Business ou SMS (voir documentation).
        </p>
      </div>

      {/* Integration docs */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-4">Intégration future : WhatsApp / SMS</h3>
        <div className="text-sm text-gray-400 space-y-3">
          <p>Pour activer l'envoi de messages, vous devrez :</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Créer un compte <strong className="text-white">WhatsApp Business API</strong> (via Meta Business) ou un fournisseur SMS (Twilio, Orange SMS API, etc.)</li>
            <li>Ajouter les clés API dans les variables d'environnement Vercel</li>
            <li>Implémenter l'endpoint d'envoi côté serveur (jamais côté client)</li>
            <li>Respecter les réglementations locales sur les communications commerciales</li>
          </ol>
          <p className="mt-4 text-yellow-400/80">
            N'ajoutez jamais de tokens API dans le frontend ou le dépôt Git.
          </p>
        </div>
      </div>
    </div>
  );
}
