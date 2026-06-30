# PickAct

**Choisir une activité au hasard, entre amis, sans prise de tête.**

Chacun ajoute ses idées de sorties (de façon anonyme), puis une roue en tire une au
hasard selon vos envies du moment : le temps que vous avez, votre budget et votre
moyen de transport. Fini les « on fait quoi ? » qui tournent en rond.

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white">
  <img alt="Drizzle ORM" src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?logo=drizzle&logoColor=black">
  <img alt="Neon Postgres" src="https://img.shields.io/badge/Neon_Postgres-00E599?logo=postgresql&logoColor=white">
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white">
</p>

## Comment ça marche

1. **Créez un groupe** (ou rejoignez celui d'un ami avec un code d'invitation).
2. **Ajoutez vos activités** : un nom, une durée, un budget, un moyen de transport.
   Personne ne voit qui a proposé quoi.
3. **Réglez vos filtres** du moment (temps dispo, budget max, transports acceptés).
4. **Lancez la roue** : une animation choisit une activité parmi celles qui rentrent
   dans vos critères, et révèle le résultat.
5. **Décidez** : on valide, on passe, ou on garde pour plus tard. L'historique du
   groupe se met à jour.

## Ce qui rend l'app sympa

- **Anonymat** : les membres ne voient jamais qui a ajouté une activité.
- **Roue de tirage** plein écran, colorée, avec suspense puis confettis.
- **Filtres** simples : temps, budget, mode de transport.
- **Espace administrateur** pour superviser tous les groupes.
- **Confort** : pseudo + mot de passe (pas d'email), reconnexion sur n'importe quel
  appareil, et respect de la préférence « réduire les animations ».

## La stack en bref

| Brique | Technologie | À quoi ça sert |
| --- | --- | --- |
| Interface | **Next.js 16** + **React 19** + **TypeScript** | Les pages et la logique de l'app |
| Style | **Tailwind CSS v4** | L'apparence (thème, couleurs, responsive) |
| Base de données | **Neon Postgres** via **Drizzle ORM** | Stocker groupes, membres et activités |
| Icônes et effets | **lucide-react**, **canvas-confetti** | Les pictos et les confettis |
| Hébergement | **Vercel** | Mettre le site en ligne |

## Lancer le projet en local

```bash
npm install      # installer les dépendances
npm run dev      # démarrer en mode développement
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000).

Trois variables d'environnement sont nécessaires (dans un fichier `.env.local`) :

| Variable | Rôle |
| --- | --- |
| `DATABASE_URL` | Connexion à la base Neon Postgres |
| `ADMIN_PASSWORD` | Mot de passe de l'espace administrateur |
| `ADMIN_SECRET` | Secret pour sécuriser la session admin |

## Mise en ligne

Le projet est pensé pour **Vercel** (offre gratuite) avec une base **Neon** branchée
via la marketplace. Un `git push` suffit à déployer une fois le projet connecté.
