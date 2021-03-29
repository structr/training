'use strict';

import { RequestHelper } from '/structr-lib/widgets/RequestHelper.js';

export class Pager {

	/**
	 * PARAMETERS:
	 *   tableId        - id of domNode into which table is to be loaded,
	 *   tableUrl       - url of partial (when mode=partial)
	 *   resultCountUrl - url of result count (when mode=partial)
	 */
	
	constructor(tableUrl, resultCountUrl, tableId) {
	
		// instantiate classes
		this.requestHelper = new RequestHelper();
		
		// set attributes
		this.tableUrl       = tableUrl;
		this.resultCountUrl = resultCountUrl;
		this.tableId        = tableId;
		this.parameters     = {};
		this.realoadCount = 0;
		
		// collect html elements for paging
		this.pageSizeSelector     = document.getElementById('page-size-' + tableId);
		this.previousPageButton   = document.getElementById('previous-page-' + tableId);
		this.nextPageButton       = document.getElementById('next-page-' + tableId);
		this.resultCountContainer = document.getElementById('result-count-' + tableId);
		this.tableContainer       = document.getElementById('table-container');
		this.pageNumberInput      = document.getElementById('page-number-' + tableId);
		
		// hook pager buttons
		this.hookPagingEvents();
		
	}


	/****************************************\
	 #HELPER-FUNCTIONS
	\****************************************/
	
	/**
	 * DESCRIPTION: load a modal as partial into page
	 * PARAMETERS:
	 *   domNode - the dom node into which the partial modal is to be loaded
	 *   url     - url of the partial modal to load
	 */

	async loadPartial(url, domNode, reloadNumber) {

		const encodedUrl = encodeURI(url);
		const page = await fetch(encodedUrl);
		const html = await page.text();
		if(reloadNumber === this.realoadCount) {
			domNode.innerHTML = html;
		}

	}
	
	async getResultCount() {

		const parameterString = this.requestHelper.buildParameterString(this.parameters);
		const filteredResultCountUrl = this.resultCountUrl + parameterString;
		const encodedUrl = encodeURI(filteredResultCountUrl);
		const page = await fetch(encodedUrl);
		const html = await page.text();
		const resultCount = parseInt(html);
		return resultCount;

	}
	
	async showResultCount() {
		
		const pageNumber  = this.getPageNumber();
		const pageSize    = this.getPageSize();
		const resultCount = await this.getResultCount();
		
		const start = (pageNumber - 1) * pageSize + 1;
		const end   = start + pageSize - 1;
	
		const resultCountString =
			'Showing ' + start + 
			' to ' + end +
			' of ' + resultCount;
		
		this.resultCountContainer.innerHTML = resultCountString;
	
	}

	setDisabled(button, disabled) {

		button.disabled = disabled;
		if(disabled) {
			button.classList.add('disabled');
		} else {
			button.classList.remove('disabled');
		}

	}

	getPageNumber() {

		const pageNumberString = this.pageNumberInput.value;
		const pageNumber = parseInt(pageNumberString);
		return pageNumber;

	}

	async setPageNumber(pageNumber) {

		const pageLimit = await this.computePageLimit();

		if(pageNumber <= 1) {
			pageNumber = 1;
			this.setDisabled(this.previousPageButton, true);
		} else {
			this.setDisabled(this.previousPageButton, false);
		}

		if(pageLimit <= pageNumber) {
			pageNumber = pageLimit;
			this.setDisabled(this.nextPageButton, true);
		} else {
			this.setDisabled(this.nextPageButton, false);
		}

		this.pageNumberInput.value = pageNumber;

	}

	getPageSize() {

		const selectedOption = this.pageSizeSelector.options[this.pageSizeSelector.selectedIndex];
		const pageSizeString = selectedOption.value;
		const pageSize = parseInt(pageSizeString);
		return pageSize;

	}

	async computePageLimit() {

		const pageSize    = this.getPageSize();
		const resultCount = await this.getResultCount();

		const wholePages   = Math.floor(resultCount / pageSize);
		const partialPages = (resultCount % pageSize > 0) ? 1 : 0;
		const pageLimit    = wholePages + partialPages;
		return pageLimit;

	}
	
	/**
	 * DESCRIPTION: hooks event listeners for paging buttons
	 */

	async hookPagingEvents() {

		// set page size
		this.pageSizeSelector.addEventListener('change', async function() {
			await this.setPageNumber(1);
			this.load();
		}.bind(this));

		// previous page
		this.previousPageButton.addEventListener('click', async function() {
			const currentPageNumber = this.getPageNumber();
			await this.setPageNumber(currentPageNumber - 1);
			this.load();
		}.bind(this));

		// next page
		this.nextPageButton.addEventListener('click', async function() {
			const currentPageNumber = this.getPageNumber();
			await this.setPageNumber(currentPageNumber + 1);
			this.load();
		}.bind(this));

		// check if nextButton is disabled
		const resultCount = await this.getResultCount();
		if(resultCount <= this.getPageSize()) {
			this.setDisabled(this.nextPageButton);
		}
		
	}

	/**
	 * DESCRIPTION: loads partial table with paging parameters
	 * PARAMETERS:
	 *   pagingParameters - the paging parameters for the partial table
	 */

	async load(parameters) {
		
		this.realoadCount++;
		let reloadNumber = this.realoadCount;
		
		if(parameters) {
			this.parameters = parameters;
		}

		// add paging parameters
		this.parameters['pageNumber'] = this.getPageNumber();
		this.parameters['pageSize']   = this.getPageSize();

		const parameterString = this.requestHelper.buildParameterString(this.parameters);

		const filteredTableUrl = this.tableUrl + parameterString;
		await this.loadPartial(filteredTableUrl, this.tableContainer, reloadNumber);
		this.showResultCount();

	}
	
};