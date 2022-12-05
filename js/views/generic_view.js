import View from "./view.js"

export default class GenericView extends View {
    constructor(viewModel) {
        super(null, viewModel["list"]);
        this.entityViewModel = viewModel;
    }
    async render() {
        const temHtml = await this.utils.getFileContents(this.templateUrl);
        this.$container.html(ejs.render(temHtml, { viewModel: this.viewModel }));
    }
}