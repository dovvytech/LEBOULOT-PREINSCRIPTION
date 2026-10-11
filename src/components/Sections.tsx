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
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </motion.section>
  );
}

export function AboutSection() {
  return (
    <Section id="apropos">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          Un problème <span className="text-leboulot-green">réel</span>
        </h2>
        <p className="text-lg text-gray-400 leading-relaxed mb-6">
          En Afrique, les talents sont partout mais les opportunités restent concentrées. 
          Les freelances peinent à se faire connaître. Les entreprises cherchent des compétences fiables sans savoir où les trouver.
        </p>
        <p className="text-lg text-gray-400 leading-relaxed">
          <strong className="text-white">LEBOULOT</strong> connecte les freelances et les clients sur une plateforme pensée pour nos réalités : paiements locaux, confiance, accessibilité.
        </p>
      </div>
    </Section>
  );
}

export function AdvantagesSection() {
  return (
    <Section id="avantages">
      <div className="text-center mb-16">
        <h2 className="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl font-bold">
          Pourquoi rejoindre <span className="text-leboulot-green">LEBOULOT</span> ?
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        <AdvantageCard
          title="Accès prioritaire"
          description="Soyez parmi les premiers à utiliser la plateforme dès son ouverture dans votre pays."
        />
        <AdvantageCard
          title="Visibilité ciblée"
          description="Votre profil est vu par des clients qui cherchent exactement vos compétences."
        />
        <AdvantageCard
          title="Paiements adaptés"
          description="Mobile money, virement local — les modes de paiement que vous utilisez déjà."
        />
        <AdvantageCard
          title="Rayonnement continental"
          description="Travaillez avec des clients dans toute l'Afrique et dans la diaspora."
        />
        <AdvantageCard
          title="Tarifs préférentiels"
          description="Conditions avantageuses réservées aux premiers inscrits."
        />
        <AdvantageCard
          title="Influencez le projet"
          description="Vos besoins façonnent la plateforme. Rejoignez une communauté de talents africains."
        />
      </div>
    </Section>
  );
}

function AdvantageCard({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl p-6 hover:border-leboulot-green/30 transition-all duration-300"
    >
      <h3 className="font-semibold text-xl mb-3 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

export function HowItWorks() {
  const steps = [
    { num: '01', title: 'Inscrivez-vous', desc: 'Rejoignez la liste de lancement en quelques secondes. Gratuit et sans engagement.' },
    { num: '02', title: 'Soyez informé', desc: 'Recevez un message dès que la plateforme ouvre. Accès prioritaire réservé aux inscrits.' },
    { num: '03', title: 'Commencez', desc: 'Créez votre profil, publiez vos missions ou proposez vos services.' },
  ];

  return (
    <Section>
      <div className="text-center mb-16">
        <h2 className="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl font-bold">
          Comment ça marche
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="text-center"
          >
            <div className="text-5xl lg:text-6xl font-bold text-leboulot-green/20 font-[family-name:var(--font-family-display)] mb-4">
              {step.num}
            </div>
            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
            <p className="text-gray-400 leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
