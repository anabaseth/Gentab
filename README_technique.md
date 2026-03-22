# Gentab v3 — Documentation technique

> Documentation complète du format de fichier `.gntb` et du fonctionnement de l'application.

---

## Table des matières

- [Introduction](#introduction)
- [Démarrage rapide](#démarrage-rapide)
- [Formats supportés](#formats-supportés)
- [Structure racine](#structure-racine)
- [Tables](#tables)
- [Séquences](#séquences)
- [Items & Références](#items--références)
- [Préfixes tbl: et seq:](#préfixes-tbl-et-seq)
- [Algorithme de tirage](#algorithme-de-tirage)
- [Séquences imbriquées](#séquences-imbriquées)
- [Boucles circulaires](#boucles-circulaires)
- [Exemples](#exemples)
- [Schéma complet](#schéma-complet)
- [Rétrocompatibilité v1](#rétrocompatibilité-v1)
- [Règles de validation](#règles-de-validation)
- [Licence](#licence)

---

## Introduction

**Gentab v3** est un outil de génération aléatoire pondérée. Il lit des fichiers `.gntb` — des fichiers JSON décrivant des *tables* de valeurs et des *séquences* qui orchestrent des tirages dans ces tables — et produit des combinaisons aléatoires selon les probabilités définies.

L'application est un fichier HTML unique (`gentab.html`), sans dépendance externe, utilisable directement dans un navigateur, hors ligne.

**Cas d'usage typiques :** générateurs de noms de PNJ pour jeux de rôle, tables de butins, rencontres aléatoires, générateurs de descriptions, oracles narratifs…

---

## Démarrage rapide

### Utiliser un fichier .gntb existant

1. Ouvrez `gentab.html` dans votre navigateur (double-clic).
2. Cliquez sur **Charger** et sélectionnez un fichier `.gntb`.
3. Choisissez une **séquence** dans la liste déroulante (onglet **⚄ Tirer**).
4. Définissez le **nombre de tirages** souhaité.
5. Cliquez sur **⚄ Tirer**.

### Créer un fichier .gntb via l'éditeur

1. Basculez sur l'onglet **✎ Éditer**.
2. Cliquez sur **Nouveau** ou **Ouvrir** pour partir d'un fichier existant.
3. Créez vos tables, ajoutez des lignes avec leurs poids.
4. Créez vos séquences, ajoutez des items et des références vers vos tables.
5. Cliquez sur **Enregistrer** pour télécharger le fichier `.gntb`.

> **Note :** un fichier `.gntb` est du JSON standard avec l'extension `.gntb`. Il peut être créé et modifié avec n'importe quel éditeur de texte.

---

## Formats supportés

Gentab v3 lit deux formats de fichier `.gntb` :

| Format | Structure racine | Usage |
|--------|-----------------|-------|
| **v1** *(legacy)* | `{ "Collection": { "tables": [...], "sequences": [...] } }` | Fichiers créés par les versions précédentes de Gentab |
| **v2** *(actuel)* | `{ "tables": [...], "sequences": [...] }` | Format produit par Gentab Editor. Recommandé pour les nouveaux fichiers |

L'application détecte automatiquement le format et normalise les différences de nommage (`ID`/`id`, `nom`/`name`). Le format v1 est intégralement supporté en lecture, sans aucune modification nécessaire.

---

## Structure racine

Un fichier `.gntb` v2 contient les champs suivants à la racine :

| Champ | Type | Statut | Description |
|-------|------|--------|-------------|
| `titre` | string | optionnel | Nom de la collection, affiché dans l'éditeur |
| `description` | string | optionnel | Description libre de la collection |
| `tables` | array | requis | Tableau d'objets Table |
| `sequences` | array | requis | Tableau d'objets Séquence. Doit contenir au moins une séquence pour que le tirage soit possible |

---

## Tables

Une **Table** est une liste de valeurs textuelles, chacune associée à un *poids* qui détermine sa probabilité d'être tirée. Plus le poids est élevé, plus la valeur a de chances d'être sélectionnée.

### Champs

| Champ | Type | Statut | Description |
|-------|------|--------|-------------|
| `id` | string | requis | Identifiant unique. L'éditeur génère des UUID v4. Toute chaîne unique est acceptée (ex. `"prenoms-masculins"`) |
| `nom` | string | requis | Nom affiché comme en-tête de colonne dans le tableau de résultats |
| `lignes` | array | requis | Tableau d'objets `{ contenu, poids }`. Doit contenir au moins une entrée |

### Champs d'une ligne

| Champ | Type | Statut | Description |
|-------|------|--------|-------------|
| `contenu` | string | requis | Valeur affichée lors d'un tirage. Tout texte Unicode est accepté |
| `poids` | integer | requis | Probabilité relative (minimum : 1). Peut être transmis comme chaîne `"10"` — Gentab convertit automatiquement |

### Exemple

```json
{
  "id": "objets",
  "nom": "Type d'objet",
  "lignes": [
    { "contenu": "Épée",            "poids": 10 },
    { "contenu": "Bouclier",        "poids": 10 },
    { "contenu": "Arc",             "poids": 8  },
    { "contenu": "Potion de soin",  "poids": 4  },
    { "contenu": "Artefact ancien", "poids": 1  }
  ]
}
```

> **Calcul des probabilités :** somme des poids = 33. Épée et Bouclier : 10/33 ≈ 30 % chacun. Arc : 24 %. Potion : 12 %. Artefact : 3 %.

---

## Séquences

Une **Séquence** orchestre un ou plusieurs tirages dans des tables (ou d'autres séquences). C'est l'unité sélectionnable dans l'onglet Tirer.

### Champs

| Champ | Type | Statut | Description |
|-------|------|--------|-------------|
| `id` | string | requis | Identifiant unique. Utilisé dans les références `seq:` |
| `nom` | string | requis | Nom affiché dans la liste déroulante |
| `description` | string | optionnel | Affichée sous le sélecteur de séquence |
| `items` | array | requis | Tableau d'Items. Doit contenir au moins un item |

---

## Items & Références

Un **Item** est une colonne de résultat. Il contient un tableau de **Références** pointant vers des tables ou d'autres séquences.

Si un item a plusieurs références, l'une d'elles est sélectionnée aléatoirement (tirage pondéré sur les poids des références) avant d'effectuer le tirage dans la cible.

### Champs d'un item

| Champ | Type | Statut | Description |
|-------|------|--------|-------------|
| `titre` | string | requis | En-tête de la colonne. Ignoré si l'item référence une séquence (les titres de la sous-séquence sont utilisés) |
| `references` | array | requis | Tableau de Référence. Au moins une référence |

### Champs d'une référence

| Champ | Type | Statut | Description |
|-------|------|--------|-------------|
| `ID` | string | requis | Identifiant de la cible, préfixé par `tbl:` ou `seq:` |
| `poids` | integer | requis | Poids de sélection de cette référence parmi les autres références du même item |
| `min` | integer | requis | Nombre minimum de valeurs générées (≥ 1) |
| `max` | integer | requis | Nombre maximum de valeurs générées (≥ min) |

> **Plusieurs valeurs dans une cellule :** si min ou max est supérieur à 1, les valeurs générées s'affichent chacune sur sa propre ligne dans le tableau de résultats.

### Format simplifié (item.id)

Pour les items avec une seule référence à une table (min=1, max=1, poids=10), un format raccourci est accepté en lecture :

```json
// Format complet
{ "titre": "Objet", "references": [{ "ID": "tbl:objets", "poids": 10, "min": 1, "max": 1 }] }

// Format simplifié équivalent (lecture seule)
{ "titre": "Objet", "id": "objets" }
```

> L'éditeur produit toujours le format complet lors de la sauvegarde.

---

## Préfixes tbl: et seq:

Le champ `ID` d'une référence utilise un préfixe pour distinguer le type de cible. Ce préfixe n'apparaît **que dans les références** — les champs `id` des objets Table et Séquence sont des identifiants bruts, sans préfixe.

| Préfixe | Type | Exemple | Notes |
|---------|------|---------|-------|
| `tbl:` | Table | `tbl:objets` | Référence une table par son `id` |
| `seq:` | Séquence | `seq:butin-mineral` | Référence une séquence par son `id` *(v2)* |
| *(sans préfixe)* | Table | `04b997b1-…` | Rétrocompatibilité v1 uniquement. Traité comme `tbl:` |

---

## Algorithme de tirage

### Tirage pondéré cumulatif

La sélection d'une ligne dans une table utilise un algorithme cumulatif :

1. Calculer la somme *S* de tous les poids de la table.
2. Tirer un réel aléatoire *R* dans [0, S[.
3. Parcourir les lignes en ordre, en soustrayant chaque poids de *R*.
4. Retourner la ligne courante dès que *R* < 0.

Ce mécanisme garantit que chaque ligne est sélectionnée avec une probabilité proportionnelle à son poids.

### Déduplication

Lors d'un tirage de *n* résultats, Gentab garantit que les **combinaisons complètes sont uniques** : une même combinaison (toutes les colonnes identiques) ne peut pas apparaître deux fois dans le même tirage.

En revanche, une même valeur isolée *peut* apparaître plusieurs fois (ex. plusieurs lignes avec « Épée » dans la colonne Type, tant qu'elles diffèrent sur d'autres colonnes).

> Si l'espace des combinaisons uniques possibles est inférieur au nombre de tirages demandé, Gentab retourne le maximum disponible et affiche un avertissement.

### Limite de profondeur

La résolution récursive des séquences imbriquées est limitée à **50 niveaux** pour prévenir tout débordement de pile. Cette limite est largement suffisante pour tout fichier `.gntb` réel.

---

## Séquences imbriquées

Une référence peut pointer vers une **séquence** (préfixe `seq:`) au lieu d'une table. La sous-séquence est alors résolue entièrement et ses colonnes sont *injectées* à la position de l'item parent dans le tableau de résultats.

Les champs `min` et `max` contrôlent combien de fois la sous-séquence est résolue.

### Exemple

```json
{
  "titre": "Objet",
  "references": [
    { "ID": "seq:objet-mineral",    "poids": 5, "min": 1, "max": 1 },
    { "ID": "seq:objet-manufacture","poids": 5, "min": 1, "max": 1 }
  ]
}
```

Si `objet-mineral` contient les items *Matière* et *Qualité*, et `objet-manufacture` les items *Type* et *Matériau*, le tableau de résultats affichera 2 colonnes dynamiques selon la sous-séquence sélectionnée.

> Les colonnes issues de séquences imbriquées s'affichent en *italique violet* dans le tableau de résultats.

---

## Boucles circulaires

Une boucle circulaire survient quand la séquence A référence la séquence B qui référence (directement ou indirectement) la séquence A.

Gentab détecte et gère les boucles à trois niveaux :

1. **À l'ouverture du fichier :** analyse DFS (parcours en profondeur) qui identifie toutes les séquences impliquées. Elles sont signalées par ⚠ dans la liste et le tirage est bloqué pour ces séquences.
2. **Durant le tirage :** une pile d'appel (`callStack`) maintient les IDs de séquences en cours de résolution. Si une séquence cible est déjà dans la pile, la résolution s'arrête et la cellule affiche `[boucle]`.
3. **Garde de profondeur :** même sans cycle, la résolution est limitée à 50 niveaux d'imbrication.

> Les séquences *valides* d'un fichier contenant des boucles circulaires restent utilisables normalement.

---

## Exemples

### Fichier simple — générateur de rencontres

```json
{
  "titre": "Générateur de rencontres",
  "tables": [
    {
      "id": "personnages",
      "nom": "Personnage",
      "lignes": [
        { "contenu": "Guerrier",     "poids": 8 },
        { "contenu": "Mage",         "poids": 6 },
        { "contenu": "Nécromancien", "poids": 2 }
      ]
    },
    {
      "id": "lieux",
      "nom": "Lieu",
      "lignes": [
        { "contenu": "Donjon",  "poids": 8 },
        { "contenu": "Forêt",   "poids": 8 },
        { "contenu": "Taverne", "poids": 4 }
      ]
    }
  ],
  "sequences": [
    {
      "id": "rencontre",
      "nom": "Rencontre aléatoire",
      "description": "Un personnage rencontré quelque part",
      "items": [
        {
          "titre": "Qui ?",
          "references": [{ "ID": "tbl:personnages", "poids": 10, "min": 1, "max": 1 }]
        },
        {
          "titre": "Où ?",
          "references": [{ "ID": "tbl:lieux", "poids": 10, "min": 1, "max": 1 }]
        }
      ]
    }
  ]
}
```

**Résultat d'un tirage de 3 :**

| # | Qui ? | Où ? |
|---|-------|------|
| 1 | Guerrier | Donjon |
| 2 | Mage | Forêt |
| 3 | Nécromancien | Taverne |

---

### Références multiples et min/max

```json
// Item tirant dans l'une ou l'autre table (50/50)
{
  "titre": "Prénom",
  "references": [
    { "ID": "tbl:prenoms-masculins", "poids": 10, "min": 1, "max": 1 },
    { "ID": "tbl:prenoms-feminins",  "poids": 10, "min": 1, "max": 1 }
  ]
}

// Item tirant entre 1 et 3 valeurs
{
  "titre": "Butin",
  "references": [{ "ID": "tbl:objets", "poids": 10, "min": 1, "max": 3 }]
}
```

---

### Séquences imbriquées

```json
{
  "sequences": [
    {
      "id": "objet-mineral",
      "nom": "Objet Minéral",
      "items": [
        { "titre": "Matière", "references": [{ "ID": "tbl:matieres", "poids": 10, "min": 1, "max": 1 }] },
        { "titre": "Qualité", "references": [{ "ID": "tbl:qualites", "poids": 10, "min": 1, "max": 1 }] }
      ]
    },
    {
      "id": "butin",
      "nom": "Butin de rencontre",
      "items": [
        {
          "titre": "Objet",
          "references": [
            { "ID": "seq:objet-mineral",    "poids": 5, "min": 1, "max": 1 },
            { "ID": "seq:objet-manufacture","poids": 5, "min": 1, "max": 1 }
          ]
        }
      ]
    }
  ]
}
```

---

## Schéma complet

| Chemin | Type | Statut | Description |
|--------|------|--------|-------------|
| `titre` | string | optionnel | Titre de la collection |
| `description` | string | optionnel | Description de la collection |
| `tables` | array | requis | Liste des tables |
| `tables[].id` | string | requis | Identifiant unique (sans préfixe) |
| `tables[].nom` | string | requis | Nom affiché en en-tête de colonne |
| `tables[].lignes` | array | requis | Tableau de lignes |
| `tables[].lignes[].contenu` | string | requis | Valeur tirée |
| `tables[].lignes[].poids` | integer | requis | Poids (≥ 1) |
| `sequences` | array | requis | Liste des séquences |
| `sequences[].id` | string | requis | Identifiant unique (sans préfixe) |
| `sequences[].nom` | string | requis | Nom dans la liste déroulante |
| `sequences[].description` | string | optionnel | Description affichée sous le sélecteur |
| `sequences[].items` | array | requis | Liste des items (colonnes) |
| `sequences[].items[].titre` | string | requis | En-tête de colonne |
| `sequences[].items[].references` | array | requis | Références (au moins une) |
| `…references[].ID` | string | requis | `tbl:id` ou `seq:id` |
| `…references[].poids` | integer | requis | Poids de sélection de cette référence |
| `…references[].min` | integer | requis | Nombre minimum de valeurs (≥ 1) |
| `…references[].max` | integer | requis | Nombre maximum de valeurs (≥ min) |

---

## Rétrocompatibilité v1

| Élément | v1 | v2 |
|---------|----|----|
| Enveloppe racine | `"Collection": { ... }` | Racine nue |
| Champ ID de table | `"ID"` (majuscule) | `"id"` (minuscule) |
| Champ nom de table | `"nom"` ou `"name"` | `"nom"` |
| ID de séquence | Absent (index utilisé) | `"id"` |
| Préfixe référence | Absent (UUID brut) | `tbl:` ou `seq:` |
| Poids de ligne | Chaîne `"10"` | Entier `10` |

> Aucune modification n'est nécessaire sur vos fichiers v1. Chargez-les directement.

---

## Règles de validation

L'éditeur vérifie ces règles en temps réel et bloque la sauvegarde si l'une d'elles est violée :

- Le **titre** de la collection ne peut pas être vide.
- Chaque **table** doit avoir un nom non vide et au moins une ligne.
- Chaque **ligne** doit avoir un contenu non vide et un poids ≥ 1.
- Chaque **séquence** doit avoir un nom non vide et au moins un item.
- Chaque **item** doit avoir un titre non vide et au moins une référence.
- Chaque **référence** doit pointer vers une cible existante.
- Dans une référence, **max doit être ≥ min**.
- Les **boucles circulaires** entre séquences sont détectées et signalées.

---

## Licence

```
THE BEER-WARE LICENSE

As long as you retain this notice you can do whatever you want with this software.
If we meet some day, and you think this is worth it, you can buy me a beer in return.
```

---

*Gentab v3 — Documentation technique — Mars 2026*
