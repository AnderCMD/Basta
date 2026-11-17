# Graph Report - .  (2026-11-16)

## Corpus Check
- Corpus is ~37,792 words - fits in a single context window. You may not need a graph.

## Summary
- 550 nodes · 1344 edges · 23 communities (19 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.84)
- Token cost: 107,692 input · 0 output

## Community Hubs (Navigation)
- Pantallas y marca
- Alfabeto, premios y motor
- Dependencias Expo
- Estado y logros
- Config y package.json
- Preparar partida y categorías
- Menú y editor de avatares
- Pantalla de juego y overlays
- Flujo de calidad y CI
- Modos, reglas y puntos
- Build, APK y marca
- Raíz: fuentes y sonido
- Tablero y reloj
- Persistencia y versiones
- Sistema de avatares
- Sonidos sintetizados
- Paquetes de categorías
- Arquitectura del motor
- TypeScript config
- ESLint config
- Script de marca
- Recorte de fuentes
- Plantilla de ideas

## God Nodes (most connected - your core abstractions)
1. `useLayout()` - 31 edges
2. `AppText()` - 25 edges
3. `colors` - 23 edges
4. `README` - 21 edges
5. `useAppStore()` - 20 edges
6. `Release 2.0.0` - 20 edges
7. `Icon()` - 18 edges
8. `AGENTS.md Agent Guide` - 16 edges
9. `gameReducer()` - 15 edges
10. `AvatarLook` - 13 edges

## Surprising Connections (you probably didn't know these)
- `AGENTS.md Agent Guide` --references--> `Continuous Native Generation (android/ ios/ generated)`  [INFERRED]
  AGENTS.md → docs/BUILD.md
- `Contributing Guide` --references--> `Bug Report Issue Template`  [INFERRED]
  CONTRIBUTING.md → .github/ISSUE_TEMPLATE/bug_report.md
- `Pull Request Template` --references--> `npm run check (typecheck + lint + tests)`  [INFERRED]
  .github/pull_request_template.md → README.md
- `Single version source (package.json -> app.config.ts)` --conceptually_related_to--> `CHANGELOG`  [INFERRED]
  docs/ARCHITECTURE.md → CHANGELOG.md
- `Release 2.0.0` --references--> `Reanimated 4 animations`  [EXTRACTED]
  CHANGELOG.md → docs/ARCHITECTURE.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Persistence load/save flow** — docs_architecture_app_store, docs_architecture_async_storage, docs_architecture_sanitize_state, docs_architecture_migrate_v1, docs_architecture_persistence_schema, docs_architecture_debounced_save [EXTRACTED 1.00]
- **Four game modes** — docs_game_modes_classic_mode, docs_game_modes_tournament_mode, docs_game_modes_points_mode, docs_game_modes_teams_mode [EXTRACTED 1.00]
- **Quality gate (local check, PR template, CI)** — readme_npm_run_check, _github_pull_request_template, _github_workflows_ci_check_job, _github_workflows_ci_expo_doctor, contributing_branch_flow [INFERRED 0.85]

## Communities (23 total, 4 thin omitted)

### Community 0 - "Pantallas y marca"
Cohesion: 0.05
Nodes (84): CAST, FEATURES, Parade(), styles, styles, Sort, SORTS, styles (+76 more)

### Community 1 - "Alfabeto, premios y motor"
Cohesion: 0.08
Nodes (45): AlphabetOptions, DIGRAPHS, HARD_LETTERS, isHardLetter(), letterValue(), MEDIUM_LETTERS, MX_ALPHABET, best() (+37 more)

### Community 2 - "Dependencias Expo"
Cohesion: 0.04
Nodes (45): expo, expo-audio, expo-build-properties, expo-constants, expo-font, expo-haptics, expo-keep-awake, expo-linear-gradient (+37 more)

### Community 3 - "Estado y logros"
Cohesion: 0.11
Nodes (36): GameMode, Achievement, CareerStats, emptyCareer(), Tier, TIER_COLORS, newId(), AppStoreProvider() (+28 more)

### Community 4 - "Config y package.json"
Cohesion: 0.05
Nodes (36): [major, minor, patch], eslint, eslint-config-expo, description, devDependencies, eslint, eslint-config-expo, tsx (+28 more)

### Community 5 - "Preparar partida y categorías"
Cohesion: 0.09
Nodes (31): Game(), SettingsScreen(), SetupScreen(), buildAlphabet(), ANIMAL_TRAITS, COLORS, CONTAINERS, EVENTS (+23 more)

### Community 6 - "Menú y editor de avatares"
Cohesion: 0.11
Nodes (25): CategoriesScreen(), HallOfFame(), metric(), Home(), styles, EditPlayerScreen(), Accessory, AVATAR_BACKGROUNDS (+17 more)

