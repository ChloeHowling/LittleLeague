import teamData from '../../models/data/team_data.js'
var teamViewModel = {
    entity: "teams",
    entitySingle: "team",

    data: teamData,
    list: {
        deleteModalContainerId: "deleteConfirmation",
        editModalContainerId:"editModal",
        alertContainerId: "alertContainer",
        wrapperContainerId: "teamPageWrapper",
        wrapperTemplateUrl: "js/views/partials/list_page_wrapper.ejs",
        templateUrl: "js/views/partials/list_view.ejs",
        containerId: "tableContainer",
        // new properties ---
        searchInputId: "searchInput",
        resetButtonId: "resetView",
        newButtonId: "newButton",
        deleteButtonId:"yesButton",
        clearSearchButtonId: "clearSearch",
        options: {                 //default options sent to LocalStorageService
            sortCol: "name",
            sortDir: "asc",
            limit: "",
            offset: "",
            filterCol: "",
            filterStr: ""
        },
        listTitle: "Impact Teams",

        id: "my-list",
        tableClasses: "table table-dark table-hover mt-2",   //classes for table tag
        // thClasses:"bg-black bg-gradient",                    //classes for my th tags (you may not need)

        logoCol: "teamPhoto",                                //what data column holds the path to the team logo (if used in your code)
        nameCol: "name",                                     //what data column do we use to display the item 'name'
        /*Columns to be displayed in your bootstrap table.  I used 'popover=true' to indicate I wanted to include that colum in my popover.
        This allowed me to keep my code 'generic'*/
        enablePopovers: true,
        columns: [
            {
                label: "Team Name",
                name: "name",
                popover: "true"            //true if you want to show in popover
            },
            {
                label: "Coach Name",
                name: "coachName",
                popover: "true"
            },
            {
                label: "Coach Email",
                name: "coachEmail",
                popover: "true"
            },
            {
                label: "Coach Phone",
                name: "coachPhone",
                popover: "true"
            }
        ]
    },
    form: {
        id: "team-form",
        wrapperContainerId: "",
        wrapperTemplateUrl: "",

        templateUrl: "js/views/partials/form_view.ejs",
        containerId: "formContainer",

        addFormTitle: "Add Team",
        editFormTitle: "Edit Team",

        actionUrl: "",
        method: "POST",

        fields: [
            {
                label: "id",
                name: "id",
                tag: "input",
                defaultValue: "",
                attributes: {
                    type: "hidden",
                },
                validation: {
                    required: false,
                }
            },
            {
                label: "Team Name",
                name: "name",
                tag: "input",
                defaultValue: "",
                attributes: {
                    type: "text",
                    placeholder: "Enter your team name here",
                    class: "form-control"
                },
                validation: {
                    required: true,
                    requiredMessage: "Team Name is required"
                }
            },
            {
                label: "Coach Name",
                name: "coachName",
                tag: "input",
                defaultValue: "",
                attributes: {
                    type: "text",
                    placeholder: "CoachName",
                    class: "form-control"
                },
                validation: {
                    required: true
                }
            },
            {
                label: "Coach Phone",
                name: "coachPhone",
                tag: "input",
                defaultValue:"",
                attributes: {
                    type: "text",
                    placeholder: "Coach phone",
                    //pattern will allow you to customize your validation.
                    pattern: '[\+]?[1 ]?[-]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}',
                    //use the title tag to explain the format required
                    title: 'Phone Number (Format: +1 (999)999-9999)',
                    class: "form-control"
                },
                validation: {
                    required: true,
                    requiredMessage: "Coach Phone is required"
                }
            },
            {
                label: "Coach Email",
                name: "coachEmail",
                tag: "input",
                defaultValue:"",
                attributes: {
                    type: "email",
                    placeholder: "Coach Email",
                    class: "form-control"
                },
                validation: {
                    required: true,
                    requiredMessage: "Coach Email is required"
                }
            },
            {
                label: "Team Notes",
                name:"notes",
                tag: "input",
                defaultValue:"",
                attributes: {
                    type: "text",
                    placeholder: "Enter your Team notes here",
                    class: "form-control"
                },
                validation: {
                    required: false
                }
                
            } 
        ]
    }
}
export default teamViewModel;