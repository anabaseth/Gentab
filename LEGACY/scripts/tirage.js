var footerVue = new Vue({
    el: '#footer',
    data: {
        traduction: null
    }, computed: {
        currentTranslations() {
            if (!this.traduction) {
                this.traduction = new Traduction(translations);
            }
            return this.traduction.currentTranslations();
        }
    }
});

var appVue = new Vue({
    el: '#app',
    data: {
        traduction: null,
        Collection: null,
        sequence: null,
        nbrTirages: 1,
        resultat: null
    }, computed: {
        langues(){        
            if (!this.traduction) {
                this.traduction = new Traduction(translations);
            }
            return this.traduction.getKeys();
        },
        currentTranslations() {
            if (!this.traduction) {
                this.traduction = new Traduction(translations);
            }
            return this.traduction.currentTranslations();
        }
    },
    mounted() {

        document.documentElement.setAttribute('data-bs-theme', this.getTheme());
    },
    methods: {
        getTheme (){
            return localStorage.getItem('theme') ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        },
        setTheme(){
            const theme = this.getTheme() === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', theme);
            document.documentElement.setAttribute('data-bs-theme', theme);
        },
        changeLangue(lg){
            this.traduction.language=lg;
            footerVue._data.traduction.language='en';
        },
        reset() {
            this.Collection = null;
            this.sequence = null;
            this.nbrTirages = 1;
            this.resultat = null;
        },
        tirage() {
            resultat = {
                titres: [],
                lignes: []
            };
            for (const item of this.sequence.items) {
                resultat.titres.push(item.titre);
            }
            for (let i = 0; i < this.nbrTirages; i++) {
                let ligne = {
                    colonnes: []
                };
                for (const item of this.sequence.items) {
                    let colonne = {
                        nbr: 0,
                        contenu: []
                    };
                    let reference = this.selectionnerReference(item);
                    //trouver table
                    let table = null;
                    for (const t of this.Collection.tables) {
                        if (t.ID === reference.ID) {
                            table = t;
                            break;
                        }
                    }
                    let plage = reference.max - reference.min;
                    let rand = Math.random();
                    let nbr = Math.floor(rand * plage) - (-1 * reference.min);
                    colonne.nbr = nbr;
                    for (let j = 0; j < nbr; j++) {
                        var contenu = this.selectionnerLigne(table).contenu;
                        colonne.contenu.push(contenu);
                    }
                    ligne.colonnes.push(colonne);
                }
                resultat.lignes.push(ligne);
                this.resultat = resultat;
            }
        },
        selectionnerLigne(table) {
            const lignes = table.lignes;
            let poidsTotal = 0;
            let result = null;
            for (const ligne of lignes) {
                poidsTotal += parseInt(ligne.poids);
            }

            var random = Math.random() * poidsTotal;

            for (const ligne of lignes) {
                random = random - parseInt(ligne.poids);
                if (random <= 0) {
                    result = ligne;
                    break;
                }
            }
            return result; // Si la table est vide ou les poids sont tous nuls
        },
        selectionnerReference(item) {
            let poidsTotal = 0;
            for (const reference of item.references) {
                poidsTotal += reference.poids;
            }
            let random = Math.random() * poidsTotal;
            for (const reference of item.references) {
                random -= reference.poids;
                if (random <= 0) {
                    return reference;
                }
            }
            return null; // Si l'item est vide ou les poids sont tous nuls
        },
        handleFileChange(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            this.reset();

            reader.onload = () => {
                try {
                    this.Collection = JSON.parse(reader.result).Collection;
                } catch (error) {
                    console.error('Erreur lors de la lecture du fichier JSON :', error);
                    Collection = null;
                }
            };

            reader.readAsText(file);
        }
    }
});