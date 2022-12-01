import StorageService from "./storage_service.js";

export default class LocalStorageService extends StorageService {
    constructor(data, lookup, entity, entitySingle, options = {}) {
        super(data, lookup, entity, entitySingle, options);

        // this.retrieve();
    }
    get lookups() {
        return super.lookups;
    }
    get data() {
        return super.data;
    }
    set data(data) {
        super.data = data;
    }
    get entitySingle() {
        return super.entitySingle;
    }
    get entity() {
        return super.entity;
    }
    get sortCol() {
        return super.sortCol;
    }
    set sortCol(col) {
        super.sortCol = col;
        this.store();
    }
    get sortDir() {
        return super.sortDir;
    }
    set sortDir(dir) {
        super.sortDir = dir;
        this.store();
    }
    get filterStr() {
        return super.filterStr;
    }
    set filterStr(filterStr) {
        super.filterStr = filterStr;
        this.store();
    }
    get filterCol() {
        return super.filterCol;
    }
    set filterCol(filterCol) {
        super.filterCol = filterCol;
        this.store();
    }
    get limit() {
        return super.limit;
    }
    set limit(limit) {
        super.limit = limit;
        this.store();
    }
    get offset() {
        return super.offset;
    }
    set options(opt) {
        super.options = opt;
        this.store();
    }

    get size() {
        return this.data.length;
    }
    //CRUD FUNCTIONS

    async list() {
        this.sort(this.sortCol, this.sortDir, true);
        let filterObj = {};

        if (this.filterStr) {
            filterObj[this.sortCol] = this.filterStr;
            return this.filter(filterObj);
        }

        return this.data;
    }

    async create(obj) {
        this.data.push(obj);
        this.store();
    }
    async read(getId) {
        let data = this.data.find(element => element.id == getId);

        if (data === undefined)
            return null;
        else
            return data;
    }
    async update(id, obj) {
        if (id == null) {
            obj.id = this.data.at(-1).id + 1;
            this.data.push(obj);
            this.store();
        } else {
            let index = this.getItemIndex(id);
            if (index != -1) {
                this.data[index] = obj;
                this.store();
            }
        }

    }

    async delete(removeId) {
        let index = this.getItemIndex(removeId);
        this.data.splice(index, 1)

        this.store();
    }

    //LocalStorage Functions
    async reset() {
        this.model = this.utils.cloneObject(this.origModel);
        this.clear();
    }
    async clear() {
        localStorage.removeItem(this.entity);
        localStorage.clear();
    }
    store() {
        localStorage[this.entity] = JSON.stringify(this.model);
    }
    // retrieve() {
    //     if (localStorage.getItem(this.entity) !== null) {
    //         this.model = JSON.parse(localStorage[this.entity]);
    //         return true;
    //     }
    //     return false;
    // }

    //Sorting and Filtering Functions
    sort(col, direction, perm = true) {
        let copy = this.utils.cloneObject(this.data);
        let sorted = copy.sort((a, b) => {
            if (a[col] == b[col])
                return 0;
            if (a[col] < b[col]) {
                return direction == "asc" ? -1 : 1;
            }
            if (a[col] > b[col]) {
                return direction == "asc" ? 1 : -1;
            }

        });
        if (perm) {
            this.data = sorted;
            this.sortCol = col;
            this.sortDir = direction;

            this.store();
        }
        return sorted;
    }

    filter(filterObj) {
        function filterFunc(team) {
            for (let entity in filterObj) {
                if (!team[entity].toLowerCase().includes(filterObj[entity].toLowerCase())) {
                    return false;
                }
            }
            return true;
        }
        let result = this.data.filter(filterFunc);
        return this.utils.cloneObject(result);
    }

    //Utility functions
    getItemIndex(id) {
        return this.data.findIndex(element => element.id == id);
    }

}