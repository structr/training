'use strict';

import { FormInputElement } from "/structr-lib/widgets/form/FormInputElement.js";

export class FormInputText extends FormInputElement {
	
	constructor(key, domNode) {
		super(
			key, 
			{
				toggleEditModeFunc : () => {
					domNode.disabled = !domNode.disabled;
				},
				getValueFunc : () => { 
					return domNode.value; 
				}
			}
		);
	}
}