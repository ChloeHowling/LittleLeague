import Utils from '../util/utilities.js'
export default class StorageService {
    "use strict"
    constructor(data, lookups, entity, entitySingle, options={}) {

        this._entity = entity;
        this._entitySingle = entitySingle;
        this.utils = new Utils();

        this.model = {};
        this.options = options;
        this.model.data = data || [];
        this.model.lookups = lookups || {};
        this.origModel = this.utils.cloneObject(this.model);
    }

    get lookups() {
        return this.model.lookups;
    }
    get data() {
        return this.model.data;
    }
    set data(data) {
        this.model.data = data;
    }
    get entitySingle() {
        return this._entitySingle;
    }
    get entity() {
        return this._entity;
    }
    get sortCol() {
        return this.model.options.sortCol;
    }
    set sortCol(col) {
        this.model.options.sortCol = col;
    }
    get sortDir() {
        return this.model.options.sortDir;
    }
    set sortDir(dir) {
        this.model.options.sortDir = dir;
    }
    get filterStr() {
        return this.model.options.filterStr;
    }
    set filterStr(filterStr) {
        this.model.options.filterStr = filterStr;
    }
    get filterCol() {
        return this.model.options.filterCol;
    }
    set filterCol(filterCol) {
        this.model.options.filterCol = filterCol;
    }
    get limit() {
        return this.model.options.limit;
    }
    set limit(limit) {
        this.model.options.limit = limit;
    }
    get offset() {
        return this.model.options.offset;
    }
    set options(opt) {
        this.model.options = {
            sortCol: null,
            sortDir: "asc",
            filterCol: "",
            filterStr: "",
            limit: 100,
            offset: null
        };
        this.model.options = Object.assign(this.model.options, opt);
    }
    async list() {
        throw new Error("list() not implemented.");
    }
    async create(obj) {
        throw new Error("create(obj) not implemented.");
    }
    async read(getId) {
        throw new Error("read(getId) not implemented.");
    }
    async update(id, obj) {
        throw new Error("update(id, obj) not implemented.");
    }
    async delete(removeId) {
        throw new Error("delete(removeId) not implemented.");
    }
    async reset() {
        throw new Error("reset() not implemented.");
    }
    async getLookup(lookupName) {
        throw new Error("getLookup(lookupName) not implemented.");
    }
    getItem(id) {
        return this.data.find(element => element.id == id);
    }
    lookup(lookupName) {
        return this.lookups[lookupName];
    }
}