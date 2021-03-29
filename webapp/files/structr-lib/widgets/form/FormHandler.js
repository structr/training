'use strict';

import { FormPersistence } from "./FormPersistence.js";

export class FormHandler {
	
	constructor(formWidgetHelper, type, current, customDataTransformFunction) {
		this.formWidgetHelper = formWidgetHelper;
		this.formPersistence = new FormPersistence(this, type, current);
		this.formInputElements = [];
		this.customDataTransformFunction = customDataTransformFunction;
	}
	
	collectFormData() {
		let data = this.formInputElements.reduce( 
			(map, el) => {
				map[el.getKey()] = el.getValue();
				return map;
			}
			,{}
		);
		
		if (this.customDataTransformFunction) {
			data = this.customDataTransformFunction(data);
		}
		
		return data;
	}
	
	toggleEditMode() {
		for (let el of this.formInputElements) {
		
			el.toggleEditMode();
		}
	}

	registerFormInputElement(el) {
		this.formInputElements.push(el);
	}
	
	clearFormInputElements() {
		this.formInputElements = [];	
	}
	
	validateForm() {
		return this.formInputElements.reduce(
			(valid, el) => valid && el.validate()
			, true
		);
	}

	onError(error) {
		this.formWidgetHelper?.showError?.(error);
	}
	
	async handleCreate() {
		return await this.formPersistence.commitForm();
	}
	
	async handleSave() {
		const result = await this.formPersistence.commitForm();
		this.toggleEditMode();
		return result;
	}
	
	handleEdit() {
		this.toggleEditMode();
	}
	
	async handleDelete() {
		const type = this.formPersistence.type; 
		const id = this.formPersistence.current; 
		if (type && id) {
			await this.formPersistence.delete({type: type, id: id});
		}
	}
}