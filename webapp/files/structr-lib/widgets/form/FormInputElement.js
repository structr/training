'use strict';

export class FormInputElement {
	
	constructor(key, config) {
		this.key                = key;
		this.toggleEditModeFunc = config?.toggleEditModeFunc;
		this.getValueFunc       = config?.getValueFunc;
		this.validateFunc       = config?.validateFunc;
	}
	
	toggleEditMode() {
		this.toggleEditModeFunc?.();
	}
	
	getKey() {
		return this.key;
	}
	
	getValue() {
		return this.getValueFunc?.();
	}
	
	validate() {
		return this.validateFunc?.(this.getValue()) ?? true;
	}
}