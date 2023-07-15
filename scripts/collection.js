class Collection {
    constructor(content) {
        this.titre = "";
        this.description = "";
        this.tables = [];
        this.sequences = [];
        if (content) {
            this.titre = content.titre;
            this.description = content.description;
            for (const cTable of content.tables) {
                this.tables.push(new Table(cTable));
            }
            for (const cSeq of content.sequences) {
                this.sequences.push(new Sequence(cSeq));
            }
        }
    }
    findTableById(ID){
        const found = this.tables.find(element => element.ID ===ID);
        return found;
    }
    importerTable(table){
        if(!this.findTableById(table.ID)){
            this.tables.push(new Table(table));
        }
    }
    importerSequence(sequence){
        this.sequences.push(new Sequence(sequence));
    }
    importerCollection(content){
        for(const table of content.tables){
            if(table.import){
                table.nom = "EXT-" + table.nom;     
                this.importerTable(table);           
            }
        }
        let i = 0;
        for(const sequence of content.sequences){
            i++;
            //console.log(i +" - sequence="+JSON.stringify(sequence));
            if(sequence.import){ 
                //console.log("sequence APRES="+JSON.stringify(sequence));
                sequence.nom = "EXT-" + sequence.nom;
                //console.log("YY");
                this.importerSequence(sequence);
                for (const item of sequence.items) {
                    for (const reference of item.references) { 
                        let table = this.findTableById(reference.ID);
                        //si la table référencée ne se trouve PAS dans la collection actuelle
                        if (!table) {       
                            table=content.findTableById(reference.ID);
                            table.nom = "EXT-" + table.nom;   
                            this.importerTable(table);
                            break;                    
                        }
                    }
                }
            }
            //console.log(i + "sequence FIN="+JSON.stringify(sequence));
        }
        //console.log("EXIT");
    }
    getIndexTable(ID) {
        for (let i = 0; i < this.tables.length; i++) {
            if (ID === this.tables[i].ID) {
                return i;
            }
        }
    }
    getTableNameById(ID){
        if(ID){
            let table = this.findTableById(ID);
            if(table){
                return table.nom;
            }
        }
        return "Inconnu";
    }
    getTableById(ID){
        let index=this.getIndexTable(ID);
        return this.tables[index];
    }
    deleteTableByIndex(index) {
        if (index < this.tables.length) {
            this.tables.splice(index, 1);
        }
    }
    addTable() {
        let table = new Table();
        table.nom = "Table " + (this.tables.length + 1);
        this.tables.push(table);
    }
    deleteSequenceByIndex(index) {
        if (index < this.sequences.length) {
            this.sequences.splice(index, 1);
        }
    }
    dupliquerSequence(sequence){
        if(sequence){
            sequence=new Sequence(sequence);
            sequence.nom=sequence.nom+" (copie)"
            this.sequences.push(sequence);
        }
    }
    addSequence() {
        let sequence = new Sequence();
        sequence.nom = "Tirage " + (this.sequences.length + 1);
        this.sequences.push(sequence);
    }
    containsTable(iTable){
        for(const table of this.tables){
            if(iTable.ID===table.ID){
                return true;
            }
        }
        return false;
    }
    useTableInSequence(table){
        for(const sequence of this.sequences){
            if(sequence.useTable(table)){
                return true;
            }
        }
        return false;
    }
}

class ExportCollection extends Collection{
    constructor(content) {
        super(content);        
        for (const sequence of this.sequences) {
            if(sequence.items.length === 0){
                this["invalide"]=true;
                sequence["invalide"]=true;
                sequence["motif"]="emptyItemList"
                continue;
            }
            for (const item of sequence.items) {
                if(!item || item.references.length===0){
                    this["invalide"]=true;
                    sequence["invalide"]=true;
                    sequence["motif"]="refListVide"
                    break;
                }
                for (const reference of item.references) {
                    let table = this.findTableById(reference.ID);
                    if(!table || table.lignes.length===0 || (table.lignes.length===1 && table.lignes[-1]==="")){
                        this["invalide"]=true;
                        sequence["invalide"]=true;
                        sequence["motif"]="tableInvalide"
                        break;
                    }
                }
                if(sequence.invalide){
                    break;
                }
            }
            if(sequence.invalide){
                continue;
            }
        }
        for(const table of this.tables){
            if(table.isVide()){
                //this["invalide"]=true;
                table["invalide"]=true;
                table["motif"]="tableVide"; 
                continue;               
            }
            if(!this.useTableInSequence(table)){
                //this["invalide"]=true;
                table["invalide"]=true;
                table["motif"]="tableInutilisee";    
            }
        }
        
    }
    useTableInSequence(table){
        for(const sequence of this.sequences){
            if(!sequence.invalide && sequence.useTable(table)){
                return true;
            }
        }
        return false;
    }
    getExport(){
        let collection=new Collection();
        collection.nom = this.nom;
        collection.description=this.description;
        for(const table of this.tables){
            //if(!table.invalide){
                collection.importerTable(table);
            //}
        }
        for(const sequence of this.sequences){
            if(!sequence.invalide){
                collection.importerSequence(sequence);
            }
        }
        return collection;
    }
}

