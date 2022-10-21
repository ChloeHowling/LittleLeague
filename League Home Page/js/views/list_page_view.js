/*ListPageView Class implementation
Find the 'TODO' tags inline and write the code for those functions.
I will walk through implementation in class and provide recordings.  Try NOT to copy the code from the recordings.  Try to do it yourself first.  
That will be much better practice.  LMS3 will require you to repeat these patterns yourself for the Forms module.
Whatever you do, do not copy and paste!  Type all of the code manually into your LMS1 project.
*/

class ListPageView {
    constructor(storageService, viewModel) {
        this.storage = storageService;
        this.viewModel = viewModel;
        this.listTemplateHtml = "";
        this.wrapperTemplateHtml = "";
        this.searchWaiter = null;   //used to hold timeout instance for search
    }
    /* GETTERS AND SETTERS */
    get list() {
        return this.viewModel.list;
    }

    get view() { return this.viewModel; }                 //get viewModel as 'view'

    get wrapperTemplateUrl() { return this.view.wrapperTemplateUrl; }
    get $wrapperContainer() { return $("#" + this.view.wrapperContainerId); }

    get $listContainer() { return $("#" + this.view.listContainerId); }
    get listTemplateUrl() { return this.view.listTemplateUrl; }

    get columns() { return this.view.list.columns; }       //get columns needed for table

    get $alertContainer() { return $("#" + this.view.alertContainerId); }   //get jquery wrapped alert container for displaying alerts
    get $modal() { return $("#" + this.view.modalContainerId); }           //get jquery wrapped modal container
    //used to get a reference to the header icon associated with current sort col and direction, example column html is below
    // <th class="thead sortable bg-black bg-gradient" data-name="name"> Team Name 
    //     <i id="name-asc" class="fa fa-arrow-up" aria-hidden="true" style="display:none"></i> 
    //     <i id="name-desc" class="fa fa-arrow-down" aria-hidden="true" style="display:none"></i>
    //</th>
    get $headerIcon() { return $(`#${this.storage.sortCol}-${this.storage.sortDir}`) }

    reset() {
        this.storage.reset();
        this.render();
    }
    async render() {
        // promise version for reference
        //  this.renderWrapper()
        //     .then(()=>{
        //         this.renderList();  
        //     })

        await this.renderWrapper();
        await this.renderList();
    }

    async renderWrapper() {
        this.$wrapperContainer.empty();
        if (!this.wrapperTemplateHtml.length > 0) {
            this.wrapperTemplateHtml = await this.getFileContents(this.wrapperTemplateUrl);
        }
        this.$wrapperContainer.html(ejs.render(this.wrapperTemplateHtml, { view: this.viewModel }));

        //bind events for Search, ClearSearch and ResetView 
        await this.bindWrapperEvents();
    }
    async renderList() {
        this.$listContainer.empty();
        this.data = await this.storage.list();

        if (!this.listTemplateHtml.length > 0) {
            this.listTemplateHtml = await this.getFileContents(this.listTemplateUrl);
        }
        this.$listContainer.html(ejs.render(this.listTemplateHtml, { view: this, data: this.data }));

        this.$headerIcon.show();    //show header icon for current sort col and direction (see getter)

        this.bindListEvents(this.data);
    }

