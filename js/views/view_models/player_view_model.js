var playerViewModel = {
    entity: "players",
    entitiySingle: "player",

    navId: "players_nav",
    data: "",
    list: {
        deleteModalContainerId: "deleteConfirmation",
        editModalContainerId: "editModal",
        alertContainerId: "alertContainer",
        wrapperContainerId: "app_container",
        wrapperTemplateUrl: "js/views/partials/list_page_wrapper.ejs",
        templateUrl: "js/views/partials/list_view.ejs",
        containerId: "tableContainer",
        // new properties ---
        searchInputId: "searchInput",
        resetButtonId: "resetView",
        newButtonId: "newButton",
        deleteButtonId: "yesButton",
        clearSearchButtonId: "clearSearch",
        options: {                 //default options sent to LocalStorageService
            sortCol: "first_name",
            sortDir: "asc",
            limit: "",
            offset: "",
            filterCol: "",
            filterStr: ""
        },
        listTitle: "Impact Players",

        id: "my-list",
        tableClasses: "table table-dark table-hover mt-2",   //classes for table tag
        // thClasses:"bg-black bg-gradient",                    //classes for my th tags (you may not need)

        logoCol: "playerPhoto",                                //what data column holds the path to the team logo (if used in your code)
        nameCol: "first_name",
        enablePopovers: true,
        columns: [
            {
                label: "First Name",
                name: "first_name",
                popover: "true"            //true if you want to show in popover
            },
            {
                label:"Last Name",
                name: "last_name",
                popover: "true"
            },
            {
                label: "Role",
                name: "person_type",
                popover: "true"
            },
            {
                label: "Email",
                name: "email",
                popover: "true"
            },
            {
                label: "State",
                name: "state",
                popover: "true"
            }
        ]
    },
    form: {
        id: "player-form",
        wrapperContainerId: "",
        wrapperTemplateUrl: "",

        templateUrl: "js/views/partials/form_view.ejs",
        containerId: "formContainer",

        addFormTitle: "Add Player",
        editFormTitle: "Edit Player",

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
                label: "First name",
                name: "first_name",
                tag: "input",
                defaultValue: "",
                attributes: {
                    type: "text",
                    placeholder: "John",
                    class: "form-control"
                },
                validation: {
                    required: true,
                    requiredMessage: "First name is required"
                }
            },
            {
                label: "Last name",
                name: "last_name",
                tag: "input",
                defaultValue: "",
                attributes: {
                    type: "text",
                    placeholder: "Doe",
                    class: "form-control"
                },
                validation: {
                    required: true,
                    requiredMessage: "Last name is required"
                }
            },
            {
                label: "Role",
                name: "person_type",
                tag: "select",
                attributes: {
                    class: "form-control"
                },
                validation: {
                    required: true
                },
                lookupName: "person_type"
            },
            {
                label: "Phone",
                name: "phone",
                tag: "input",
                defaultValue:"",
                attributes: {
                    type: "text",
                    placeholder: "801-577-5827",
                    //pattern will allow you to customize your validation.
                    pattern: '[\+]?[1 ]?[-]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}',
                    //use the title tag to explain the format required
                    title: 'Phone Number (Format: +1 (999)999-9999)',
                    class: "form-control"
                },
                validation: {
                    required: true,
                    requiredMessage: "Phone is required"
                }
            },
            {
                label: "Email",
                name: "email",
                tag: "input",
                defaultValue:"",
                attributes: {
                    type: "email",
                    placeholder: "player@gmail.com",
                    class: "form-control"
                },
                validation: {
                    required: true,
                    requiredMessage: "Email is required"
                }
            },
            {
                label: "State",
                name: "state",
                tag: "input",
                defaultValue: "",
                attributes: {
                    type: "text",
                    placeholder: "UT",
                    class: "form-control"
                },
                validation: {
                    required: false
                }

            },
        ]
    },
    lookups: {
        coach: {
            label: "role",
            lookupName: "person_type",
            tag: "select",
            defaultValue: "-1",
            attributes: {
                id: "id",
                name: "person_type",
                placeholder: "Select a role"
            },
            validation: {
                required: true,
                requireMessage: "role required"
            }
        },
    }
}
export default playerViewModel;