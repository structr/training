'use strict';

import { FormHandler } from "./FormHandler.js";

export class FormWidgetHelper {
	
	constructor(type, current, formControlButtons, customDataTransformFunction) {
		this.formHandler = new FormHandler(this, type, current, customDataTransformFunction);
		this.formControlButtons = formControlButtons;
		
		this.setupFormControlButtons(current === null);
		
		this.eventListeners = {};
	}
	
	setupFormControlButtons(emptyCurrent) {
	
		if(this.formControlButtons.create?.getDOMNode()) {
			this.formControlButtons.create.getDOMNode().addEventListener('click', this.onCreate.bind(this));
		}
		if(this.formControlButtons.save?.getDOMNode()) {
			this.formControlButtons.save.getDOMNode().addEventListener('click', this.onSave.bind(this));
		}
		if (this.formControlButtons.edit?.getDOMNode()) {
			this.formControlButtons.edit.getDOMNode().addEventListener('click', this.onEdit.bind(this));
		}	
		if (this.formControlButtons.cancel?.getDOMNode()) {
			this.formControlButtons.cancel.getDOMNode().addEventListener('click', this.onCancel.bind(this));
		}
		
		// Setup button visibility
		if (emptyCurrent) {
			
			this.formControlButtons.create?.show();
			this.formControlButtons.edit?.hide();
			this.formControlButtons.save?.hide();
			this.formControlButtons.cancel?.hide();
		} else {
			
			this.formControlButtons.create?.hide();
			this.formControlButtons.edit?.show();
			this.formControlButtons.save?.hide();
			this.formControlButtons.cancel?.hide();
		}
	}
	
	registerFormInputElement(formInputElement) {
	
		this.formHandler.registerFormInputElement(formInputElement);
	}
	
	clearFormInputElements() {
	
		this.formHandler.clearFormInputElements();
	}
	
	showError(error) {
		
		console.log(error);
	}
	
	async onCreate() {
		let result;
		
		this.formControlButtons?.create?.suspend();
		
		if (this.formHandler.validateForm()) {
		
			result = await this.formHandler.handleCreate();
		}
		
		this.formControlButtons?.create?.unsuspend();
		
		if (this.eventListeners?.create) {
			for (const handler of this.eventListeners?.create) {
				handler(result);	
			}
		}
	}
	
	onEdit() {
		this.formControlButtons?.edit?.hide();
		this.formControlButtons?.save?.show();
		this.formControlButtons?.cancel?.show();
		
		this.formHandler.handleEdit();
	}
	
	async onSave() {
		
		this.formControlButtons?.save?.suspend();
		
		let result = await this.formHandler.handleSave();
		
		if (this.eventListeners?.save) {
			for (const handler of this.eventListeners?.save) {
				handler(result);
			}
		}
		
		this.formControlButtons?.save?.unsuspend();
		
		this.formControlButtons?.edit?.show();
		this.formControlButtons?.save?.hide();
		this.formControlButtons?.cancel?.hide();
	}
	
	async onDelete() {
		this.formHandler.handleDelete();
	}
	
	onCancel() {
		
		this.formControlButtons?.edit?.show();
		this.formControlButtons?.save?.hide();
		this.formControlButtons?.cancel?.hide();
		
		this.formHandler.handleEdit();
	}
	
	addEventListener(event, handler) {
		if (!this.eventListeners[event]) {
			this.eventListeners[event] = [];
		}
		this.eventListeners?.[event].push(handler);
	}
	
}