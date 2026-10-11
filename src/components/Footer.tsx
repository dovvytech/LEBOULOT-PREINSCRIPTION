export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} LEBOULOT
        </p>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="/privacy" className="hover:text-leboulot-green transition-colors">Confidentialité</a>
          <a href="/admin" className="hover:text-leboulot-green transition-colors">Admin</a>
        </div>
      </div>
    </footer>
  );
}
