import Utils from '../util/utilities.js'

export default class Router {
    constructor(window, routes, containerId, templateUrl) {
        this._window = window;
        this._routes = routes;
        this.templateUrl = templateUrl;
        this.containerId = containerId;
        this.utils = new Utils();
        (async () => {
            await this.init();
        })();
    }
    get routes() {
        return this._routes;
    }
    get defaultRoute() {
        return this._routes.find(r => r.isDefaultView);
    }
    get curRoute() {
        return this.routes.find(element => element.name == window.location.hash);
    }
    get $container() {
        return $(`#${this.containerId}`);
    }
    async init() {
        await this.render();
        

        window.addEventListener('hashchange', (event)=> {
            this.loadHash(this.curRoute);
        });
        this.setDefaultHash();

        this.loadHash(this.curRoute);
    }
    setDefaultHash() {
        let curRoute = this.defaultRoute;
        window.location.hash = curRoute.name;
    }
    loadHash(route) {
        $(".nav-link").removeClass("active");
        $(`#${route.viewModel.navId}`).addClass("active");
        $("body").trigger("loadView", route);
    }
    async render() {
        let navHtml = await this.utils.getFileContents(this.templateUrl)
        this.$container.html(ejs.render(navHtml, {}))
        this.$container.show()
    }
}