import LocalStorageService from '../models/local_storage_service.js'
import ListView from '../views/list_view.js'

export default class AppController
{
    constructor(appViewModel) {
        this.appViewModel = appViewModel;
        // TODO: change parameters for LocalStorageService initializer)
        this.storageService = new LocalStorageService(this.data, this.entity, this.entitySingle, this.list.options);
        // this._view = new ListPageView(this.storageService, this.listViewModel)
        
        this.view = new ListView(this.storageService, this.appViewModel.viewModel)
    }
    get data() {return this.appViewModel.viewModel.data;}
    get entity() {return this.appViewModel.viewModel.entity;}
    get entitySingle() {return this.appViewModel.viewModel.entitySingle}

    get list() {return this.appViewModel.viewModel.list;}
    // get listViewModel() {return this.appViewModel.viewModel;}

    // get view() {
    //     return this._view;
    // }
    async reset() {
        await this.view.reset();
    }
    async render() {
        await this.view.render();
    }
}