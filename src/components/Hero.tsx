import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background subtil */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-leboulot-green/5 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-sm text-gray-300">
            Préinscription gratuite
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-[family-name:var(--font-family-display)] text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
        >
          Le talent africain mérite{' '}
          <span className="text-leboulot-green">ses opportunités</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
        >
          La plateforme qui connecte les freelances africains aux projets qui comptent.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#preinscription"
            className="px-8 py-4 bg-leboulot-green text-black font-semibold rounded-xl hover:bg-leboulot-green/90 transition-all text-lg"
          >
            Rejoindre la liste
          </a>
          <a
            href="#apropos"
            className="px-8 py-4 glass text-white font-medium rounded-xl hover:bg-white/10 transition-all text-lg"
          >
            En savoir plus
          </a>
        </motion.div>
      </div>
    </section>
  );
}
