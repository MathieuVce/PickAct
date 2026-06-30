@AGENTS.md

# PickAct

Plateforme entre amis : chacun ajoute des activités (anonymement), une roue en tire une au hasard
selon des filtres (temps, budget, transport). Un admin supervise tous les groupes.

## Stack
- Next.js 16 (App Router, Server Components + Server Actions), React 19, TypeScript
- Tailwind CSS v4 (thème + classes utilitaires dans `src/app/globals.css`)
- Neon Postgres via Drizzle ORM (`drizzle-orm/neon-http`)
- `lucide-react` (icônes), `canvas-confetti` (effets)
- Déploiement Vercel (Hobby), base Neon (offre gratuite, intégration Marketplace)

## Règles de design (IMPÉRATIF)
- **Aucun emoji.** Uniquement des icônes `lucide-react` (`<Icon className="size-4" />`).
- **Aucun tiret `-` ni `—`** dans le texte affiché ni les codes générés. Reformuler.
- **Accents obligatoires.** Le texte affiché est en français correctement accentué
  (« activité », « éligible », « Réglez »). Les accents ne sont jamais interdits ; seuls
  les tirets et les emoji le sont.
- **Anonymat** : côté membre, ne jamais sélectionner `memberId`/`displayName` d'autrui.
  Seule la zone `/admin` peut afficher l'auteur d'une activité.
- **Animations** sous garde `prefers-reduced-motion` (voir `src/lib/confetti.ts`, `Wheel`,
  et les classes `animate-*` + media query dans `globals.css`).
- **Thème** « sombre adouci » : variables CSS dans `globals.css`
  (`--primary` violet, `--accent` rose, `--cyan`, `--amber`, `--green`). Boutons primaires
  en dégradé, halos radiaux doux (jamais de `background-attachment: fixed` qui crée des
  bandes au scroll). Utilitaire `gradient-text` pour les titres marquants.
- **Statuts colorés** : En jeu = cyan, Validée = vert, Passée = rose, Plus tard = violet
  (même code couleur sur dashboard, `my-activities` et admin).
- **Mots de passe** : toujours via le composant `PasswordField` (oeil afficher/masquer +
  `autoComplete="new-password"` + `readOnly` réactivé au focus contre le remplissage auto).
- **Responsive** : tester à 390 px ; empiler les actions sous l'info plutôt que de les
  comprimer, sécuriser les troncatures avec `min-w-0`.

## Arborescence
```
src/
  app/
    page.tsx                  Accueil (créer / rejoindre+connexion), redirige si déjà connecté
    dashboard/page.tsx        Compteurs + roue (PickPanel) + historique + invitation
    my-activities/page.tsx    Liste de MES activités (+ toast confetti si ?added=1)
    my-activities/new/page.tsx Formulaire d'ajout
    account/page.tsx          Profil, reconnexion, déconnexion, quitter
    join/[code]/page.tsx      Rejoindre via lien d'invitation
    admin/login/page.tsx      Connexion admin (mot de passe)
    admin/page.tsx            Liste de tous les groupes + stats
    admin/groups/[id]/page.tsx Détail groupe (membres + activités AVEC auteur)
    actions/
      groups.ts     createGroup, enterGroup (flux unifié rejoindre/reconnexion), logout, leaveGroup
      activities.ts addActivity, deleteActivity (garde memberId), setActivityStatus (groupe)
      pick.ts       spinPick(filters) -> candidats anonymisés + winner tiré côté serveur
      admin.ts      loginAdmin/logoutAdmin + delete/rename gardés par isAdmin()
  components/       HomeForms, JoinForm, PasswordField, AppNav, PickPanel, SpinModal, Wheel,
                    HistoryPanel, AddedToast, InviteShare, CopyableCode, LeaveGroupButton,
                    AdminNav, AdminLoginForm
                    Tirage : PickPanel (filtres + scène) ouvre SpinModal (modale quasi plein
                    écran) qui anime Wheel (roue multicolore, compteur central, sans noms)
                    puis révèle le gagnant avec confettis.
  db/
    schema.ts       groups, members, activities + enums travel_mode, activity_status
    index.ts        client Drizzle PARESSEUX (Proxy) : ne se connecte qu'à la 1re requête
  lib/
    auth.ts         cookie pickact_session, getCurrentMember, requireCurrentMember (server-only)
    admin.ts        cookie pickact_admin, checkAdminPassword, isAdmin (server-only)
    password.ts     scrypt hash + verify (timingSafeEqual), MIN_PASSWORD_LENGTH
    codes.ts        generateInviteCode (PICK + 4, sans tiret), generateSessionToken
    url.ts          safeUrl (http/https seulement, anti XSS)
    travel.ts       modes de transport -> libellés + icônes lucide, formatDuration
    confetti.ts     celebrate() avec garde reduced-motion
```

## Modèle de données
- `groups(id, name, invite_code unique, created_at)`
- `members(id, group_id, display_name, password_hash, session_token unique, created_at)`
  unicité `(group_id, lower(display_name))`
- `activities(id, member_id, group_id, name, image_url?, link?, est_minutes, travel_minutes?,
  travel_mode?, cost?, notes?, status, decided_at?, created_at)`
- `status` : `active` | `validated` | `skipped` | `later`. **Éligible au tirage = active ou later.**

## Auth
- **Membre** : pas d'email. Flux unique `enterGroup` = code de groupe + pseudo + mot de passe.
  Si (groupe, pseudo) existe -> vérifie le mot de passe ; sinon crée le membre. Cookie httpOnly = `session_token`.
- **Admin** : mot de passe `ADMIN_PASSWORD` (env). Cookie = `sha256(ADMIN_PASSWORD + ADMIN_SECRET)`.

## Commandes
```
npm run dev          # dev (http://localhost:3000)
npm run build        # build prod
npm run db:generate  # génère la migration SQL depuis schema.ts
DOTENV_CONFIG_PATH=.env.local npx drizzle-kit push   # applique le schéma (interactif si conflit)
vercel env pull .env.local                            # récupère DATABASE_URL depuis Vercel
```
Env requises : `DATABASE_URL` (Neon), `ADMIN_PASSWORD`, `ADMIN_SECRET`.

## Git / commits
- **Ne jamais ajouter de ligne `Co-Authored-By` (ni mention « coauthored ») dans les messages de commit.**

## Pièges
- `db` est un Proxy paresseux : pas de connexion au build, seulement à la 1re requête (env manquante = throw runtime).
- Server Actions de mutation : `redirect()` lève volontairement (ne pas l'envelopper dans try/catch).
- `drizzle-kit push` est interactif sur conflit de colonnes ; en dev jetable, réinitialiser les tables puis push.

## À faire / à contrôler (sécurité)
- Rate limiting réel sur `enterGroup` et `loginAdmin` (Upstash Redis ou Vercel Firewall) en prod.
- Content Security Policy + `images.remotePatterns` si passage à `next/image`.
- Page de confidentialité (pseudos + mots de passe hachés stockés).
