'use strict';

export class RequestHelper {

	/**
	 * DESCRIPTION: build a GET parameter string from a parameter map
	 * PARAMETERS:
	 *  parameters - hashmap of parameters
	 */

	buildParameterString(parameters) {

		const keyValuePairs = [];
		for(let key in parameters) {
			
			let value = parameters[key];
			if(Array.isArray(value)) {
				value = value.join(',');
			}
			
			if(value) {
				let keyValuePair = key + '=' + value;
				keyValuePairs.push(keyValuePair);
			}
			
		}

		let parameterString = keyValuePairs.join('&');
		if(parameterString !== '') parameterString = '?' + parameterString;

		return parameterString;

	}
	
	/**
	 * DESCRIPTION: extracts the GET parameters into a map
	 */
	
	extractParameterMap() {
	
		const parameters = {};
		
		const uri = document.location.href;
		const baseUriAndParameterString = uri.split('?');
		const baseUri         = baseUriAndParameterString[0];
		const parameterString = baseUriAndParameterString[1];
		const keyValueStrings = parameterString ? parameterString.split('&') : [];

		for(let keyValueString of keyValueStrings) {

			let keyValuePair = keyValueString.split('=');
			let key   = keyValuePair[0];
			let value = unescape(keyValuePair[1]);

			parameters[key] = value;

		}
		
		return parameters;
		
	}
	
}