import Utils from '../util/utilities.js'
export default class View {
    constructor(storage, viewModel) {
        this.storage = storage;
        this.viewModel = viewModel;
        this.utils = new Utils();
        this.data = null;
    }
    get $alertContainer() {
        return $("#" + this.viewModel.alertContainerId);
    }
    get wrapperTemplateUrl() {
        return this.viewModel.wrapperTemplateUrl;
    }
    get hasWrapper() {
        return this.viewModel.wrapperTemplateUrl;
    }
    get $wrapperContainer() {
        return $("#" + this.viewModel.wrapperContainerId);
    }
    get $container() {
        return $("#" + this.viewModel.containerId);
    }
    get templateUrl() {
        return this.viewModel.templateUrl;
    }

    async render() {
        this.renderWrapper().then(() => {
            this.renderItem();
        });
    }
    async renderTemplate($container, templateUrl, viewData) {
        //hide the container
        // $container.empty().hide()

        let templateHtml = await this.getFileContents(templateUrl)
        $container.html(ejs.render(templateHtml, viewData))

        //show the container
        $container.show()
    }
    async renderWrapper() {
        await this.renderTemplate(this.$wrapperContainer, this.wrapperTemplateUrl, {viewModel: this.viewModel});
        this.bindWrapperEvents()
    }
    async renderItem() {
        
        // this.$listContainer.empty();
        // this.data = await this.storage.list();
        // if (!this.listTemplateHtml.length > 0) {
        //     this.listTemplateHtml = await this.getFileContents(this.listTemplateUrl);
        // }
        // this.$listContainer.html(ejs.render(this.listTemplateHtml, { view: this, data: this.data }));
        // this.$headerIcon.show();    //show header icon for current sort col and direction (see getter)
        // this.bindListEvents(this.data);

        let viewData =  await this.getViewData();
        await this.renderTemplate(this.$container, this.templateUrl, {viewModel: this.viewModel, that: this, view: viewData});
        
        this.bindItemEvents()
    }

    async getViewData() {
        throw new Error("must implement getViewData in sub class!")
    }
    async reset() {
        await this.storage.reset();
        await this.render();
    }
    async bindItemEvents() {
        throw new Error("must implement bindItemEvents in sub class!")
    }
    async bindWrapperEvents() {
        throw new Error("must implement bindWrapperEvents in sub class!")
    }
    /*readCachedItem()
    special function I added to get the currently cached item instead of reading it anew
    this will be more important later when we are reading from an API.  I don't want to go all the
    way out to the internet to get a value that is sitting in memory.
    I use it when rendering the popover and delete modal when the latest information is not really needed
    */
    readCachedItem(id) {
        return this.storage.getItem(id);
    }
    async getFileContents(url) {
        return await $.get(url);

    }
}