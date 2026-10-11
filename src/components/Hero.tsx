import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-leboulot-green/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-leboulot-green/3 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-leboulot-green animate-pulse" />
          <span className="text-sm text-gray-300">Préinscription gratuite — Plateforme en préparation</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-[family-name:var(--font-family-display)] text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
        >
          Le talent africain mérite de{' '}
          <span className="text-leboulot-green">trouver ses opportunités.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          LEBOULOT connecte les freelances africains aux projets qui comptent. 
          Une plateforme pensée pour nos réalités.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#preinscription"
            className="inline-flex items-center justify-center px-8 py-4 bg-leboulot-green text-black font-semibold rounded-xl hover:bg-leboulot-green/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(163,230,53,0.3)] text-lg"
          >
            Rejoindre la liste de lancement
          </a>
          <a
            href="#avantages"
            className="inline-flex items-center justify-center px-8 py-4 glass text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-300 text-lg"
          >
            Voir les avantages
          </a>
        </motion.div>
      </div>
    </section>
  );
}
