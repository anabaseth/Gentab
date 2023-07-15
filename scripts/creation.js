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
        separatorsList: [
            { titre: 'Virgule', separator: ',' },
            { titre: 'Point-virgule', separator: ';' },
            { titre: 'retour à la ligne', separator: '\n' }
        ],
        traduction: null,
        Collection: null,
        table: null,
        sequence: null,
        showAddTables: false,
        showReglageTables: false,
        showReglageColonne: false,
        showReglageSequences: false,
        item: null,
        itemIndex: null,
        affichageTable: 'input',
        currentPageTable: 1, // Page courante de la pagination
        lignesPerPage: 10,
        nomFichier: '',
        encodageData: '',
        separator: ',',
        currentEncondedPage: 1,
        showEncodage: false,
        showDelLignes: false,
        Import: null
    },
    computed: {
        langues(){        
            if (!this.traduction) {
                this.traduction = new Traduction(translations);
            }
            return this.traduction.getKeys();
        },
        paginatedEncodedData() {
            const startIndex = (this.currentEncondedPage - 1) * this.lignesPerPage;
            const endIndex = startIndex + this.lignesPerPage;
            if (this.table && this.table.lignes) {
                return this.encodedData.slice(startIndex, endIndex);
            }
            return [];
        },
        paginatedLignesList() {
            const startIndex = (this.currentPageTable - 1) * this.lignesPerPage;
            const endIndex = startIndex + this.lignesPerPage;
            if (this.table && this.table.lignes) {
                return this.table.lignes.slice(startIndex, endIndex);
            }
            return [];
        },
        encodedData() {
            if (this.encodageData == '') {
                return [];
            } else {
                let liste = this.encodageData.split(this.separator);
                return liste;
            }
        },
        currentTranslations() {
            if (!this.traduction) {
                this.traduction = new Traduction(translations);
            }
            return this.traduction.currentTranslations();
        },
        importCollection(){
            return new ExportCollection(this.Collection);
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
        encodage() {
            this.table.lignes.splice(this.table.lignes.length - 1, 1);
            for (const s of this.encodedData) {
                if(s){
                    this.table.lignes.push(new Ligne({ contenu: s, poids: '10' }));
                }
            }
            this.table.addLigne();
            //this.table.lignes.push({ contenu: '', poids: '10' })
            this.encodageData = '';
            this.showEncodage = false;
        },
        reset() {
            this.Collection = null;
            this.table = null;
            this.sequence = null;
            this.showAddTables = false;
            this.showReglageTables = false;
            this.showReglageColonne = false;
            this.showReglageSequences = false;
            this.item = null;
            this.itemIndex = null;
            this.affichageTable = 'input';
            this.nomFichier = '';
            this.encodageData = '';
            this.lignesPerPage = 10;
            this.separator = ',';
            this.currentEncondedPage = 1;
            this.showEncodage = false;
            this.showDelLignes = false;
            this.traduction = null;
            this.Import = null;
        },
        showPagination(index, max) {
            let borneMin;
            let borneMax;

            borneMin = this.currentPageTable - 5;
            if (borneMin < 1) {
                borneMin = 1;
            }
            borneMax = borneMin + 11;
            if (borneMax > max) {
                borneMax = max;
                borneMin = borneMax - 11;
            }
            return (index >= borneMin && index <= borneMax);
        },
        showLigne(index) {
            if (index > (this.currentPageTable * this.perPage)) {
                return false;
            }
            if (index < ((this.currentPageTable - 1) * this.perPage)) {
                return false;
            }
            return true;
        },
        getNbrPages(tab) {
            return Math.ceil(tab.length / this.perPage);
        },
        getChances(table, index) {
            let total = 0;
            if (table.length == 1 || table.length <= index) {
                return '';
            }
            for (let i = 0; i < index; i++) {
                let elem = table[i];
                total = parseInt(total, 10) + parseInt(elem.poids, 10);
            }
            let result = '' + total + ' - ';
            total = parseInt(total, 10) + parseInt(table[index].poids, 10);
            result += total + ' : ';
            return result;
        },
        editItem(index) {
            this.item = this.sequence.items[index];
            this.itemIndex = index;
        },
        nomRef(ID) {
            //*let nomTable = this.nomTable(ID);
            return this.Collection.getTableNameById(ID);
            /*if (!nomTable) {
                return 'Inconnu';
            }*/
            return nomTable;
        },
        descriptionRef(item, indexRef) {

            let ref = item.references[indexRef];
            let nomTable = this.Collection.getTableNameById(ref.ID);

            let quantite = '';
            if (ref.min != 1 || ref.max != 1) {
                if (ref.min == ref.max) {
                    quantite = ref.min;
                } else {
                    quantite = ref.min + ' à ' + ref.max + ' ';
                }
            }

            let chances = this.getChances(item.references, indexRef);

            return chances + quantite + nomTable;
        },
        setReglage() {
            if (!this.reglageActif) {
                this.showDelSequence = false;
                this.showDelTable = false;
            }
        },
        exportToJson() {
            const collection = this.importCollection.getExport();
            collection["editor"]=this.currentTranslations.titre;
            collection["editorVersion"]=this.currentTranslations.numVersion;
            const jsonData = JSON.stringify({ 'Collection': collection }, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = this.nomFichier + '.gntb';
            a.click();

            URL.revokeObjectURL(url);
            this.nomFichier = '';
        },
        newCollection(event) {
            this.reset();
            this.Collection=new Collection();
        },
        importer() {
            this.Collection.importerCollection(this.Import);
            this.Import = null;
        },
        handleFileImport(event) {

            const file = event.target.files[0];
            const reader = new FileReader();
            this.reset();

            reader.onload = () => {
                try {
                    this.Import = new Collection(JSON.parse(reader.result).Collection);
                    if (this.Import) {
                        for (const table of this.Import.tables) {
                            var trouve = this.Collection.findTableById(table.ID);
                            table["importable"] = !trouve;
                            table["import"] = false;
                        }
                        for (const sequence of this.Import.sequences) {
                            sequence["import"] = false;
                        }
                    }

                } catch (error) {
                    console.error('Erreur lors de la lecture du fichier JSON :', error);
                    Import = null;
                }
            };
            var myModal = new bootstrap.Modal(document.getElementById('importModal'), {
                keyboard: false
            }).show();

            reader.readAsText(file);
            console.log("OUT");
        },
        handleFileOpen(event) {
            console.log("handleFileOpen");
            const file = event.target.files[0];
            const reader = new FileReader();
            this.reset();

            reader.onload = () => {
                try {
                    this.Collection = new Collection(JSON.parse(reader.result).Collection);
                } catch (error) {
                    console.error('Erreur lors de la lecture du fichier JSON :', error);
                    Collection = null;
                }
            };

            reader.readAsText(file);
        }, 
        activateTable(table) {
            if (this.table) {
                this.table.lignes.splice(-1, 1);
            }
            table.lignes.push({ contenu: '', poids: '10' });
            this.table = table;
        },
        activateSequence(sequence) {

            this.sequence = sequence;
            this.item = null;
        },
        deleteItem(item){
            this.sequence.deleteItem(item);
            this.item=null;
        }
    }
});
