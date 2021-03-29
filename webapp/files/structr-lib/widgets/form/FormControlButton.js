'use strict';

export class FormControlButton {
	
	constructor(domNode) {
		this.domNode = domNode;
	}
	
	show() {
		this.getDOMNode()?.classList.remove("hidden");
	}
	
	hide() {
		this.getDOMNode()?.classList.add("hidden");
	}
	
	suspend() {
			
	}
	
	unsuspend() {
		
	}
	
	getDOMNode() {
		
		return this.domNode;
	}
}