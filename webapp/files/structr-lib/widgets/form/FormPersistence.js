'use strict';

import { Persistence } from "/structr-lib/persistence-layer/persistence/Persistence.js";

export class FormPersistence {
	
	constructor(formHandler, type, current) {
		this.formHandler = formHandler;
		this.type = type;
		this.current = current;
		
		this.persistence = new Persistence();
	}
	
	async commitForm() {
		const data = this.formHandler?.collectFormData();
		
		// Enrich data
		data.type = this.type;
		if (this.current && this.current.length > 0) {
			data.id = this.current;
		}
		
		if (data !== null && data !== undefined) {
			return await this.persist(data);
		}
	}
	
	async persist(data) {
		
		if(data.id) {
			return await this.persistence._persistObject(data).catch(this.handleError.bind(this));
		} else {
			return await this.persistence.createNode(data).catch(this.handleError.bind(this));
		}
	};
	
	async delete(data) {

		await this.persistence.deleteNode(data).catch(this.handleError.bind(this));
	}
	
	handleError(error) {
		
		this.formHandler?.onError?.(error);
	}
}