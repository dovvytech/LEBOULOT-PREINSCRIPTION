export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <span className="font-[family-name:var(--font-family-display)] text-xl font-bold text-leboulot-green">LEBOULOT</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              La plateforme de freelances pensée pour l'Afrique. En cours de développement.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm text-white mb-3">Projet</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#apropos" className="hover:text-leboulot-green transition-colors">À propos</a></li>
              <li><a href="#avantages" className="hover:text-leboulot-green transition-colors">Avantages</a></li>
              <li><a href="#preinscription" className="hover:text-leboulot-green transition-colors">Préinscription</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-white mb-3">Légal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/privacy" className="hover:text-leboulot-green transition-colors">Confidentialité</a></li>
              <li><a href="/admin" className="hover:text-leboulot-green transition-colors">Espace admin</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-white mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>contact@leboulot.app</li>
              <li className="text-gray-500">Plateforme en préparation</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} LEBOULOT. Tous droits réservés.
          </p>
          <p className="text-xs text-gray-600">
            Fait pour l'Afrique
          </p>
        </div>
      </div>
    </footer>
  );
}
