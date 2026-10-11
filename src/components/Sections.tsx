import { motion } from 'framer-motion';

export function AboutSection() {
  return (
    <section id="apropos" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl font-bold mb-6"
        >
          Une plateforme pensée pour <span className="text-leboulot-green">l'Afrique</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-400 leading-relaxed"
        >
          LEBOULOT connecte les freelances et les clients sur une plateforme adaptée à nos réalités : 
          paiements locaux, confiance, accessibilité.
        </motion.p>
      </div>
    </section>
  );
}

export function AdvantagesSection() {
  const advantages = [
    { title: 'Accès prioritaire', desc: 'Soyez parmi les premiers dès l\'ouverture' },
    { title: 'Paiements adaptés', desc: 'Mobile money, virement local' },
    { title: 'Rayonnement continental', desc: 'Travaillez dans toute l\'Afrique' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl font-bold text-center mb-12"
        >
          Pourquoi nous rejoindre ?
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {advantages.map((adv, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-6 text-center"
            >
              <h3 className="font-semibold text-xl mb-2 text-white">{adv.title}</h3>
              <p className="text-gray-400">{adv.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl font-bold mb-12"
        >
          Comment ça marche
        </motion.h2>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-start gap-4 text-left"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-leboulot-green/20 flex items-center justify-center text-leboulot-green font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Inscrivez-vous</h3>
              <p className="text-gray-400">Rejoignez la liste en quelques secondes. Gratuit et sans engagement.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-start gap-4 text-left"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-leboulot-green/20 flex items-center justify-center text-leboulot-green font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Soyez informé</h3>
              <p className="text-gray-400">Recevez un message dès l'ouverture. Accès prioritaire garanti.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-start gap-4 text-left"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-leboulot-green/20 flex items-center justify-center text-leboulot-green font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Commencez</h3>
              <p className="text-gray-400">Créez votre profil et connectez-vous aux opportunités.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
