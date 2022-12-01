export default class Utilities {
    constructor() {
        this.files={}
    }
    async getFileContents(url) {
        if (!(url in this.files)) {
            this.files[url] = await $.get(url);
        }
        return this.files[url]
    }
    cloneObject(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    getQueryString(options = this.options) {
        return "?" + Object.keys(options).map(key => {
            return `${key}=${encodeURIComponent(options[key])}`;
        }).join('&');
    }
}