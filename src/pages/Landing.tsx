import Hero from '../components/Hero';
import { AboutSection, AdvantagesSection, HowItWorks } from '../components/Sections';
import PreinscriptionForm from '../components/PreinscriptionForm';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-leboulot-dark text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-family-display)] text-lg font-bold text-leboulot-green">LEBOULOT</span>
          </a>
          <div className="hidden sm:flex items-center gap-6">
            <a href="#apropos" className="text-sm text-gray-300 hover:text-white transition-colors">À propos</a>
            <a href="#avantages" className="text-sm text-gray-300 hover:text-white transition-colors">Avantages</a>
          </div>
          <a
            href="#preinscription"
            className="px-4 py-2 bg-leboulot-green text-black text-sm font-semibold rounded-lg hover:bg-leboulot-green/90 transition-all"
          >
            Rejoindre
          </a>
        </div>
      </nav>

      {/* Main content */}
      <main>
        <Hero />
        <AboutSection />
        <AdvantagesSection />
        <HowItWorks />
        <FAQ />
        <PreinscriptionForm />
      </main>

      <Footer />
    </div>
  );
}
