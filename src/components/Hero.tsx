import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function FloatingCard({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, y: 40, rotateX: -20 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    >
      <motion.div
        animate={{
          y: [0, -12, 0],
          rotateY: [0, 3, -3, 0],
          rotateX: [0, 2, -2, 0],
        }}
        transition={{
          duration: 6 + delay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-leboulot-green/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-leboulot-green/3 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-leboulot-green/2 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-leboulot-green animate-pulse" />
              <span className="text-sm text-gray-300">Préinscription gratuite — Plateforme en préparation</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-[family-name:var(--font-family-display)] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
            >
              Le talent africain mérite de{' '}
              <span className="text-leboulot-green">trouver ses opportunités.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              LEBOULOT connecte les freelances africains aux projets qui comptent. 
              Une plateforme pensée pour nos réalités, nos besoins, notre continent.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <a
                href="#preinscription"
                className="inline-flex items-center justify-center px-8 py-4 bg-leboulot-green text-black font-semibold rounded-xl hover:bg-leboulot-green/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(163,230,53,0.3)] text-lg"
              >
                Rejoindre la liste de lancement
              </a>
              <a
                href="#decouvrir"
                className="inline-flex items-center justify-center px-8 py-4 glass text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-300 text-lg"
              >
                Découvrir le projet
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-6 text-sm text-gray-500"
            >
              ✓ Gratuit &nbsp; ✓ Sans engagement &nbsp; ✓ Soyez parmi les premiers informés
            </motion.p>
          </div>

          {/* Right: 3D Composition */}
          {mounted && !prefersReducedMotion && (
            <div className="relative h-[400px] lg:h-[500px] perspective-container hidden sm:block">
              {/* Central sphere */}
              <FloatingCard className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" delay={0}>
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-leboulot-green/20 to-leboulot-green/5 border border-leboulot-green/30 flex items-center justify-center glow-green">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-leboulot-green/40 to-transparent flex items-center justify-center">
                    <span className="text-3xl lg:text-4xl">⚡</span>
                  </div>
                </div>
              </FloatingCard>

              {/* Floating cards */}
              <FloatingCard className="top-8 left-8 lg:left-4" delay={0.2}>
                <div className="glass-strong rounded-xl p-4 w-44 lg:w-52">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-leboulot-green/20 flex items-center justify-center text-sm">💻</div>
                    <div>
                      <p className="text-xs text-gray-400">Mission</p>
                      <p className="text-sm font-medium text-white">Développeur React</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-leboulot-green">Remote</span>
                    <span className="text-xs text-gray-500">Abidjan</span>
                  </div>
                </div>
              </FloatingCard>

              <FloatingCard className="top-16 right-4 lg:right-8" delay={0.4}>
                <div className="glass-strong rounded-xl p-4 w-40 lg:w-48">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs">🎨</div>
                    <p className="text-sm font-medium">UI Designer</p>
                  </div>
                  <div className="flex gap-1">
                    <span className="px-2 py-0.5 rounded-full bg-leboulot-green/10 text-[10px] text-leboulot-green">Figma</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-[10px] text-purple-300">UX</span>
                  </div>
                </div>
              </FloatingCard>

              <FloatingCard className="bottom-16 left-4 lg:left-12" delay={0.6}>
                <div className="glass-strong rounded-xl p-4 w-44">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-xs">📊</div>
                    <p className="text-sm font-medium">Marketing</p>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div className="bg-leboulot-green h-1.5 rounded-full w-3/4" />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Projet en cours</p>
                </div>
              </FloatingCard>

              <FloatingCard className="bottom-8 right-8 lg:right-16" delay={0.8}>
                <div className="glass-strong rounded-xl p-3 w-36 lg:w-44">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-leboulot-green/20 flex items-center justify-center">
                      <span className="text-xs">🌍</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Pays actifs</p>
                      <p className="text-sm font-bold text-leboulot-green">25+</p>
                    </div>
                  </div>
                </div>
              </FloatingCard>

              {/* Connection lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 500 500">
                <motion.path
                  d="M250 250 Q 150 150 120 100"
                  stroke="rgba(163, 230, 53, 0.3)"
                  strokeWidth="1"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1 }}
                />
                <motion.path
                  d="M250 250 Q 350 150 380 120"
                  stroke="rgba(163, 230, 53, 0.3)"
                  strokeWidth="1"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1.3 }}
                />
                <motion.path
                  d="M250 250 Q 150 350 100 380"
                  stroke="rgba(163, 230, 53, 0.3)"
                  strokeWidth="1"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1.6 }}
                />
                <motion.path
                  d="M250 250 Q 350 350 400 380"
                  stroke="rgba(163, 230, 53, 0.3)"
                  strokeWidth="1"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1.9 }}
                />
              </svg>
            </div>
          )}

          {/* Fallback for reduced motion or mobile */}
          {(!mounted || prefersReducedMotion) && (
            <div className="relative h-[300px] hidden sm:flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-leboulot-green/20 to-leboulot-green/5 border border-leboulot-green/30 flex items-center justify-center">
                <span className="text-6xl">⚡</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 rounded-full bg-leboulot-green" />
        </div>
      </motion.div>
    </section>
  );
}
