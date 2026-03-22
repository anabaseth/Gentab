# Gentab v3 - Outil de génération aléatoire

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue)](https://anabaseth.github.io/gentab/)

Un outil de génération aléatoire pour maîtres de jeu et créateurs de contenu.

## 🚀 Accès direct

**Utilisez Gentab directement dans votre navigateur :**
https://anabaseth.github.io/Gentab/gentab.html


## 📋 Fonctionnalités

- **Tirage aléatoire** : Tables pondérées avec combinaisons uniques
- **Éditeur intégré** : Créez vos propres tables et séquences
- **Séquences imbriquées** : Références entre séquences
- **Détection de cycles** : Gestion automatique des références circulaires
- **Graphe de dépendances** : Visualisation des relations entre séquences
- **Internationalisation** : Support français/anglais
- **Accessibilité** : Navigation clavier et labels ARIA

## 🛠️ Installation locale

1. Clonez le repository :
   ```bash
   git clone https://github.com/anabaseth/gentab.git
   cd gentab
   ```

2. Ouvrez `gentab.html` dans votre navigateur

## 📖 Documentation

- [Guide utilisateur complet](README_guide_utilisateur.md)
- [Documentation technique](README_technique.md)

## 🔧 Configuration GitHub Pages

Pour permettre l'accès direct à votre application :

1. **Poussez votre code** sur GitHub dans un repository public
2. **Allez dans Settings > Pages**
3. **Source** : "Deploy from a branch"
4. **Branch** : `main` / `(root)`
5. **Sauvegardez**

Votre site sera accessible à : `https://anabaseth.github.io/nom-du-repo/`

## 🎮 Démarrage rapide

1. **Accès direct** : https://anabaseth.github.io/gentab/
2. **Chargez un fichier** : Bouton "Charger" > sélectionnez un `.gntb`
3. **Choisissez une séquence** : Liste déroulante dans l'onglet "Tirer"
4. **Lancez le tirage** : Nombre de résultats souhaité

## 📄 Format .gntb

Fichiers JSON avec tables et séquences :

```json
{
  "titre": "Mon générateur",
  "tables": [
    {
      "id": "prenoms",
      "nom": "Prénoms",
      "lignes": [
        {"contenu": "Alice", "poids": 10},
        {"contenu": "Bob", "poids": 8}
      ]
    }
  ],
  "sequences": [
    {
      "id": "personnage",
      "nom": "Personnage aléatoire",
      "items": [
        {
          "titre": "Prénom",
          "references": [{"ID": "tbl:prenoms", "poids": 10, "min": 1, "max": 1}]
        }
      ]
    }
  ]
}
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

- Ouvrir une issue pour signaler un bug
- Proposer une amélioration via une pull request
- Partager vos fichiers `.gntb` dans la communauté

## 📜 Licence

Beerware License - Voir [README_technique.md](README_technique.md) pour les détails.

---

*Gentab v3 — Outil de génération aléatoire — Mars 2026*

1. **Basculez sur l'onglet Éditer** — cliquez sur **✎ Éditer**, puis sur **Nouveau**.
2. **Créez vos tables** — cliquez sur **＋** à côté de « Tables », donnez un nom à votre table et ajoutez vos entrées avec leurs poids.
3. **Créez une séquence** — cliquez sur **＋** à côté de « Séquences », ajoutez des items et reliez-les à vos tables.
4. **Enregistrez et utilisez** — cliquez sur **Enregistrer** pour sauvegarder votre fichier `.gntb`, puis basculez sur l'onglet **⚄ Tirer**.

---

## Tables et séquences

Gentab repose sur deux objets fondamentaux. Comprendre la différence entre les deux est la clé pour créer de bons fichiers.

| | |
|---|---|
| 📋 **La Table** | Une liste de **valeurs**, chacune avec un **poids**. C'est votre matière première. Exemples : une liste de prénoms, une liste d'objets, une liste de lieux. |
| 🔗 **La Séquence** | Une **recette de tirage**. Elle définit quelles tables piocher et dans quel ordre. C'est ce que vous sélectionnez pour lancer un tirage. |

> 🎲 **Analogie avec les dés :** une Table, c'est comme un d20 dont chaque face aurait une étiquette et un poids différent. Une Séquence, c'est la *formule* qui dit « lance ce d20 et ce d8, et combine les résultats ».

### Exemple concret : noms de PNJ

Pour un générateur de noms masculins, vous créeriez :

- La table **« Prénoms masculins »** → Aidan, Bran, Corbin, Damon…
- La table **« Noms de famille »** → Ashcroft, Blackwood, Fairchild…
- La séquence **« Nom masculin »** → tire 1 fois dans chaque table

Un tirage de 4 pourrait donner :

| # | Prénom | Nom de famille |
|---|--------|----------------|
| 1 | Corbin | Ashcroft |
| 2 | Damon  | Fairchild |
| 3 | Aidan  | Blackwood |
| 4 | Bran   | Kensington |

> ℹ️ Gentab garantit que **chaque combinaison est unique** dans un tirage. En revanche, une valeur isolée (ex. « Corbin ») peut apparaître plusieurs fois si elle est couplée à des noms de famille différents.

---

## Les poids

Chaque entrée d'une table a un **poids** — un nombre entier positif qui représente sa probabilité d'être tirée. Plus le poids est élevé, plus l'entrée a de chances de sortir.

Les poids sont *relatifs* entre eux : seul le rapport entre les valeurs compte. Mettre tous les poids à 1 ou tous à 100 donne le même résultat — un tirage uniforme.

**Exemple — Table de rencontres** (somme des poids = 21) :

| Entrée | Poids | Probabilité |
|--------|-------|-------------|
| Guerrier | 10 | ≈ 48 % |
| Mage | 7 | ≈ 33 % |
| Nécromancien | 3 | ≈ 14 % |
| Demi-dieu | 1 | ≈ 5 % |

> 💡 **Astuce :** l'éditeur affiche le pourcentage calculé en temps réel à côté de chaque poids. Nul besoin de faire le calcul vous-même !

### Quelques exemples de répartition

| Poids | Résultat | Usage typique |
|-------|----------|---------------|
| Tous à **10** | Tirage uniforme (équiprobable) | Listes de noms, lieux sans rareté |
| 10 / 5 / 1 | Commun / Rare / Très rare | Tables de butin |
| 8 / 8 / 4 / 1 | 2 fréquents, 1 moins fréquent, 1 exceptionnel | Rencontres, événements |
| 100 / 1 | Le second sort ~1 % du temps | Événements exceptionnels |

---

## Colonnes multiples

Une séquence peut tirer dans **plusieurs tables à la fois**. Chaque table que vous ajoutez à une séquence devient une colonne supplémentaire dans le tableau de résultats.

Vous pouvez également tirer **plusieurs valeurs** dans une même table pour un seul tirage, en réglant le minimum et le maximum :

| Réglage min/max | Comportement | Exemple de résultat |
|-----------------|--------------|---------------------|
| min 1 / max 1 | Exactement 1 valeur (défaut) | Épée |
| min 2 / max 2 | Exactement 2 valeurs | Épée, Bouclier |
| min 1 / max 3 | Entre 1 et 3 valeurs (aléatoire) | Arc, Potion, Épée |

> ℹ️ Quand plusieurs valeurs sont générées pour une même cellule, elles s'affichent chacune sur sa propre ligne dans le tableau de résultats.

---

## Créer une table

1. **Cliquez sur ＋** à côté de « Tables » — une nouvelle table vide est créée et sélectionnée dans le panneau de droite.
2. **Donnez un nom à votre table** — ce nom sera l'en-tête de colonne dans le tableau de résultats. Exemples : *Prénom*, *Lieu*, *Type d'objet*.
3. **Ajoutez vos entrées** — cliquez sur **+ Ajouter une ligne** et renseignez le contenu et le poids. Répétez pour chaque entrée. Le pourcentage se calcule automatiquement.

> 💡 **Import en masse :** vous avez déjà une longue liste dans un fichier texte ? Cliquez sur **Importer des lignes** et collez votre liste — une entrée par ligne. Vous pouvez aussi préciser le poids en ajoutant `;10` après chaque entrée (ex. `Épée;10`).

> 🖱️ **Réordonner :** vous pouvez glisser-déposer les lignes (par la poignée ⠿ à gauche) pour les réorganiser. L'ordre n'affecte pas les probabilités.

---

## Créer une séquence

1. **Cliquez sur ＋** à côté de « Séquences » — une nouvelle séquence vide est créée.
2. **Donnez un nom et éventuellement une description** — le nom s'affiche dans la liste déroulante de l'onglet Tirer. La description apparaît en dessous comme aide-mémoire.
3. **Ajoutez un item pour chaque colonne souhaitée** — cliquez sur **+ Ajouter un item**. Chaque item correspond à une colonne dans le tableau de résultats.
4. **Reliez chaque item à une table** — pour chaque item, cliquez sur **+ Référence**, choisissez *Table*, sélectionnez votre table dans la liste, et réglez le min/max.

> ℹ️ Le **titre de l'item** sera l'en-tête de colonne dans le tableau de résultats. Donnez-lui un nom parlant : *Prénom*, *Lieu*, *Butin*…

---

## Plusieurs références dans un item

Un item peut pointer vers **plusieurs tables** — Gentab en choisira une aléatoirement selon les poids des références. C'est utile pour créer de la variété sans multiplier les séquences.

### Exemple : prénoms mixtes

Pour une séquence qui tire indifféremment dans des prénoms masculins ou féminins, créez un item « Prénom » avec **deux références** :

- Référence 1 → Table « Prénoms masculins », poids 10
- Référence 2 → Table « Prénoms féminins », poids 10

Les deux tables ont le même poids → 50 % de chances pour chacune. Si vous mettez 7 et 3, ce sera 70 % / 30 %.

> ⚠️ Le poids d'une **référence** (dans un item avec plusieurs références) n'est *pas* le même que le poids d'une **ligne** (dans une table). Le poids de référence choisit *quelle table* utiliser. Le poids de ligne choisit *quelle valeur* dans cette table.

---

## Séquences imbriquées

Un item peut référencer non pas une **table**, mais une autre **séquence**. Dans ce cas, la sous-séquence est résolue entièrement et ses colonnes s'insèrent directement dans le résultat.

C'est utile pour **composer des séquences complexes** à partir de séquences plus simples déjà existantes.

### Exemple : butin avec catégories

Vous avez deux séquences existantes :

- **Objet Minéral** → colonnes « Matière » et « Qualité »
- **Objet Manufacturé** → colonnes « Type » et « Matériau »

Vous créez une séquence « Butin » avec un item « Objet » qui référence les deux sous-séquences avec le même poids. Selon celle choisie, le tableau de résultats affichera les colonnes correspondantes.

> 🔀 Les colonnes issues d'une séquence imbriquée s'affichent en *italique violet* dans le tableau de résultats pour les distinguer des colonnes directes.

> ⚠️ **Évitez les boucles !** Si la séquence A référence la séquence B qui référence la séquence A, Gentab détecte la boucle et bloque le tirage pour ces séquences (signalées par ⚠). Les autres séquences du fichier restent utilisables normalement.

---

## Sauvegarder votre fichier

Cliquez sur **Enregistrer** dans la barre d'outils de l'onglet Éditer. Votre navigateur télécharge un fichier `.gntb` sur votre ordinateur. Pour choisir un nom différent, utilisez **Enregistrer sous…**

> 💡 **L'astérisque (\*) dans l'onglet Éditer** vous signale des modifications non sauvegardées. Si vous fermez la page avec des modifications en cours, votre navigateur vous avertira.

> ℹ️ Un fichier `.gntb` est simplement du **texte standard**. Vous pouvez l'ouvrir avec n'importe quel éditeur de texte (Notepad, VS Code…) pour l'inspecter ou le modifier manuellement si vous le souhaitez.

---

## Faire un tirage

1. **Assurez-vous qu'un fichier est chargé** — le badge en haut de page affiche ✦ vert si un fichier est chargé correctement.
2. **Sélectionnez une séquence** — choisissez la séquence souhaitée dans la liste déroulante. Si elle a une description, elle s'affiche juste en dessous.
3. **Indiquez le nombre de tirages** — le champ numérique accepte des valeurs de 1 à 100.
4. **Cliquez sur ⚄ Tirer** — le tableau de résultats se remplit avec des combinaisons uniques.

---

## Lire les résultats

Le tableau de résultats affiche :

- Une **ligne par tirage**, numérotée.
- Une **colonne par item** de la séquence.
- Les colonnes issues de séquences imbriquées en *italique violet*.

Le badge **X / Y** en haut à droite indique :

- 🟢 **Vert (5/5)** : tous les tirages demandés ont été générés.
- 🟠 **Orange (3/5)** : pas assez de combinaisons uniques disponibles — Gentab a généré le maximum possible.

### Copier et effacer

- **Copier** : copie les résultats dans le presse-papier au format tableau, directement collable dans Excel ou LibreOffice Calc.
- **Effacer** : vide le tableau de résultats.

> 💡 Chaque clic sur **⚄ Tirer** génère un nouveau tirage qui *s'ajoute* aux résultats existants. Cliquez sur **Effacer** d'abord si vous voulez repartir de zéro.

---

## Conseils pratiques

### Organiser son fichier

- Donnez des noms clairs à vos tables — ils deviendront les en-têtes de colonnes.
- Commencez par créer toutes vos tables avant de créer vos séquences.
- Une table peut être utilisée par plusieurs séquences : pas besoin de dupliquer.
- Réordonnez les tables et séquences par glisser-déposer pour les classer logiquement.

### Bien régler les poids

- Utilisez des poids simples : 10 pour commun, 5 pour rare, 1 pour exceptionnel.
- Le pourcentage affiché en temps réel vous aide à visualiser la répartition.
- Des poids identiques → tirage uniforme. Pratique pour des listes de noms.
- L'importation en masse accepte le format `valeur;poids` pour aller vite.

### Partager son fichier

- Partagez simplement le fichier `.gntb` — vos joueurs n'ont besoin que de `gentab.html` pour l'utiliser.
- Gentab fonctionne hors ligne : parfait en session, sans connexion.
- Vous pouvez avoir plusieurs fichiers `.gntb` pour différentes campagnes.

---

## Questions fréquentes

**Mon fichier .gntb ne se charge pas. Que faire ?**

Vérifiez que le fichier est bien un fichier texte valide (il peut s'ouvrir avec un éditeur de texte et afficher du contenu lisible). Si vous avez modifié le fichier manuellement, une virgule manquante ou un guillemet non fermé suffit à le corrompre. Des outils en ligne comme *jsonlint.com* permettent de valider le format gratuitement.

---

**Le bouton « Tirer » est grisé. Pourquoi ?**

Deux raisons possibles : aucun fichier n'est chargé (cliquez sur Charger), ou la séquence sélectionnée contient une boucle circulaire (signalée par ⚠). Vérifiez que vos séquences ne se référencent pas mutuellement en boucle dans l'onglet Éditer.

---

**J'obtiens « Seulement X combinaisons disponibles ». Pourquoi ?**

Le nombre de combinaisons uniques possibles dépend du nombre d'entrées dans vos tables. Si vous demandez 50 tirages mais que votre séquence ne peut produire que 30 combinaisons distinctes, Gentab vous retourne le maximum disponible. La solution : enrichissez vos tables avec plus d'entrées.

---

**Puis-je utiliser Gentab sans connexion internet ?**

Oui, complètement. Gentab est un fichier HTML unique qui fonctionne directement dans votre navigateur. La seule chose qui nécessite une connexion est le chargement des polices de caractères — si vous êtes hors ligne, le navigateur utilisera automatiquement ses polices par défaut, sans impact sur le fonctionnement.

---

**Mes données sont-elles envoyées quelque part ?**

Non. Gentab fonctionne entièrement dans votre navigateur. Aucune donnée n'est transmise à un serveur. Vos fichiers `.gntb` restent sur votre ordinateur.

---

**Puis-je modifier un fichier .gntb avec un éditeur de texte ?**

Oui. Un fichier `.gntb` est du texte standard — vous pouvez l'ouvrir et le modifier avec Notepad, VS Code, ou n'importe quel éditeur de texte. L'éditeur intégré de Gentab reste cependant recommandé car il valide votre fichier en temps réel et évite les erreurs.

---

**J'ai un fichier .gntb d'une ancienne version de Gentab. Est-il compatible ?**

Oui, Gentab v3 est entièrement rétrocompatible avec les fichiers créés par les versions précédentes. Chargez votre ancien fichier normalement — l'application détecte automatiquement le format et s'adapte.

---

## Licence

```
THE BEER-WARE LICENSE

As long as you retain this notice you can do whatever you want with this software.
If we meet some day, and you think this is worth it, you can buy me a beer in return.
```

---

*Gentab v3 — Guide utilisateur — Mars 2026*