class Table {
    constructor(content) {
        this.nom = "";
        this.ID=this.createId();
        this.lignes = [];
        if (content) {
            this.nom = content.nom;
            this.ID = content.ID;
            this.lignes = [];
            for (const cLigne of content.lignes) {
                this.lignes.push(new Ligne(cLigne));
            }
        }
    }
    isVide(){
        if(this.lignes.length === 0){
            return true;
        }
        if(this.lignes.length === 1 && this.lignes[0].contenu===""){
            return true;
        }
        return false;
    }
    createId() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )}
    deleteLigne(iLigne){
        iLigne["delete"]=true;
        for(let i=0;i<this.lignes.length;i++){
            if(this.lignes[i].delete){
                this.lignes.splice(i,1);
                return;
            }
        }
    }
    deleteLigneByIndex(index) {
        if (index < this.lignes.length) {
            this.lignes.splice(index, 1);
        }
    }
    addLigne() {
        this.lignes.push(new Ligne(null))
    }
    getIndexLigne(iLigne){
        let index="getIndex-"+this.createId();
        iLigne[index]=true;
        for(let i=0;i<this.lignes.length;i++){
            if(this.lignes[i][index]){
                delete this.lignes[i].index;
                return i;
            }
        }
    }
    modificationLigne(iLigne){
        const currentContent = iLigne.contenu;

        if (currentContent.length === 0) {
            this.deleteLigne(iLigne);
        } else if (this.getIndexLigne(iLigne) === this.lignes.length - 1 && currentContent.length === 1) {
            this.addLigne();
        }
    }
}

class Ligne {
    constructor(content) {
        this.contenu = "";
        this.poids = "10";
        if (content) {
            this.contenu = content.contenu;
            this.poids = content.poids;
        }
    }
}

class Sequence {
    constructor(content) {
        this.nom = "";
        this.description = "";
        this.items = [];
        if (content) {
            this.nom = content.nom;
            this.description = content.description;
            for (const item of content.items) {
                this.items.push(new Item(item));
            }
        }
    }
    useTable(table){
        for(const item of this.items){
            if(item.useTable(table.ID)){
                return true;
            }
        }
        return false;
    }
    addItem(){
        this.items.push(new Item());
    }
    deleteItem(iItem){
        iItem["delete"]=true;
        for(let i=0;i<this.items.length;i++){
            if(this.items[i].delete){
                this.items.splice(i,1);
                return;
            }
        }
    }
}

class Item {
    constructor(content) {
        this.titre = "";
        this.references = [];
        if (content) {
            this.titre = content.titre;
            for (const ref of content.references) {
                this.references.push(new Reference(ref));
            }
        }
    }
    useTable(ID){
        for(const ref of this.references){
            if(ref.useTable(ID)){
                return true;
            }
        }
        return false;
    } 
    addRef(){
        this.references.push(new Reference());
    }
    deleteReference(ireference){
        ireference["delete"]=true;
        for(let i=0;i<this.references.length;i++){
            if(this.references[i].delete){
                this.references.splice(i,1);
                return;
            }
        }
    }
}

class Reference {
    constructor(content) {
        this.ID = "";
        this.min = 1;
        this.max = 1;
        this.poids = 10;
        if (content) {
            this.ID = content.ID;
            this.min = content.min;
            this.max = content.max;
            this.poids = content.poids;
        }
    }
    useTable(ID){
        
        return(ID===this.ID);
    }
}