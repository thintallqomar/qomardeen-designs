import type { ArticleTranslations } from '../useLocalizedArticle';

const translations: ArticleTranslations = {
  "building-scalable-design-systems": {
    title: "Construire des systèmes de design évolutifs",
    excerpt: "Comment les systèmes de design aident les équipes à faire évoluer les produits efficacement tout en maintenant l'utilisabilité et la cohérence visuelle.",
    content: `
## Pourquoi les systèmes de design comptent à grande échelle

Un système de design est bien plus qu'une bibliothèque de composants. C'est un langage partagé entre le design et l'ingénierie qui permet aux équipes de créer des expériences cohérentes rapidement.

Sans un tel système, chaque nouvelle fonctionnalité devient une occasion de fragmentation. Avec un système, chaque nouvelle fonctionnalité *renforce* la qualité existante.

## L'anatomie d'un système évolutif

### 1. Jetons de design

Les jetons sont les atomes de votre système — couleurs, espacement, typographie, ombres, animations :

\`\`\`css
:root {
  --color-primary: hsl(185, 84%, 55%);
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --radius-lg: 1rem;
  --font-heading: 'Inter', sans-serif;
}
\`\`\`

Les jetons garantissent qu'un changement de « couleur primaire » se propage partout instantanément.

### 2. Architecture des composants

Les composants doivent suivre une hiérarchie claire :

\`\`\`
Primitives (Button, Input, Badge)
  → Patterns (SearchBar, FormField, Card)
    → Features (UserProfile, PaymentForm, Dashboard)
      → Pages (Home, Settings, Checkout)
\`\`\`

Chaque couche ne compose qu'à partir de la couche inférieure. Cela empêche les dépendances circulaires et rend les changements prévisibles.

### 3. Stratégie de variantes

Chaque composant a besoin d'un modèle de variantes clair :

\`\`\`typescript
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

// Cela vous donne 4 × 3 = 12 combinaisons à partir d'UN SEUL composant
\`\`\`

> Règle d'or : Si vous créez un nouveau composant similaire à 80% à un existant, ajoutez une variante.

## Modèles de gouvernance

### Centralisé
Une équipe de systèmes de design possède tout. Fonctionne pour les grandes organisations (50+ designers).

### Fédéré
Les équipes produit contribuent des composants, l'équipe système révise et maintient. Idéal pour les organisations de taille moyenne.

### Communautaire
N'importe qui peut proposer des changements via un processus de contribution. Fonctionne pour l'open-source et les équipes distribuées.

## Collaboration inter-équipes

La partie la plus difficile des systèmes de design n'est pas technique — elle est organisationnelle :

1. **Heures de bureau régulières** — Sessions hebdomadaires où les équipes peuvent poser des questions
2. **Guides de migration** — Quand les composants sont mis à jour, fournir des chemins de migration étape par étape
3. **Métriques d'adoption** — Suivre quelles équipes utilisent le système et lesquelles ne le font pas
4. **Boucles de retour** — Faciliter le signalement des problèmes et les demandes de fonctionnalités

## Mesurer le succès

| Métrique | Ce qu'elle mesure |
|----------|------------------|
| Couverture des composants | % de l'interface utilisant les composants du système |
| Temps design-dev | Temps de la maquette à la production |
| Score de cohérence | Résultats d'audit de cohérence visuelle |
| Taux d'adoption | Équipes utilisant activement le système |

## L'effet composé

Les systèmes de design ont des rendements exponentiels. Les 6 premiers mois semblent lents — vous construisez l'infrastructure. Après cela, chaque nouvelle fonctionnalité est livrée plus rapidement car les fondations sont solides. Les équipes avec lesquelles j'ai travaillé voient typiquement une **réduction de 40-60%** du temps design-développement après la première année.

La clé est la patience et l'engagement. Un système de design est un produit, pas un projet.
    `
  },
  "designing-ai-native-products": {
    title: "Concevoir des produits natifs IA",
    excerpt: "Principes pour concevoir des produits où l'intelligence artificielle est une capacité fondamentale plutôt qu'une fonctionnalité ajoutée.",
    content: `
## IA-Native vs. IA-Amélioré

Il y a une distinction critique que la plupart des équipes manquent :

- **IA-Amélioré** : Produit traditionnel avec des fonctionnalités IA ajoutées (ex: « suggestions intelligentes » dans un formulaire)
- **IA-Native** : Produit conçu de zéro autour des capacités IA (ex: interfaces conversationnelles, workflows adaptatifs)

Les principes de design pour chacun sont fondamentalement différents.

## Principes fondamentaux

### 1. Concevoir pour l'incertitude

Les interfaces traditionnelles sont déterministes — cliquez sur un bouton, obtenez un résultat prévisible. Les interfaces IA sont probabilistes — la même entrée peut produire des sorties différentes.

Cela nécessite de nouveaux modèles d'interaction :

\`\`\`
Traditionnel :  Entrée → Traitement → Sortie
IA-Native :    Entrée → Traitement → Sortie + Confiance + Alternatives
\`\`\`

Toujours montrer :
- **Indicateurs de confiance** — Quelle est la certitude de l'IA ?
- **Suggestions alternatives** — Quoi d'autre cela pourrait-il être ?
- **Correction facile** — Comment corriger les résultats erronés ?

### 2. Autonomie progressive

Ne donnez pas le contrôle total à l'IA immédiatement. Laissez les utilisateurs construire la confiance progressivement :

| Niveau de confiance | Rôle de l'IA | Rôle de l'utilisateur |
|--------------------|--------------|-----------------------|
| Nouvel utilisateur | Suggérer | Décider + exécuter |
| Utilisateur régulier | Recommander | Approuver |
| Utilisateur expert | Agir | Surveiller + corriger |

### 3. Raisonnement transparent

Les utilisateurs doivent comprendre *pourquoi* l'IA a pris une décision :

\`\`\`
❌ « Nous recommandons le Produit A »
✅ « Nous recommandons le Produit A car il correspond à votre budget
   (50-100€) et a 4.8★ dans votre catégorie préférée »
\`\`\`

### 4. Dégradation gracieuse

Quand l'IA échoue (et elle échouera), le produit doit toujours fonctionner.

## Le défi du design

La partie la plus difficile du design de produits IA n'est pas la technologie — c'est la gestion des attentes des utilisateurs. Une IA qui fonctionne 90% du temps crée de la frustration dans les 10% où elle échoue, surtout si les utilisateurs s'attendaient à 100%.

Concevez d'abord pour le cas d'échec. Si la pire expérience est acceptable, le produit réussira.
    `
  },
  "ai-assisted-design-workflows": {
    title: "Workflows de design assistés par l'IA",
    excerpt: "Comment l'intelligence artificielle peut accélérer la recherche, l'idéation et l'itération dans le design produit moderne.",
    content: `
## L'IA ne remplacera pas les designers — mais elle remplacera les lents

L'industrie du design est divisée entre sceptiques et évangélistes de l'IA. Je ne suis ni l'un ni l'autre. Je suis un pragmatique qui utilise l'IA partout où elle accélère réellement mon travail.

Voici mon workflow réel.

## Phase 1 : Accélération de la recherche

### Analyse concurrentielle
Au lieu de passer 3 jours à auditer les produits concurrents, j'utilise l'IA pour :

1. **Résumer les avis** — Extraire les 5 principales plaintes et éloges
2. **Analyser les matrices de fonctionnalités** — Comparer 10+ concurrents sur les dimensions clés
3. **Identifier les patterns** — Faire émerger les patterns UX communs dans une catégorie

## Phase 2 : Boost d'idéation

L'IA est excellente pour générer de la *quantité* — exactement ce dont le brainstorming a besoin.

## Phase 3 : Maintenance du système de design

C'est là que l'IA fait gagner le plus de temps :

- **Générer la documentation des composants** à partir des specs Figma
- **Écrire les annotations d'accessibilité** pour le handoff
- **Créer des scénarios de test** pour les cas limites

## Ce que l'IA ne peut pas faire

L'IA échoue à :
- **Comprendre le contexte** — Elle ne connaît pas les points de douleur spécifiques de vos utilisateurs
- **Prendre des décisions de goût** — Elle ne peut pas vous dire si quelque chose *semble* juste
- **Naviguer la politique** — Elle ne peut pas gérer les dynamiques entre parties prenantes

Les designers qui prospéreront seront ceux qui utilisent l'IA pour le travail mécanique et investissent leur temps libéré dans les parties profondément humaines du design.
    `
  },
  "dashboard-design-clarity-over-complexity": {
    title: "Design de tableaux de bord : la clarté avant la complexité",
    excerpt: "Principes pour concevoir des tableaux de bord riches en données qui aident les utilisateurs à comprendre rapidement des informations complexes.",
    content: `
## Le paradoxe du tableau de bord

Les tableaux de bord sont censés simplifier la complexité. Au lieu de cela, la plupart *ajoutent* de la complexité en montrant tout en même temps.

La solution n'est pas de supprimer des données — c'est de les organiser par intention.

## Le framework basé sur l'intention

Chaque élément du tableau de bord devrait répondre à l'une de ces trois questions :

1. **« Est-ce que tout va bien ? »** → Indicateurs de statut, alertes
2. **« Que s'est-il passé ? »** → Tendances, comparaisons, historique
3. **« Que dois-je faire ? »** → Éléments d'action, recommandations

## Le test des 5 secondes

Avant de livrer un tableau de bord, je fais le test des 5 secondes :

> Montrez le tableau de bord à quelqu'un pendant 5 secondes. Puis demandez : « Que vous dit-il ? »

S'il ne peut pas répondre, la hiérarchie est mauvaise. Redesignez jusqu'à ce que l'information la plus importante soit la plus visible.
    `
  },
  "designing-trust-fintech-interfaces": {
    title: "Concevoir la confiance dans les interfaces fintech",
    excerpt: "Patterns UX clés qui construisent la confiance quand les utilisateurs déplacent de l'argent via des plateformes numériques.",
    content: `
## La confiance est le produit

En fintech, l'interface *est* le signal de confiance. Les utilisateurs ne peuvent pas voir les serveurs, le chiffrement ou les certifications de conformité. Tout ce qu'ils ont, c'est ce qui est à l'écran.

Après avoir conçu WalPay — une plateforme de paiements numériques — j'ai identifié les patterns qui construisent systématiquement la confiance des utilisateurs.

## Les cinq signaux de confiance

### 1. Divulgation progressive de la sécurité
### 2. Boucles de retour prévisibles
### 3. États d'erreur transparents
### 4. Langage visuel familier
### 5. Annulation et récupération

Ce framework a transformé la sécurité abstraite en confiance tangible pour l'utilisateur.
    `
  },
  "systems-thinking-product-design": {
    title: "Pourquoi la pensée systémique compte en design produit",
    excerpt: "Comment penser au-delà des écrans individuels permet des expériences produit évolutives et cohérentes.",
    content: `
## Le problème de la pensée au niveau de l'écran

La plupart des designers commencent par les écrans. Une page de connexion ici, un tableau de bord là, un panneau de paramètres quelque part. Cette approche fonctionne pour les petits produits, mais elle s'effondre dès que votre produit se développe.

## Ce à quoi ressemble la pensée systémique

La pensée systémique signifie dézoomer avant de zoomer. Au lieu de demander *« À quoi devrait ressembler cet écran ? »*, vous demandez :

> « Quelles sont les règles sous-jacentes qui gouvernent comment chaque écran devrait se comporter ? »

## Le rendement

La pensée systémique ne rend pas seulement le design plus cohérent — elle rend toute l'équipe produit plus rapide.

Commencez petit. Commencez par une question : *« Y a-t-il un pattern ici que je répète ? »* Si oui, extrayez-le, nommez-le et documentez-le. C'est la pensée systémique en action.
    `
  },
  "from-fashion-to-product-design": {
    title: "De la mode au design produit",
    excerpt: "Comment mon parcours en design de mode a façonné mon approche de la construction de produits numériques et d'expériences utilisateur.",
    content: `
## Une histoire d'origine improbable

Je n'ai pas commencé dans la tech. Mon premier langage de design était le tissu, pas Figma. J'ai étudié le design de mode avant de transitionner vers le design de produits numériques — et ce parcours me donne un avantage que la plupart des designers n'ont pas.

## Ce que la mode m'a appris

### 1. La pensée matérielle
En mode, on design *avec* le matériau, pas contre lui.

### 2. L'importance de l'ajustement
Un vêtement magnifique qui ne va pas est inutile. Il en va de même pour les interfaces.

### 3. La pensée en collection
Les designers de mode ne créent pas des pièces individuelles — ils créent des *collections*.

### 4. La présentation fait partie du produit
En mode, le défilé *fait partie* du design.

## Pourquoi c'est important

L'industrie tech récompense la conformité. Venir de la mode me donne une perspective différente — une qui valorise l'artisanat, la matérialité et l'impact émotionnel du design. Ce n'est pas une faiblesse. C'est un super-pouvoir.
    `
  },
  "mobile-banking-onboarding-ux": {
    title: "Analyse UX : Onboarding bancaire mobile",
    excerpt: "Analyser comment les meilleures apps fintech réduisent la friction dans les parcours des nouveaux utilisateurs.",
    content: `
## Les 60 premières secondes

L'onboarding bancaire mobile a une contrainte brutale : les utilisateurs doivent fournir des informations personnelles sensibles *avant* d'avoir expérimenté une quelconque valeur.

J'ai analysé les parcours d'onboarding de 8 meilleures apps fintech en Afrique et en Europe. Voici ce qui sépare les meilleurs du reste.

## Pattern 1 : Aperçu de la valeur avant l'inscription
## Pattern 2 : KYC progressif
## Pattern 3 : Explication contextuelle de la sécurité
## Pattern 4 : Persistance de la progression

Le meilleur onboarding ne ressemble pas à de l'onboarding. Il donne l'impression que le produit s'ouvre progressivement à vous, un échange de confiance à la fois.
    `
  },
  "notion-design-system-teardown": {
    title: "Analyse produit : Le système de design de Notion",
    excerpt: "Comment Notion équilibre flexibilité et cohérence dans un produit complexe.",
    content: `
## Le paradoxe de la flexibilité

Notion est l'un des outils de productivité les plus flexibles jamais construits. Les utilisateurs peuvent créer des bases de données, des wikis, des tableaux de projet et des documents — le tout dans la même interface. Pourtant, cela ne semble jamais chaotique.

## La primitive Block

Tout dans Notion est un **block**. Texte, images, bases de données, intégrations — tous des blocks. Cette abstraction unique est le fondement de tout leur système de design.

## Leçons pour les designers

1. **Trouvez votre primitive** — Quelle est la plus petite unité de votre produit ? Designez-la parfaitement.
2. **Contraignez le conteneur** — Plus le contenu est flexible, plus le cadre doit être rigide.
3. **La couleur est donnée** — Utilisez la couleur pour communiquer, pas pour décorer.
4. **Navigation = modèle mental** — Votre barre latérale devrait refléter comment les utilisateurs pensent.

Même les meilleurs systèmes de design ont des compromis. La clé est de faire des compromis *intentionnels*, pas accidentels.
    `
  },
  "ai-beyond-chatbots": {
    title: "L'IA en design produit : au-delà des chatbots",
    excerpt: "Comment l'IA remodèle les workflows de design, la recherche et l'expérience utilisateur.",
    content: `
## Le piège du chatbot

Quand la plupart des gens pensent « IA en design produit », ils pensent chatbots. Mais les chatbots ne sont qu'une — sans doute la moins intéressante — application de l'IA en design.

La vraie révolution se produit dans trois domaines.

## 1. Valeurs par défaut intelligentes

La fonctionnalité IA la plus puissante est celle que les utilisateurs ne remarquent jamais : les **valeurs par défaut intelligentes**.

## 2. Interfaces adaptatives

L'IA permet des interfaces qui se remodèlent en fonction de l'utilisateur.

## 3. Contenu génératif

L'IA peut créer du contenu personnalisé au sein des produits.

## Le défi du design

Les produits qui gagneront ne seront pas ceux avec le plus de fonctionnalités IA. Ce seront ceux où l'IA est si bien intégrée que les utilisateurs oublient qu'elle est là.
    `
  },
  "systems-thinking-for-designers": {
    title: "La pensée systémique pour les designers",
    excerpt: "Pourquoi comprendre le système dans son ensemble mène à de meilleures décisions au niveau des composants.",
    content: `
## Les composants n'existent pas isolément

Chaque bouton, carte et modal que vous designez existe au sein d'un système. La qualité de vos décisions au niveau des composants dépend de votre compréhension de ce système.

## Les trois niveaux de design

### Niveau 1 : Design de composants
*« À quoi devrait ressembler ce bouton ? »*

### Niveau 2 : Design de patterns
*« Comment les boutons devraient-ils se comporter dans tout le produit ? »*

### Niveau 3 : Design de systèmes
*« Pourquoi avons-nous besoin de boutons ? Quelles sont les actions possibles dans notre produit ? »*

## L'avantage compétitif

Les entreprises embauchent des penseurs systémiques non pas parce qu'ils font de plus jolis écrans, mais parce qu'ils font *moins d'écrans*. Quand vous comprenez le système, vous trouvez des solutions élégantes qui gèrent 10 cas avec 1 design au lieu de 10 designs séparés.
    `
  },
};

export default translations;