    bindListEvents(data) {
        $(".sortable").click((e) => {
            let sortCal = $(e.target).attr("data-name");
            this.storage.sortCol = sortCal;

            if(this.storage.sortDir == "asc") {
                this.storage.sortDir = "desc";
            } else {
                this.storage.sortDir = "asc";
            }
            this.renderList();
        });
        //TODO, setup click handlers for the columns for sorting ascending and descending
        //see the th below and you will see that each th has a 'data-name' attribute.  
        //Each '<i>' tag has an id made up of a sort col and sort direction, separated by a dash.  That's how we easily target the current icon for display
        // <th class="thead sortable bg-black bg-gradient" data-name="name"> Team Name 
        //     <i id="name-asc" class="fa fa-arrow-up" aria-hidden="true" style="display:none"></i> 
        //     <i id="name-desc" class="fa fa-arrow-down" aria-hidden="true" style="display:none"></i>
        //</th>
        //the click handler for each column should determine the correct sortCol and sortDir and then set the sortCol on the storage instance
        //use jquery show/hide to hide or show the correct <i> tag above based on the current sortCol and sortDir in the storage instance
        //then call renderList() when done

        //initialize your popover code
        this.initPopover();
    }
    async bindWrapperEvents() {

        let $myModal = $("#deleteConfirmation");

        $myModal.on("show.bs.modal", function (ev) {  //fired when modal is about to be shown


            var button = ev.relatedTarget;
            // Extract info from data-bs-* attributes
            //var teamId = button.getAttribute('data-id')
            var teamId = $(button).attr("data-id");
            var teamName = button.getAttribute('data-name');

            var $modalTitle = $('.modal-title');

            $modalTitle.text(`Delete ${teamName}?`);
            $myModal.attr("data-id", teamId);
            $myModal.attr("data-name", teamName);
        });



        $("#yesButton").click((e) => {    //fired when 'Yes' button is clicked
            let itemName = $myModal.attr("data-name");    //get item name and id from modal attribute set in show.bs.modal event
            let itemId = $myModal.attr("data-id");

            this.addAlert(itemName);   //insert an alert in 'alertContainer'

            //TODO, call deleteListItem using Promise pattern.  When promise fulfilled, call renderList
            this.deleteListItem(itemId).then(this.renderList().then());
        })


        //'#resetView' button
        //'#searchInput button   NOTE: use the event called 'input' to trigger your search / REQUIRED
        //    this should grab the search value,  set this.storage.filterStr and re-render the list
        //'#clearSearch' button, this should clear search input, clear this.storage.filterStr, and rerender the list
        //IMPORTANT:  Since we rerender the list when we 'reset' you need to make sure that you turn off previously attached events
        //e.g.,   $('#resetView').off("click");
        $('#resetView').on("click", (e) => {
            this.reset();
        });
        $('#searchInput').on("input", (e) => {

            this.searchVal = $(e.target).val();
            this.runSearch();
        });

        // console.log("searchInput Event created");
        $('#clearSearch').off("click").on("click", (e) => {
            $('#searchInput').val("");
            this.storage.filterStr = "";
            this.renderList();
        });
    }

    addAlert(teamName) {
        let alertHtml = `<div id="deleteAlert" class="alert alert-warning alert-dismissible fade show" role="alert">
                          <strong>You deleted Team: ${teamName} </span>
                          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                          </div>`;
        $("#alertContainer").html(alertHtml);
    }
    runSearch() {
        clearTimeout(this.searchWaiter);
        this.searchWaiter = setTimeout(() => {
            if (this.searchVal.length > 1) {
                this.storage.filterStr = this.searchVal;
                this.storage.filterCol = this.storage.sortCol;
                this.renderList();

            }
        }, 250);
    }
    async deleteListItem(id) {
        await this.storage.delete(id);
        await this.renderList();
    }
    initPopover() {
        //integrate your popover code.  You can use mine below for reference.
        let that = this;
        $('[data-bs-toggle="popover"]').popover({
            html: true,
            trigger: 'hover',
            title: function () {
                var index = $(this).attr("data-id");      //get data-id from current TR
                let item = that.data[that.storage.getItemIndex(index)];    //grab the current object from your data
                //return image using the image path in the logoCol (from view model) attribute on the data, output name using nameCol
                return `<img class="img-fluid rounded-circle" src="${item[that.view.list.logoCol]}" width="40" height="40">  ${item[that.view.list.nameCol]} `;
            },
            content: function () {
                var index = $(this).attr("data-id");
                let item = that.data[that.storage.getItemIndex(index)];
                let htmlContent = "";
                //using the 'columns' array in the view model, output the column data where popover=true
                that.columns.forEach((col, idx) => {
                    if (col.popover)
                        htmlContent += `<p>${col.label}: ${item[col.name]}</p>`;
                })
                return htmlContent;
            }
        });
    }
    async getFileContents(url) {
        return await $.get(url);

    }
}