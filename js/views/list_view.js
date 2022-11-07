import View from "./view.js";
import FormView from "./form_view.js";

export default class ListView extends View {
    constructor(storageService, viewModel) {
        super(storageService, viewModel["list"])
        this.entityViewModel = viewModel;
    }
    /* GETTERS AND SETTERS */
    get columns() {
        return this.viewModel.columns;
    }
    get $searchInput() {
        return $("#" + this.viewModel.searchInputId);
    }
    get $clearSearchButton() {
        return $("#" + this.viewModel.clearSearchButtonId);
    }
    get $newButton() {
        return $("#" + this.viewModel.newButtonId);
    }
    get $resetButton() {
        return $("#" + this.viewModel.resetButtonId);
    }
    get $deleteModal() {
        return $("#" + this.viewModel.deleteModalContainerId);
    }
    get $deleteButton() {
        return $("#" + this.viewModel.deleteButtonId);
    }
    get $editModal() {
        return $("#" + this.viewModel.editModalContainerId);
    }
    get $headerIcon() {
        return $(`#${this.storage.sortCol}-${this.storage.sortDir}`);
    }
    get popoversEnabled() {
        return this.viewModel.enablePopovers;
    }
    get formView() {return this._formView;}
    get entityName() {
        let str = this.entityViewModel.entitySingle;
        return str[0].toUpperCase() + str.substring(1);
    }
    async getViewData() {
        return await this.storage.list();
    }

    async editItem(itemId) {
        // storageService, viewModel, parentView
        let formView = new FormView(this.storage, this.entityViewModel, this);
        formView.currentItemId = itemId;
        formView.renderItem(); 
    }

    async createItem() {
        this.editItem(null);
    }

    async bindItemEvents(data) {
        $(".sortable").click((e) => {
            let sortCol = $(e.target).attr("data-name");
            this.storage.sortCol = sortCol;

            if (this.storage.sortDir == "asc") {
                this.storage.sortDir = "desc";
            } else {
                this.storage.sortDir = "asc";
            }
            this.renderItem();
        });

        this.$editModal.on("show.bs.modal", (ev) => {
            var teamId = $(ev.relatedTarget).attr("data-id");
            this.editItem(teamId);
        });

        $("#submitButton").click((e) => {
            // TODO save stuff from form to storage
        })

        this.initPopover();
    }
    async bindWrapperEvents() {
        this.$deleteModal.on("show.bs.modal", (ev) => {  //fired when modal is about to be shown
            var button = ev.relatedTarget;
            var teamId = $(button).attr("data-id");
            var teamName = button.getAttribute('data-name');

            var $modalTitle = $('.modal-title');

            $modalTitle.text(`Delete ${teamName}?`);
            this.$deleteModal.attr("data-id", teamId);
            this.$deleteModal.attr("data-name", teamName);
        });

        this.$deleteButton.click((e) => { 
            let itemName = this.$deleteModal.attr("data-name"); 
            let itemId = this.$deleteModal.attr("data-id");

            this.addAlert(itemName);
            this.deleteListItem(itemId).then(this.renderItem().then());
        });

        this.$resetButton.click((e) => {
            this.reset();
        });

        this.$searchInput.on("input", (e) => {
            this.searchVal = $(e.target).val();
            this.runSearch();
        });

        this.$clearSearchButton.off("click").on("click", (e) => {
            this.clearSearch();
        });
        
        this.$newButton.click((e) => {
            this.createItem();
        });
    }

    closeEditModal() {
        this.$editModal.modal("hide");
    }

    clearSearch() {
        $('#searchInput').val("");
        this.storage.filterStr = "";
        this.renderItem();
    }

    runSearch() {
        clearTimeout(this.searchWaiter);
        this.searchWaiter = setTimeout(() => {
            if (this.searchVal.length > 1 || this.searchVal.length == 0) {
                this.storage.filterStr = this.searchVal;
                this.storage.filterCol = this.storage.sortCol;
                this.renderItem();

            }
        }, 250);
    }

    addAlert(teamName) {
        let alertHtml = `<div id="deleteAlert" class="alert alert-warning alert-dismissible fade show" role="alert">
                          <strong>You deleted Team: ${teamName} </strong>
                          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                          </div>`;
        $("#alertContainer").html(alertHtml);
    }

    async deleteListItem(id) {
        await this.storage.delete(id);
        await this.renderItem();
    }
    renderPopoverTitle(itemId) {
        let item = this.storage.read(itemId);    //grab the current object from your data
        //return image using the image path in the logoCol (from view model) attribute on the data, output name using nameCol
        return `<img class="img-fluid rounded-circle" src="${item[this.viewModel.logoCol]}" width="40" height="40">  ${item[this.viewModel.nameCol]} `;
    }
    renderPopoverBody(itemId) {
        let item = this.storage.read(itemId);
        let htmlContent = "";
        //using the 'columns' array in the view model, output the column data where popover=true
        this.columns.forEach((col, idx) => {
            if (col.popover)
                htmlContent += `<p>${col.label}: ${item[col.name]}</p>`;
        })
        return htmlContent;
    }
    initPopover() {
        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
        var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
            setTimeout(function(){}, 1000);
            return new bootstrap.Popover(popoverTriggerEl)
            })
        let that = this;
        $(function () {
            $('[data-bs-toggle="popover"]').popover({
                html: true,
                trigger: 'hover',
                title: () => {that.renderPopoverTitle($(this).attr("data-id"))},
                content: () => {that.renderPopoverBody($(this).attr("data-id"))}
            })
        })
    }
}