### Community 7 - "Pantalla de juego y overlays"
Cohesion: 0.09
Nodes (24): GameScreen(), styles, Confetti(), Piece, seeded(), FailOverlay(), GS, MEDAL_COLORS (+16 more)

### Community 8 - "Flujo de calidad y CI"
Cohesion: 0.15
Nodes (21): Bug Report Issue Template, Pull Request Template, CI Workflow (GitHub Actions), CI check job (npm ci, npm run check, expo-doctor), expo-doctor config check, AGENTS.md Agent Guide, Install packages with npx expo install, Expo Router file-based routes in src/app (+13 more)

### Community 9 - "Modos, reglas y puntos"
Cohesion: 0.22
Nodes (18): Release 2.0.0, Code of Conduct, Contributor Covenant 2.1, Competitors (players or teams, memberIndex, lives, points, streak), Feature-based folder architecture (features/), Game Modes, Rules and Scoring Doc, 22 permanent achievements (achievements.ts), Classic mode (elimination) (+10 more)

### Community 10 - "Build, APK y marca"
Cohesion: 0.17
Nodes (17): EAS (build, submit, update), Icon component (Font Awesome Free 7, no emojis), Theme tokens (lib/theme.ts), Branding Doc, Brand color palette, Social preview image, Build and Optimization Doc, APK optimizations (R8, shrink, ARM-only, Hermes, PNG crunch) (+9 more)

### Community 11 - "Raíz: fuentes y sonido"
Cohesion: 0.20
Nodes (10): FeedbackSync(), FONT_FILES, RootLayout(), ICON_FONTS, setHapticsEnabled(), initSounds(), players, setSoundEnabled() (+2 more)

### Community 12 - "Tablero y reloj"
Cohesion: 0.18
Nodes (10): Board(), Props, styles, LetterTile(), AnimatedCircle, Props, styles, TimerCore() (+2 more)

### Community 13 - "Persistencia y versiones"
Cohesion: 0.20
Nodes (12): CHANGELOG, Keep a Changelog + SemVer, Release 1.0.0, AppStore global context, applyGameToCareers (career.ts), AsyncStorage persistence (basta.state.v2), 250 ms debounced save, migrateV1 (basta.players.v1 -> v2) (+4 more)

### Community 14 - "Sistema de avatares"
Cohesion: 0.31
Nodes (10): Avatars Doc, Avatar anchors (top, eyeY, eyeDX, mouthY, chinY), ANIMALS (16 SVG animals), AVATAR_BACKGROUNDS (12), Avatar component (memoized), Avatar draw order (bg, animal, extra, glasses, hat, ring), EXTRAS (8), GLASSES (8) (+2 more)

### Community 15 - "Sonidos sintetizados"
Cohesion: 0.25
Nodes (4): note(), OUT, sounds, tone()

### Community 16 - "Paquetes de categorías"
Cohesion: 0.43
Nodes (7): Categories Doc, categories.test.ts (>=2000 unique, no repeats), createCategoryDealer, Custom user categories, Generated category packs (generators.ts, templates x lists), Hand-written category packs (packs.ts, 24), Chaos modifier (category changes each turn)

### Community 17 - "Arquitectura del motor"
Cohesion: 0.33
Nodes (6): Pure game engine reducer (engine.ts), Game state machine (ready -> playing <-> paused -> fail -> finished), Letter tiles (6 visible, unique id, golden flag), Undo history (up to 10 snapshots), useGameController (engine + clock, sound, haptics), Judges pause menu (fail, kick, undo, change category)

### Community 18 - "TypeScript config"
Cohesion: 0.33
Nodes (5): expo/tsconfig.base, compilerOptions, allowImportingTsExtensions, strict, extends

## Knowledge Gaps
- **154 isolated node(s):** `[major, minor, patch]`, `{ defineConfig }`, `expoConfig`, `name`, `version` (+149 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Dependencias Expo` to `Config y package.json`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **What connects `[major, minor, patch]`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _154 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Pantallas y marca` be split into smaller, more focused modules?**
  _Cohesion score 0.05227175616009116 - nodes in this community are weakly interconnected._
- **Should `Alfabeto, premios y motor` be split into smaller, more focused modules?**
  _Cohesion score 0.07542087542087542 - nodes in this community are weakly interconnected._
- **Should `Dependencias Expo` be split into smaller, more focused modules?**
  _Cohesion score 0.044444444444444446 - nodes in this community are weakly interconnected._
- **Should `Estado y logros` be split into smaller, more focused modules?**
  _Cohesion score 0.10685249709639953 - nodes in this community are weakly interconnected._
- **Should `Config y package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._