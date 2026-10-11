import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

function Section({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`py-20 lg:py-28 px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </motion.section>
  );
}

export function AboutSection() {
  return (
    <Section id="decouvrir">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          Un problème <span className="text-leboulot-green">réel</span>, une solution pensée pour nous.
        </h2>
        <p className="text-lg text-gray-400 leading-relaxed mb-8">
          En Afrique, les talents sont partout — mais les opportunités restent concentrées. 
          Les freelances peinent à se faire connaître au-delà de leur réseau immédiat. 
          Les entreprises cherchent des compétences fiables sans savoir où les trouver. 
          Les plateformes internationales ignorent nos réalités : paiements, devises, 
          confiance, langues, connectivité.
        </p>
        <p className="text-lg text-gray-400 leading-relaxed">
          <strong className="text-white">LEBOULOT</strong> naît de ce constat. 
          Nous construisons la première plateforme de mise en relation entre freelances 
          et clients, pensée depuis et pour le continent africain.
        </p>
      </div>
    </Section>
  );
}

export function FreelanceBenefits() {
  const benefits = [
    { icon: '🎯', title: 'Visibilité ciblée', desc: 'Votre profil est vu par des clients qui cherchent exactement vos compétences.' },
    { icon: '💰', title: 'Paiements adaptés', desc: 'Mobile money, virement local, crypto — les modes de paiement que vous utilisez déjà.' },
    { icon: '🌍', title: 'Rayonnement continental', desc: 'Travaillez avec des clients dans toute l\'Afrique et dans la diaspora.' },
    { icon: '🤝', title: 'Communauté de confiance', desc: 'Système de vérification et d\'avis pour bâtir votre réputation.' },
  ];

  return (
    <Section>
      <div className="text-center mb-16">
        <span className="text-leboulot-green text-sm font-semibold uppercase tracking-wider">Pour les freelances</span>
        <h2 className="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl font-bold mt-3">
          Trouvez les missions qui vous correspondent
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-6 hover:border-leboulot-green/30 transition-all duration-300 group"
          >
            <div className="text-3xl mb-4">{b.icon}</div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-leboulot-green transition-colors">{b.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

export function ClientBenefits() {
  const benefits = [
    { icon: '⚡', title: 'Recrutement rapide', desc: 'Accédez à un vivier de talents vérifiés, prêts à démarrer.' },
    { icon: '🔒', title: 'Sécurité & confiance', desc: 'Profils vérifiés, avis authentiques, transactions sécurisées.' },
    { icon: '📍', title: 'Talents locaux', desc: 'Trouvez des professionnels qui comprennent votre marché et votre culture.' },
    { icon: '📈', title: 'Évolutivité', desc: 'De la mission ponctuelle au partenariat long terme, à votre rythme.' },
  ];

  return (
    <Section>
      <div className="text-center mb-16">
        <span className="text-leboulot-green text-sm font-semibold uppercase tracking-wider">Pour les clients</span>
        <h2 className="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl font-bold mt-3">
          Trouvez les bons talents, au bon moment
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-6 hover:border-leboulot-green/30 transition-all duration-300 group"
          >
            <div className="text-3xl mb-4">{b.icon}</div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-leboulot-green transition-colors">{b.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

export function HowItWorks() {
  const steps = [
    { num: '01', title: 'Inscrivez-vous', desc: 'Rejoignez la liste de lancement en quelques secondes. C\'est gratuit et sans engagement.' },
    { num: '02', title: 'Soyez informé', desc: 'Recevez un message dès que la plateforme ouvre dans votre pays. Accès prioritaire réservé aux inscrits.' },
    { num: '03', title: 'Commencez à collaborer', desc: 'Créez votre profil, publiez vos missions ou proposez vos services. Le talent rencontre l\'opportunité.' },
  ];

  return (
    <Section>
      <div className="text-center mb-16">
        <span className="text-leboulot-green text-sm font-semibold uppercase tracking-wider">Comment ça marche</span>
        <h2 className="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl font-bold mt-3">
          Trois étapes simples
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="relative text-center"
          >
            <div className="text-6xl lg:text-7xl font-bold text-leboulot-green/20 font-[family-name:var(--font-family-display)] mb-4">
              {step.num}
            </div>
            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
            <p className="text-gray-400 leading-relaxed">{step.desc}</p>
            {i < 2 && (
              <div className="hidden md:block absolute top-12 -right-6 w-12 text-leboulot-green/30">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

export function CategoriesSection() {
  const categories = [
    { name: 'Tech & Développement', icon: '💻', count: 'Dev web, mobile, data' },
    { name: 'Design & Créativité', icon: '🎨', count: 'UI/UX, graphisme, vidéo' },
    { name: 'Marketing & Communication', icon: '📣', count: 'Digital, contenu, SEO' },
    { name: 'Finance & Comptabilité', icon: '📊', count: 'Gestion, audit, conseil' },
    { name: 'Rédaction & Traduction', icon: '✍️', count: 'Copywriting, localisation' },
    { name: 'BTP & Artisanat', icon: '🔧', count: 'Construction, rénovation' },
    { name: 'Formation & Coaching', icon: '📚', count: 'Enseignement, mentorat' },
    { name: 'Logistique & Transport', icon: '🚚', count: 'Supply chain, livraison' },
  ];

  return (
    <Section>
      <div className="text-center mb-16">
        <span className="text-leboulot-green text-sm font-semibold uppercase tracking-wider">Catégories</span>
        <h2 className="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl font-bold mt-3">
          Tous les métiers, une seule plateforme
        </h2>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          LEBOULOT couvrira l'ensemble des compétences recherchées sur le continent. 
          Voici un aperçu des catégories prévues.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-5 text-center hover:border-leboulot-green/30 transition-all duration-300 cursor-default"
          >
            <div className="text-2xl mb-2">{cat.icon}</div>
            <h3 className="font-medium text-sm mb-1">{cat.name}</h3>
            <p className="text-xs text-gray-500">{cat.count}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

export function WhyJoinSection() {
  const reasons = [
    'Accès prioritaire à la plateforme dès son ouverture',
    'Profil mis en avant pendant la phase de lancement',
    'Influencez le développement : vos besoins façonnent la plateforme',
    'Tarifs préférentiels réservés aux premiers inscrits',
    'Rejoignez une communauté de talents et d\'entrepreneurs africains',
    'Restez informé des avancées du projet',
  ];

  return (
    <Section>
      <div className="glass-strong rounded-3xl p-8 sm:p-12 lg:p-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl font-bold mb-8 text-center">
            Pourquoi rejoindre la liste de <span className="text-leboulot-green">lancement</span> ?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {reasons.map((reason, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-leboulot-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-leboulot-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-300">{reason}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
