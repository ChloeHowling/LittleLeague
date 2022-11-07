import View from "./view.js";

export default class FormView extends View {
    constructor(storageService, viewModel, parentView) {
        super(storageService, viewModel["form"]) 
        this.entityViewModel = viewModel;
        this.currentItemId = null;

        this.parentView = parentView;
        this.formChanged = false;
    }

    get fields() {
        return this.viewModel.fields;
    }
    get formId() {
        return this.viewModel.id;
    }
    get $form() {
        return $('#' + this.formId);
    }
    get form() {
        return this.$form.get(0);
    }
    get formValid() {
        return this.form.checkValidity();
    }
    get $inputs() {
        return $('#' + this.formId + " :input");
    }
    get $cancelAlert() {
        return $("#cancelAlertContainer");
    }

    async getViewData() {
        if (this.currentItemId != null) {
            return this.storage.read(this.currentItemId);
        }
        return null;
    }

    async bindItemEvents(data) {
        // this.$form.submit(this.submit); 
        $("#submitButton").click(this.submit);
        $("#cancelButton").click(() => {
            if(this.formChanged && this.$cancelAlert.html() == "") {
                let alertHtml = `<div id="cancelAlert" class="alert alert-warning alert-dismissible fade show" role="alert">
                                <strong>All changes made to the form will be dismissed once you cancel. Click cancel button again to confirm.</strong>
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
                this.$cancelAlert.html(alertHtml);
            }
            else {
                this.parentView.closeEditModal();
            }
        });
        $(".form-row input").change(this.change);
    }

    async bindWrapperEvents() {}

    submit = ev => {
        ev.preventDefault();
        ev.stopPropagation();
        if(this.formValid) {
            this.formValidated();
            let formData = this.$form.serializeArray();
            let obj = {id: this.currentItemId};
            formData.forEach((input) => {
                obj[input.name] = input.value;
            })
            this.storage.update(this.currentItemId, obj).then(() => {
                this.parentView.renderItem();
            });
            this.parentView.closeEditModal();
        }
    }

    getFormData() {
        return Object.fromEntries(new FormData(this.form));
    }

    change = ev => {
       let $el = this.getEventEl(ev)
       this.fieldValidated($el);
       this.formChanged = true;
       this.$cancelAlert.html("");
    }

    getEventEl(ev) {
        return $(ev.currentTarget);
    }

    fieldValidated($el) {
        $el.removeClass("is-valid is-invalid");
        if ($el[0].checkValidity()) {
            $el.addClass("is-valid");
        } else {
            $el.addClass("is-invalid");
        }
    }

  /*formValidated()-TODO-simply add was-validated class to form*/
    formValidated() {
        this.$form.addClass("was-validated");
    }
}