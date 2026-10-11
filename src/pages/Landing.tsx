import Hero from '../components/Hero';
import { AboutSection, AdvantagesSection, HowItWorks } from '../components/Sections';
import PreinscriptionForm from '../components/PreinscriptionForm';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-leboulot-dark text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="/" className="font-[family-name:var(--font-family-display)] text-lg font-bold text-leboulot-green">
            LEBOULOT
          </a>
          <a
            href="#preinscription"
            className="px-4 py-2 bg-leboulot-green text-black text-sm font-semibold rounded-lg hover:bg-leboulot-green/90 transition-all"
          >
            Rejoindre
          </a>
        </div>
      </nav>

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
