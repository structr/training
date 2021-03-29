'use strict';

import { FormInputText } from "./input-element/FormInputText.js";
import { FormInputSelect } from "./input-element/FormInputSelect.js";
import { FormInputCheckbox } from "./input-element/FormInputCheckbox.js";

export class FormInputElementResolver {
	
	constructor() {
	
		this.registeredInputElements = [];
	}
	
	getElementForDOMNode(key, domNode) {
		
		for (let entry of this.registeredInputElements) {
			
			if (entry.predicateFunc(domNode)) {
					
				return entry.inputElementConstructor(key, domNode);
			}
		}
		
		switch (domNode.nodeName) {
			case "INPUT":
				if (domNode.type === 'checkbox') {
					
					return new FormInputCheckbox(key, domNode);
				} else {
					
					return new FormInputText(key, domNode);	
				}
			case "SELECT":
				return new FormInputSelect(key, domNode);	
			default:
				throw 'FormInputElementResolver Exception: Tried to initialize form input of unhandled type ' + domNode.nodeName;
		}
	}
	
	registerInputElement(predicateFunc, inputElementConstructor) {
	
		return this.registeredInputElements.push({
			predicateFunc: predicateFunc,
			inputElementConstructor: inputElementConstructor
		});
	}
	
}