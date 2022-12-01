import LocalStorageService from '../models/local_storage_service.js'
import RestStorageService from '../models/rest_storage_service.js';
import ListView from '../views/list_view.js'

export default class AppController
{
    constructor(appViewModel) {
        this.appViewModel = appViewModel;
        // TODO: change parameters for LocalStorageService initializer)
        this.localStorageService = new LocalStorageService(this.data, this.lookups, this.entity, this.entitySingle, this.list.options);
        // this._view = new ListPageView(this.storageService, this.listViewModel)
        this.restStorageService = new RestStorageService(this.entity, this.entitySingle, this.list.options, this.appViewModel.endPoint);

        this._view = new ListView(this.restStorageService, this.appViewModel.viewModel)
    }
    get data() {return this.appViewModel.viewModel.data;}
    get lookups() {return this.appViewModel.viewModel.lookups;}
    get entity() {return this.appViewModel.viewModel.entity;}
    get entitySingle() {return this.appViewModel.viewModel.entitySingle;}

    get list() {return this.appViewModel.viewModel.list;}
    get listViewModel() {return this.appViewModel.viewModel;}

    get view() {
        return this._view;
    }
    async reset() {
        await this._view.reset();
    }
    async render() {
        await this._view.render();
    }
}