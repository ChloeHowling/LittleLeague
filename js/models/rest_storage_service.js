import StorageService from "./storage_service.js";

export default class RestStorageService extends StorageService {
    constructor(entity, entitySingle, options = {}, host) {
        super(null, null, entity, entitySingle, options);
        this.host = host;
    }

    get apiName() {
        return this.entity;
    }
    get hostPrefix() {
        return `http://${this.host}`;
    }
    get apiUrl() {
        return `${this.hostPrefix}/${this.apiName}`;
    }

    async list(options = this.model.options) {
        let url = `${this.apiUrl}/${this.utils.getQueryString(options)}`;

        try {
            const response = await fetch(url);
            this.model.data = await response.json();

            return this.model.data;
        }
        catch (err) {
            console.log(err);
            throw (err);
        }
    }
    async create(obj) {
        let url = `${this.apiUrl}/`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj),
            });
            let data = await response.json();
            console.log(data);
            return data;
        } catch (err) {
            console.log(err);
            throw (err);
        }
    }
    async update(id, obj) {
        let url = `${this.apiUrl}/${id}`;
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj),
            });
            let data = await response.json();
            console.log(data);
            return data;
        } catch (err) {
            console.log(err);
            throw (err);
        }
    }
    async read(getId) {
        let url = `${this.apiUrl}/${getId}`;
        try {
            const response = await fetch(url);
            let data = await response.json();

            // this.getItem(getId) = data;
            return data;

        } catch (err) {
            console.log(err);
            throw (err);
        }
    }
    async delete(removeId) {
        if (removeId == null || removeId == "") {
            throw ("Removing all elements is not allowed.");
        }

        let url = `${this.apiUrl}/${removeId}`;
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });
            let resJson = await response.json();
            console.log(resJson);
            return resJson;
        } catch (err) {
            console.log(err);
            throw (err);
        }
    }
    async getLookup(lookupName) {
        if (lookupName in this.lookups) {
            return this.lookups[lookupName];
        }
        let url = `${this.hostPrefix}/lookups/${lookupName}`;
        try {
            const response = await fetch(url);
            this.lookups[lookupName] = await response.json();
        } catch (err) {
            console.log(err);
            throw(err);
        }
    }
}   