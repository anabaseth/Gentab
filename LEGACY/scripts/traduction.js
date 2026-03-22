class Traduction {
    constructor(content) {
        var langueNavigateur = navigator.language || navigator.userLanguage;
        this.language = langueNavigateur.split("-")[0];
        this.content = content;
    }

    currentTranslations() {
        var result = this.content[this.language];
        if (!result) {
            result = this.content['en'];
        }
        return result;
    }

    getKeys() {
        return Object.keys(this.content);
    }
}

const SingletonTraduction = (function () {
    let instance;

    function createInstance(content) {
        return new Traduction(content);
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance(translations);
            }
            return instance;
        }
    };
})();



var translations = {
    "fr": {
        "titre": "Gentab",
        "sousTitre": "Outil de génération aléatoire",
        "langueLbl": "Langue",
        "fichiers": "Fichiers",
        "detailCollectionTab": "Détail de la collection",
        "tablesTab": "Tables",
        "sequenceTab": "Modes de tirage",
        "sequenceLbl": "Mode de tirage",
        "exportTab": "Export",
        "tiragesLbl": "tirages",
        "selectFileGntb": "Sélectionner un fichier GNTB",
        "selectSequence": "Sélectionner un mode de tirage",
        "nbrTirageLbl": "Nombre de tirage",
        "selectCollection": "Sélectionner une collection",
        "orLbl": "ou",
        "selectFileLbl": "Sélectionner un fichier...",
        "importLbl": "Importer depuis un fichier",
        "importTableLbl": "Sélectionner la/les tables à importer",
        "importSequenceLbl": "Sélectionner la/les modes de tirage à importer",
        "nllCollecLbl": "Nouvelle collection",
        "createNewCollection": "Créer une nouvelle collection",
        "titreLbl": "Titre",
        "descriptionLbl": "Description",
        "colonnesLbl": "colonnes",
        "fileNameLbl": "Nom du fichier",
        "addTableLbl": "Ajouter une nouvelle table",
        "exporterLbl": "Exporter",
        "alertExportLbl":"Les Modes de Tirage invalides ne seront pas exportés",
        "lignesLbl": "lignes",
        "deleteTableLbl": "Supprimer la table",
        "confirmDeleteTableLbl": "Désirez-vous supprimer la table",
        "confirmLbl": "Confirmer",
        "annulerLbl": "Annuler",
        "ajouterSequenceLbl": "Ajouter un nouveau mode de tirage",
        "deleteSequenceLbl": "Supprimer le mode de tirage",
        "confirmDeleteSequenceLbl": "Désirez-vous supprimer le mode de tirage",
        "dupliquerSequenceLbl": "Dupliquer le mode de tirage",
        "confirmDupliquerSequenceLbl": "Désirez-vous dupliquer le mode de tirage",
        "modificationLbl": "Modification",
        "expressLbl": "Express",
        "supprimerLignesLbl": "Supprimer des lignes",
        "reglageLbl": "Règlages",
        "affichageLbl": "Affichage",
        "compactLbl": "Compact",
        "etenduLbl": "Etendu",
        "avanceLbl": "Avancé",
        "encodageRapideLbl": "Encodage rapide",
        "separateurLbl": "Séparateur",
        "encodageRapideLabel": "Entrez plusieurs lignes séparées par le séparateur sélectionné.",
        "injectionLbl_1": "Injection des",
        "injectionLbl_2": "lignes dans la table",
        "detailTableLbl": "Détail de la table",
        "contenuLbl": "contenu",
        "poidsLbl": "Poids",
        "sequencesLbl": "Modes de tirage",
        "backLbl": "Back",
        "detailSequenceLbl": "Détail du mode de tirage",
        "addColonneLbl": "Ajouter une colonne",
        "titreColLbl": "Titre de la colonne",
        "deleteColLbl": "Supprimer la colonne",
        "confirmDeleteColLbl": " Désirez-vous supprimer la colonne",
        "addTableToColonne": "Ajouter une table à la colonne",
        "selectTable": "Sélectionner une table",
        "tableLbl": "Table",
        "minimumLbl": "Minimum",
        "maximumLbl": "Maximum",
        "delTableToCol": "Supprimer la table",
        "confirmDelTableToCol": "Désirez-vous supprimer la table",
        "emptyItemList":"Le mode de tirage ne contient aucune colonne",
        "refListVide": "Une des colonnes du Mode de Tirage est incomplète",
        "tableInvalide":"Au moins une table utilisée par le mode de tirage est invalide",
        "tableVide":"La table ne contient aucune ligne",
        "tableInutilisee":"La table n'est utilisée dans aucun mode de tirage",
        "realiseLbl": "Réalisé par ",
        "beerWareLicenceLbl": "en licence Beer-ware",
        "beerWareLink": "https://fedoraproject.org/wiki/Licensing/Beerware",
        "version": "Version",
        "numVersion": "2.1.0"
    },
    "en": {
        "titre": "Gentab",
        "sousTitre": "Random Generation Tool",
        "langueLbl": "Language",
        "fichiers": "Files",
        "detailCollectionTab": "Collection Details",
        "tablesTab": "Tables",
        "sequenceTab": "Drawing modes",
        "sequenceLbl": "Drawing Mode",
        "exportTab": "Export",
        "tiragesLbl": "draw",
        "selectFileGntb": "Select a GNTB File",
        "selectSequence": "Select a Drawing mode",
        "nbrTirageLbl": "Drawing number",
        "selectCollection": "Sélect a collection",
        "orLbl": "or",
        "selectFileLbl": "Select a File...",
        "importLbl": "Import from file",
        "importTableLbl": "Sélect tables to import",
        "importSequenceLbl": "Sélect Drawing modes à importer",
        "nllCollecLbl": "New collection",
        "createNewCollection": "Create a New Collection",
        "titreLbl": "Title",
        "descriptionLbl": "Description",
        "colonnesLbl": "Columns",
        "fileNameLbl": "File Name",
        "addTableLbl": "Add a New Table",
        "exporterLbl": "Export",
        "alertExportLbl":"Invalid Drawing Modes should not be exported.",
        "lignesLbl": "Rows",
        "deleteTableLbl": "Delete Table",
        "confirmDeleteTableLbl": "Do you want to delete the table",
        "confirmLbl": "Confirm",
        "annulerLbl": "Cancel",
        "ajouterSequenceLbl": "Add a New Drawing mode",
        "deleteSequenceLbl": "Delete Drawing mode",
        "confirmDeleteSequenceLbl": "Do you want to delete the drawing mode",
        "dupliquerSequenceLbl": "Duplicate Drawing mode",
        "confirmDupliquerSequenceLbl": "Do you want to duplicate the Drawing mode",
        "modificationLbl": "Modification",
        "expressLbl": "Express",
        "supprimerLignesLbl": "Delete Rows",
        "reglageLbl": "Settings",
        "affichageLbl": "Display",
        "compactLbl": "Compact",
        "etenduLbl": "Extended",
        "avanceLbl": "Advanced",
        "encodageRapideLbl": "Quick Encoding",
        "separateurLbl": "Separator",
        "encodageRapideLabel": "Enter multiple lines separated by the selected separator.",
        "injectionLbl_1": "Injection of",
        "injectionLbl_2": "lines into the table",
        "detailTableLbl": "Table Details",
        "contenuLbl": "Content",
        "poidsLbl": "Weight",
        "sequencesLbl": "Drawing modes",
        "backLbl": "Back",
        "detailSequenceLbl": "Drawing mode Details",
        "addColonneLbl": "Add a Column",
        "titreColLbl": "Column Title",
        "deleteColLbl": "Delete Column",
        "confirmDeleteColLbl": "Do you want to delete the column",
        "addTableToColonne": "Add a Table to the Column",
        "selectTable": "Select a Table",
        "tableLbl": "Table",
        "minimumLbl": "Minimum",
        "maximumLbl": "Maximum",
        "delTableToCol": "Delete Table",
        "confirmDelTableToCol": "Do you want to delete the table",
        "emptyItemList":"The Drawing Mode contains no column",
        "refListVide": "At least one column of the Drawing Mode is invalid",
        "tableInvalide": "At least one table used by the drawing mode is invalid",
        "tableVide": "The table contains no rows",
        "tableInutilisee": "The table is not used in any drawing mode",
        "realiseLbl": "Realized by ",
        "beerWareLicenceLbl": "under Beer-ware license",
        "beerWareLink": "https://fedoraproject.org/wiki/Licensing/Beerware",
        "version": "Version",
        "numVersion": "2.1.0"
    }
};