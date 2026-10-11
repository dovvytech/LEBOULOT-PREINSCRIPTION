import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-leboulot-dark py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-leboulot-green hover:underline mb-8 text-sm">
          ← Retour à l'accueil
        </Link>

        <h1 className="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl font-bold mb-8">
          Politique de confidentialité
        </h1>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300 leading-relaxed">
          <section>
            <p className="text-sm text-gray-500 mb-6">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Responsable du traitement</h2>
            <p>
              LEBOULOT, projet en cours de développement. Contact : contact@leboulot.app
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Données collectées</h2>
            <p>Lors de votre préinscription, nous collectons uniquement les données suivantes :</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Votre nom complet</li>
              <li>Votre numéro de téléphone (avec indicatif pays)</li>
              <li>Votre pays de résidence</li>
              <li>Votre profil (freelance, client, les deux, autre)</li>
              <li>Votre domaine de compétence ou secteur d'intérêt</li>
              <li>Votre canal de contact préféré (WhatsApp ou SMS)</li>
              <li>La date et le statut de votre consentement</li>
            </ul>
            <p className="mt-3">Nous ne collectons pas d'adresse e-mail, de pièce d'identité, ni de données bancaires.</p>
          </section>

          <section id="consent">
            <h2 className="text-xl font-semibold text-white mb-3">3. Finalité de la collecte</h2>
            <p>Vos données sont utilisées exclusivement pour :</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Vous contacter pour vous annoncer l'ouverture de la plateforme LEBOULOT</li>
              <li>Comprendre les profils et les besoins pour adapter le service</li>
              <li>Gérer la liste de préinscription</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Durée de conservation</h2>
            <p>
              Vos données sont conservées pendant une durée maximale de <strong className="text-white">24 mois</strong> à compter 
              de votre inscription. Passé ce délai, ou en cas de désabonnement de votre part, 
              vos données sont supprimées définitivement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Partage des données</h2>
            <p>
              Vos données ne sont <strong className="text-white">jamais vendues, louées ou partagées</strong> avec des tiers 
              en dehors de l'équipe LEBOULOT. Elles ne sont utilisées pour aucun usage publicitaire.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Vos droits</h2>
            <p>Vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong className="text-white">Accès</strong> : demander une copie de vos données</li>
              <li><strong className="text-white">Rectification</strong> : corriger des données inexactes</li>
              <li><strong className="text-white">Suppression</strong> : demander l'effacement de vos données</li>
              <li><strong className="text-white">Opposition</strong> : vous opposer au traitement</li>
              <li><strong className="text-white">Désabonnement</strong> : ne plus recevoir de messages</li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@leboulot.app" className="text-leboulot-green">contact@leboulot.app</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données : 
              chiffrement, accès restreint, sauvegardes régulières.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Modifications</h2>
            <p>
              Cette politique peut être mise à jour. Toute modification substantielle sera communiquée 
              aux personnes inscrites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Note importante</h2>
            <p>
              Cette politique de confidentialité est rédigée de bonne foi. Elle ne constitue pas un avis juridique. 
              Pour une conformité complète avec les réglementations locales (APDP, CDP, ARTCI, etc.), 
              nous vous recommandons de consulter un professionnel du droit.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
