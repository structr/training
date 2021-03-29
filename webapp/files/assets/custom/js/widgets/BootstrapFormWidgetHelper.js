'use strict';

import { FormWidgetHelper } from "/structr-lib/widgets/form/FormWidgetHelper.js";
import { FormControlButton } from "/structr-lib/widgets/form/FormControlButton.js";
import { FormInputElementResolver } from "/structr-lib/widgets/form/FormInputElementResolver.js";

export class BootstrapFormWidgetHelper extends FormWidgetHelper {
	
	constructor(type, current, formId, customDataTransformFunction) {
		super(
			type,
			current,
			{
				create : new FormControlButton(document.querySelector('#button-' + formId + '-create')),
				save   : new FormControlButton(document.querySelector('#button-' + formId + '-save')),
				edit   : new FormControlButton(document.querySelector('#button-' + formId + '-edit')),
				cancel : new FormControlButton(document.querySelector('#button-' + formId + '-cancel'))	
			},
			customDataTransformFunction
		);
		
		this.formId = formId;
		this.current = current;
		
		this.formInputElementResolver = new FormInputElementResolver();
		
		this.registerCustomInputElements();
	}
	
	initialize() {
		this.findAndRegisterInputElements(this.formId);
		
		if (this.current !== null && this.formControlButtons?.save?.domNode) {
		
			this.formHandler.handleEdit();
		}
	}
	
	showError(error) {
		
		console.error(error);
	}
	
	findAndRegisterInputElements() {
		// Clear existing input elements
		this.clearFormInputElements();
		
		for (let el of this.createInputElements(this.formId)) {
	
			this.registerFormInputElement(el)
		}
	}
		
	createInputElements() {
		// Collect keys
		const domElements = document.getElementById('form-' + this.formId)?.elements ?? [];
		let elements = [];
		
		for (let domElement of domElements) {
			if (domElement.tagName === 'BUTTON') {
				continue;	
			}
			
			const elementId = domElement.id;
			const idFragments = elementId.split("-");
			const attrName = idFragments ? idFragments[idFragments.length - 1] : null;
			if (attrName) {
				elements.push(attrName);
			} else {
				console.error('Unnamed fields excluded from Edit-Mode: ', domElement);
			}
		}

		// Setup form control inputs
		let formControlInputs = [];
		for (let key of elements) {

			const domNode = document.querySelector("#" + this.formId + "-" + key);

			formControlInputs.push(this.formInputElementResolver.getElementForDOMNode(key, domNode));
		}

		return formControlInputs;	
	}

	
	registerCustomInputElements() {
		// Put custom elements that will always be registered here
	}
}