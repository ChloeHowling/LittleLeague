import RestStorageService from '../models/rest_storage_service.js'
import ListView from '../views/list_view.js'
import GenericView from '../views/generic_view.js'
import Router from '../routers/router.js'

export default class AppController {
    constructor(appViewModel) {
        this.appViewModel = appViewModel;
        this.router = new Router(window, appViewModel.routes, appViewModel.navContainerId, appViewModel.navTemplateUrl)

        $("body").on("loadView", (event, route) => {
            this.loadView(route);
        })   
    }
    get $containerId() {
        return $(`#${this.appViewModel.containerId}`)
    }
    loadView(route) {
        this.$containerId.empty();
        switch (route.viewType) {
            case "generic":
                this._view = new GenericView(route.viewModel)
                break;
            case "list":
                let restStorageService = new RestStorageService(
                    route.viewModel.entity, 
                    route.viewModel.entitySingle, 
                    route.viewModel.list.options, 
                    this.appViewModel.endPoint
                );
                this._view = new ListView(restStorageService, route.viewModel)
                break;
        }
        this.view.render()
    }

    get view() {
        return this._view;
    }
}