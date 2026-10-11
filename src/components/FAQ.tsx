import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'Qu\'est-ce que LEBOULOT ?',
    a: 'LEBOULOT est une plateforme en cours de construction qui mettra en relation les freelances africains avec des clients à la recherche de compétences. Notre objectif est de créer un écosystème adapté aux réalités du continent.',
  },
  {
    q: 'La préinscription est-elle gratuite ?',
    a: 'Oui, totalement. La préinscription est gratuite et sans aucun engagement.',
  },
  {
    q: 'Quand la plateforme sera-t-elle disponible ?',
    a: 'Nous travaillons activement au développement. Les inscrits seront les premiers informés de la date d\'ouverture.',
  },
  {
    q: 'Quelles données collectez-vous ?',
    a: 'Uniquement les données nécessaires : nom, téléphone, pays, profil et domaine d\'activité.',
  },
  {
    q: 'Comment seront utilisées mes données ?',
    a: 'Vos données servent exclusivement à vous contacter pour vous annoncer l\'ouverture. Elles ne seront jamais vendues ou partagées.',
  },
  {
    q: 'Puis-je me désinscrire ?',
    a: 'Oui. Vous pouvez demander la suppression de vos données à tout moment.',
  },
  {
    q: 'LEBOULOT garantit-il des missions ?',
    a: 'Non. LEBOULOT est un outil de mise en relation. Nous facilitons les connexions entre talents et opportunités.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl font-bold">
            Questions fréquentes
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                aria-expanded={openIndex === i}
              >
                <span className="font-medium text-white pr-4">{faq.q}</span>
                <motion.span
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-leboulot-green flex-shrink-0"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-4 text-gray-400 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
