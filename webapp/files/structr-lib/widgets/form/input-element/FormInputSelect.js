'use strict';

import { FormInputElement } from "/structr-lib/widgets/form/FormInputElement.js";

export class FormInputSelect extends FormInputElement {
	
	constructor(key, domNode) {
		super(
			key, 
			{
				toggleEditModeFunc : () => {
					domNode.disabled = !domNode.disabled;
				},
				getValueFunc : () => { 
					if (domNode.multiple) {
						const selected = Array.prototype.filter.call(domNode.options, function(o){return o.selected;});
						return Array.prototype.map.call(selected, function(s) {return s.value});
					} else {
						return domNode.value; 
					}
				}
			}
		);
	}
}