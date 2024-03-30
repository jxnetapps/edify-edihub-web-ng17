import { Injectable } from "@angular/core";
import { HttpResponseBase, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { AppDBkeys } from "./db-keys";

@Injectable()
export class Utilities {
	public static readonly captionAndMessageSeparator = ":";
	public static readonly noNetworkMessageCaption = "No Network";
	public static readonly noNetworkMessageDetail = "The server cannot be reached";
	public static readonly accessDeniedMessageCaption = "Access Denied!";
	public static readonly accessDeniedMessageDetail = "";
	public static readonly notFoundMessageCaption = "Not Found";
	public static readonly notFoundMessageDetail = "The target resource cannot be found";

	public static getHttpResponseMessages(data: HttpResponseBase | any): string[] {
		const responses: string[] = [];

		if (data instanceof HttpResponseBase) {
			if (this.checkNoNetwork(data)) {
				responses.push(`${this.noNetworkMessageCaption}${this.captionAndMessageSeparator} ${this.noNetworkMessageDetail}`);
			} else {
				const responseObject = this.getResponseBody(data);

				if (responseObject && (typeof responseObject === "object" || responseObject instanceof Object)) {
					for (const key in responseObject) {
						if (key) {
							responses.push(`${key}${this.captionAndMessageSeparator} ${responseObject[key]}`);
						} else if (responseObject[key]) {
							responses.push(responseObject[key].toString());
						}
					}
				}
			}

			if (!responses.length) {
				if ((<any>data).body) {
					responses.push(`body: ${(<any>data).body}`);
				}

				if ((<any>data).error) {
					responses.push(`error: ${(<any>data).error}`);
				}
			}
		}

		if (!responses.length) {
			if (this.getResponseBody(data)) {
				responses.push(this.getResponseBody(data).toString());
			} else {
				responses.push(data.toString());
			}
		}

		if (this.checkAccessDenied(data)) {
			responses.splice(0, 0, `${this.accessDeniedMessageCaption}${this.captionAndMessageSeparator} ${this.accessDeniedMessageDetail}`);
		}

		if (this.checkNotFound(data)) {
			let message = `${this.notFoundMessageCaption}${this.captionAndMessageSeparator} ${this.notFoundMessageDetail}`;
			if (data.url) {
				message += `. ${data.url}`;
			}

			responses.splice(0, 0, message);
		}

		return responses;
	}

	public static getHttpResponseMessage(data: HttpResponseBase | any): string {
		const httpMessage = Utilities.findHttpResponseMessage(Utilities.noNetworkMessageCaption, data) || Utilities.findHttpResponseMessage(Utilities.notFoundMessageCaption, data) || Utilities.findHttpResponseMessage("error_description", data) || Utilities.findHttpResponseMessage("error", data) || Utilities.getHttpResponseMessages(data).join();

		return httpMessage;
	}

	public static findHttpResponseMessage(messageToFind: string, data: HttpResponse<any> | any, searchInCaptionOnly = true, includeCaptionInResult = false): string {
		const searchString = messageToFind.toLowerCase();
		const httpMessages = this.getHttpResponseMessages(data);

		for (const message of httpMessages) {
			const fullMessage = Utilities.splitInTwo(message, this.captionAndMessageSeparator);

			if (fullMessage.firstPart && fullMessage.firstPart.toLowerCase().indexOf(searchString) != -1) {
				return includeCaptionInResult ? message : fullMessage.secondPart || fullMessage.firstPart;
			}
		}

		if (!searchInCaptionOnly) {
			for (const message of httpMessages) {
				if (message.toLowerCase().indexOf(searchString) != -1) {
					if (includeCaptionInResult) {
						return message;
					} else {
						const fullMessage = Utilities.splitInTwo(message, this.captionAndMessageSeparator);
						return fullMessage.secondPart || fullMessage.firstPart;
					}
				}
			}
		}

		return '';
	}

	public static getResponseBody(response: HttpResponseBase) {
		if (response instanceof HttpResponse) {
			return response.body;
		}

		if (response instanceof HttpErrorResponse) {
			return response.error || response.message || response.statusText;
		}
	}

	public static checkNoNetwork(response: HttpResponseBase) {
		if (response instanceof HttpResponseBase) {
			return response.status == 0;
		}

		return false;
	}

	public static checkAccessDenied(response: HttpResponseBase) {
		if (response instanceof HttpResponseBase) {
			return response.status == 403;
		}

		return false;
	}

	public static checkNotFound(response: HttpResponseBase) {
		if (response instanceof HttpResponseBase) {
			return response.status == 404;
		}

		return false;
	}

	public static checkIsLocalHost(url: string, base?: string) {
		if (url) {
			const location = new URL(url, base);
			return location.hostname === "localhost" || location.hostname === "127.0.0.1";
		}

		return false;
	}

	public static getQueryParamsFromString(paramString: string) {
		if (!paramString) {
			return null;
		}

		const params: { [key: string]: string } = {};

		for (const param of paramString.split("&")) {
			const keyValue = Utilities.splitInTwo(param, "=");
			params[keyValue.firstPart] = keyValue.secondPart;
		}

		return params;
	}

	public static splitInTwo(text: string, separator: string): { firstPart: string; secondPart: string } {
		const separatorIndex = text.indexOf(separator);

		if (separatorIndex == -1) {
			return { firstPart: text, secondPart: '' };
		}

		const part1 = text.substr(0, separatorIndex).trim();
		const part2 = text.substr(separatorIndex + 1).trim();

		return { firstPart: part1, secondPart: part2 };
	}

	public static safeStringify(object: any) {
		let result: string;

		try {
			result = JSON.stringify(object);
			return result;
		} catch (error) {}

		const simpleObject: any = {};

		for (const prop in object) {
			if (!object.hasOwnProperty(prop)) {
				continue;
			}
			if (typeof object[prop] == "object") {
				continue;
			}
			if (typeof object[prop] == "function") {
				continue;
			}
			simpleObject[prop] = object[prop];
		}

		result = "[***Sanitized Object***]: " + JSON.stringify(simpleObject);

		return result;
	}

	public static JsonTryParse(value: string) {
		try {
			return JSON.parse(value);
		} catch (e) {
			if (value === "undefined") {
				return void 0;
			}
			return value;
		}
	}

	public static TestIsObjectEmpty(obj: any) {
		for (const prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				return false;
			}
		}

		return true;
	}

	public static TestIsUndefined(value: any) {
		return typeof value === "undefined";
		// return value === undefined;
	}

	public static TestIsString(value: any) {
		return typeof value === "string" || value instanceof String;
	}

	public static capitalizeFirstLetter(text: string) {
		if (text) {
			return text.charAt(0).toUpperCase() + text.slice(1);
		} else {
			return text;
		}
	}

	public static toTitleCase(text: string) {
		return text.replace(/\w\S*/g, (subString) => {
			return subString.charAt(0).toUpperCase() + subString.substr(1).toLowerCase();
		});
	}

	public static toLowerCase(items: any) {
		if (items instanceof Array) {
			const loweredRoles: string[] = [];

			for (let i = 0; i < items.length; i++) {
				loweredRoles[i] = items[i].toLowerCase();
			}

			return loweredRoles;
		} else if (typeof items === "string" || items instanceof String) {
			return items.toLowerCase();
		}

		return '';
	}

	public static uniqueId() {
		return this.randomNumber(1000000, 9000000).toString();
	}

	public static randomNumber(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	public static baseUrl() {
		let base = "";

		if (window.location.origin) {
			base = window.location.origin;
		} else {
			base = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
		}

		return base.replace(/\/$/, "");
	}

	public static getDefaultAcademicYear() {
		const year = parseInt(window.localStorage.getItem(AppDBkeys.DEFAULT_ACADEMICYEARID) as string, 0);
		return isNaN(year) ? 0 : year;
	}

	public static getCurrentUserRole() {
		const role = parseInt(window.localStorage.getItem(AppDBkeys.CURRENT_USER_ROLE)as string, 0);
		return isNaN(role) ? 0 : role;
	}

	public static getCurrentUser() {
		return JSON.parse(window.localStorage.getItem(AppDBkeys.CURRENT_USER)as string);
	}

	public static printDateOnly(date: Date) {
		date = new Date(date);

		const dayNames = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
		const monthNames = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

		const dayOfWeek = date.getDay();
		const dayOfMonth = date.getDate();
		let sup = "";
		const month = date.getMonth();
		const year = date.getFullYear();

		if (dayOfMonth == 1 || dayOfMonth == 21 || dayOfMonth == 31) {
			sup = "st";
		} else if (dayOfMonth == 2 || dayOfMonth == 22) {
			sup = "nd";
		} else if (dayOfMonth == 3 || dayOfMonth == 23) {
			sup = "rd";
		} else {
			sup = "th";
		}

		const dateString = dayNames[dayOfWeek] + ", " + dayOfMonth + sup + " " + monthNames[month] + " " + year;

		return dateString;
	}

	public static printTimeOnly(date: Date) {
		date = new Date(date);

		let period = "";
		let minute = date.getMinutes().toString();
		let hour = date.getHours();

		period = hour < 12 ? "AM" : "PM";

		if (hour == 0) {
			hour = 12;
		}
		if (hour > 12) {
			hour = hour - 12;
		}

		if (minute.length == 1) {
			minute = "0" + minute;
		}

		const timeString = hour + ":" + minute + " " + period;

		return timeString;
	}

	public static printDate(date: Date, separator = "at") {
		return `${Utilities.printDateOnly(date)} ${separator} ${Utilities.printTimeOnly(date)}`;
	}

	public static printFriendlyDate(date: Date, separator = "-") {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);
		const test = new Date(date.getFullYear(), date.getMonth(), date.getDate());

		if (test.toDateString() == today.toDateString()) {
			return `Today ${separator} ${Utilities.printTimeOnly(date)}`;
		}
		if (test.toDateString() == yesterday.toDateString()) {
			return `Yesterday ${separator} ${Utilities.printTimeOnly(date)}`;
		} else {
			return Utilities.printDate(date, separator);
		}
	}

	public static printShortDate(date: Date, separator = "/", dateTimeSeparator = "-") {
		let day = date.getDate().toString();
		let month = (date.getMonth() + 1).toString();
		const year = date.getFullYear();

		if (day.length == 1) {
			day = "0" + day;
		}

		if (month.length == 1) {
			month = "0" + month;
		}

		return `${month}${separator}${day}${separator}${year} ${dateTimeSeparator} ${Utilities.printTimeOnly(date)}`;
	}

	public static parseDate(date : any) {
		if (date) {
			if (date instanceof Date) {
				return date;
			}

			if (typeof date === "string" || date instanceof String) {
				if (date.search(/[a-su-z+]/i) == -1) {
					date = date + "Z";
				}

				return new Date(date);
			}

			if (typeof date === "number" || date instanceof Number) {
				return new Date(<any>date);
			}
		}

		return new Date();
	}

	public static printDuration(start: Date, end: Date) {
		start = new Date(start);
		end = new Date(end);

		// get total seconds between the times
		let delta = Math.abs(start.valueOf() - end.valueOf()) / 1000;

		// calculate (and subtract) whole days
		const days = Math.floor(delta / 86400);
		delta -= days * 86400;

		// calculate (and subtract) whole hours
		const hours = Math.floor(delta / 3600) % 24;
		delta -= hours * 3600;

		// calculate (and subtract) whole minutes
		const minutes = Math.floor(delta / 60) % 60;
		delta -= minutes * 60;

		// what's left is seconds
		const seconds = delta % 60; // in theory the modulus is not required

		let printedDays = "";

		if (days) {
			printedDays = `${days} days`;
		}

		if (hours) {
			printedDays += printedDays ? `, ${hours} hours` : `${hours} hours`;
		}

		if (minutes) {
			printedDays += printedDays ? `, ${minutes} minutes` : `${minutes} minutes`;
		}

		if (seconds) {
			printedDays += printedDays ? ` and ${seconds} seconds` : `${seconds} seconds`;
		}

		if (!printedDays) {
			printedDays = "0";
		}

		return printedDays;
	}

	public static getAge(birthDate : Date | string, otherDate : Date | string) {
		birthDate = new Date(birthDate);
		otherDate = new Date(otherDate);

		let years = otherDate.getFullYear() - birthDate.getFullYear();

		if (otherDate.getMonth() < birthDate.getMonth() || (otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate())) {
			years--;
		}

		return years;
	}

	/**
	 * Get date[format:mm-dd- yyyy] - today as default date
	 * @param date
	 */
	public static getDate(date = null) {
		const _date = date === undefined || date === null ? new Date() : date;
		const d = new Date(_date);
		let month = "" + (d.getMonth() + 1);
		let day = "" + d.getDate();
		const year = d.getFullYear();

		if (month.length < 2) month = "0" + month;
		if (day.length < 2) day = "0" + day;

		return [day, month, year].join("-");
	}

	public static getServerDate(date = null) {
		const _date = date === undefined || date === null ? new Date() : date;
		const d = new Date(_date);
		let month = "" + (d.getMonth() + 1);
		let day = "" + d.getDate();
		const year = d.getFullYear();

		if (month.length < 2) month = "0" + month;
		if (day.length < 2) day = "0" + day;

		return [year, month, day].join("-");
	}

	public static searchArray(searchTerm: string, caseSensitive: boolean, ...values: any[]) {
		if (!searchTerm) {
			return true;
		}

		let filter = searchTerm.trim();
		let data = values.join();

		if (!caseSensitive) {
			filter = filter.toLowerCase();
			data = data.toLowerCase();
		}

		return data.indexOf(filter) != -1;
	}

	public static moveArrayItem(array: any[], oldIndex: number, newIndex: number) {
		while (oldIndex < 0) {
			oldIndex += this.length;
		}

		while (newIndex < 0) {
			newIndex += this.length;
		}

		if (newIndex >= this.length) {
			let k = newIndex - this.length;
			while (k-- + 1) {
				array.push(undefined);
			}
		}

		array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
	}

	public static expandCamelCase(text: string) {
		if (!text) {
			return text;
		}

		return text
			.replace(/([A-Z][a-z]+)/g, " $1")
			.replace(/([A-Z][A-Z]+)/g, " $1")
			.replace(/([^A-Za-z ]+)/g, " $1");
	}

	public static testIsAbsoluteUrl(url: string) {
		const r = new RegExp("^(?:[a-z]+:)?//", "i");
		return r.test(url);
	}

	public static convertToAbsoluteUrl(url: string) {
		return Utilities.testIsAbsoluteUrl(url) ? url : "//" + url;
	}

	public static getHttpErrorMessage(error: any): string {
		if(error?.status === 500){
			return error?.statusText;
		}

		if(error?.status === 401){
			return 'Session expired. Please login again...';
		}

		if(error?.status === 400){
			if(error?.error?.Errors?.length > 0){
				let errorMsgs: string  = '';
				error?.error?.Errors?.forEach((e: { Message: string; }) => {
					if(e.Message)
					errorMsgs = errorMsgs.length > 0 ? 	`${errorMsgs} \r\n ${e.Message}` : e.Message
				});

				if(errorMsgs.length > 0){
					return errorMsgs;
				}
			}
			const defaultErrorMsg: any  = 'Request is not valid.';
			return error?.error?.Message || error?.error?.message | defaultErrorMsg;
		}

		console.log(`Unable to retrieve response from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`);
		//console.log(`Unable to retrieve response from the server`);
		return Utilities.getHttpResponseMessage(error);
	}

	public static prepareFormData(inputModel: any): FormData {
		let formData = new FormData();
		Object.keys(inputModel).forEach((controlName) => formData.append(controlName, inputModel[controlName]));

		return formData;
	}

	public static prepareFileUploadFormData(inputModel: any, itemAlias: string, uploadedList: FileList): FormData {
		let formData = new FormData();
		Object.keys(inputModel).forEach((controlName) => formData.append(controlName, inputModel[controlName]));

		if (uploadedList && uploadedList !== null) {
			for (let i = 0; uploadedList.length > i; i++) {
				formData.append(itemAlias, uploadedList[i], uploadedList[i].name);
			}
		}

		return formData;
	}

	public static prepareSingleFileUploadFormData(inputModel: any, itemAlias: string, uploadedFile: File): FormData {
		let formData = new FormData();
		Object.keys(inputModel).forEach((controlName) => formData.append(controlName, inputModel[controlName]));

		if (uploadedFile && uploadedFile !== null) {
			formData.append(itemAlias, uploadedFile, uploadedFile.name);
		}

		return formData;
	}

	public static getLetterAvatar(name: string) {
		if (!name) {
			return name;
		}

		name = name || "";

		const nameSplit = String(name).toUpperCase().split(" ");
		let initials = "";

		if (nameSplit.length === 1) {
			initials = nameSplit[0] ? nameSplit[0].charAt(0) : "?";
		} else {
			initials = nameSplit[0].charAt(0) + nameSplit[1].charAt(0);
		}

		return initials;
	}

	public static getEntityStatus(): any {
		const _statuses = [
			{ value: 0, text: "InActive" },
			{ value: 1, text: "Active" },
			{ value: 4, text: "Deleted" },
		];

		return _statuses;
	}

	public static getTransactionStatus(): any[] {
		const _statuses = [
			{ value: 1, text: "Completed" },
			{ value: 3, text: "Cancelled" },
		];

		return _statuses;
	}

	/** UI */
	/**
	 * Returns CSS Class Name by status
	 *
	 * @param status: number
	 */
	public static getItemCssClassByStatus(status: number = 0): string {
		switch (status) {
			case 0:
				return "danger";
			case 1:
				return "success";
			case 4:
				return "metal";
		}
		return "";
	}

	/**
	 * Returns Item Status in string
	 * @param status: number
	 */
	public static getItemStatusString(status: number = 0): string {
		switch (status) {
			case 0:
				return "InActive";
			case 1:
				return "Active";
		}
		return "";
	}

	/**
	 * Returns Item Status in string
	 * @param status: number
	 */
	public static getBloodGroupList(): any {
		const _statuses = [
			{ value: 1, text: "A Positive" },
			{ value: 2, text: "A Negative" },
			{ value: 3, text: "A Unknown" },
			{ value: 4, text: "B Positive" },
			{ value: 5, text: "B Negative" },
			{ value: 6, text: "B Unknown" },
			{ value: 7, text: "AB Positive" },
			{ value: 8, text: "AB Negative" },
			{ value: 9, text: "AB Unknown" },
			{ value: 10, text: "O Positive" },
			{ value: 11, text: "O Negative" },
			{ value: 12, text: "O Unknown" },
			{ value: 13, text: "Unknown" },
		];

		return _statuses;
	}

	public static getBloodGroupName(id: number): any {
		const result = this.getBloodGroupList();
		const filterItems = result.filter((s: { value: number }) => s.value === id);

		return filterItems.length > 0 ? filterItems[0].text : "-";
	}

	public static getMaritalStatusList(): any {
		const _statuses = [
			{ value: 1, text: "Single" },
			{ value: 2, text: "Married" },
			{ value: 3, text: "Widowed" },
			{ value: 4, text: "Divorced" },
			{ value: 5, text: "Separated" },
		];

		return _statuses;
	}

	public static getMaritalStatusName(id: number): any {
		const result = this.getMaritalStatusList();
		const filterItems = result.filter((s: { value: number }) => s.value === id);

		return filterItems.length > 0 ? filterItems[0].text : "-";
	}

	public static getGenderList(): any {
		const _statuses = [
			{ value: 1, text: "Male" },
			{ value: 2, text: "Female" },
		];

		return _statuses;
	}

	public static getGenderName(id: number): any {
		const result = this.getGenderList();
		const filterItems = result.filter((s: { value: number }) => s.value === id);

		return filterItems.length > 0 ? filterItems[0].text : "-";
	}

	public static getRelationList(): any {
		const _statuses = [
			{ value: 1, text: "Father" },
			{ value: 2, text: "Mother" },
			{ value: 3, text: "Guardian" },
		];

		return _statuses;
	}

	public static getRelationName(id: number): any {
		const result = this.getRelationList();
		const filterItems = result.filter((s: { value: number }) => s.value === id);

		return filterItems.length > 0 ? filterItems[0].text : "-";
	}

	public static getBooleanList(): any {
		const _statuses = [
			{ value: true, text: "Yes" },
			{ value: false, text: "No" },
		];

		return _statuses;
	}

	/**
	 * Convert number to string and adding '0' before
	 *
	 * @param value: number
	 */
	public static padNumber(value: number) {
		if (this.isNumber(value)) {
			return `0${value}`.slice(-2);
		} else {
			return "";
		}
	}

	/**
	 * Checking value type equals to Number
	 *
	 * @param value: any
	 */
	public static isNumber(value: any): boolean {
		return !isNaN(this.toInteger(value));
	}

	/**
	 * Covert value to number
	 *
	 * @param value: any
	 */
	public static toInteger(value: any): number {
		return parseInt(`${value}`, 10);
	}

	/**
	 * Convert date to string with 'MM/dd/yyyy' format
	 *
	 * @param date: Date
	 */
	public static dateFormat(date: Date): string {
		if (typeof date === "string") {
			date = new Date(date);
		}
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const year = date.getFullYear();
		if (date) {
			return `${month}/${day}/${year}`;
		}

		return "";
	}

	public static toServerDate(date: any): string {
		if (date) {
			if (typeof date === "string") {
				date = new Date(date);
			}
			const month = date.getMonth() + 1;
			const day = date.getDate();
			const year = date.getFullYear();
			if (date) {
				return `${year}-${month}-${day}`;
			}

			return "";
		}

		return '';
	}

	/**
	 * Convert Date to string with custom format 'MM/dd/yyyy'
	 *
	 * @param date: any
	 */
	public static dateCustomFormat(date: any): string {
		let stringDate: string = "";
		if (date) {
			stringDate += this.isNumber(date.month) ? this.padNumber(date.month) + "/" : "";
			stringDate += this.isNumber(date.day) ? this.padNumber(date.day) + "/" : "";

			stringDate += date.year;
		}
		return stringDate;
	}

	/**
	 * Convert string to DateFormatter (For Reactive Forms Validators)
	 *
	 * @param dateInStr: string (format => 'MM/dd/yyyy')
	 */
	public static getDateFormatterFromString(dateInStr: string): any {
		if (dateInStr && dateInStr.length > 0) {
			const dateParts = dateInStr.trim().split("/");
			return [
				{
					year: this.toInteger(dateParts[2]),
					month: this.toInteger(dateParts[0]),
					day: this.toInteger(dateParts[1]),
				},
			];
		}

		const _date = new Date();
		return [
			{
				year: _date.getFullYear(),
				month: _date.getMonth() + 1,
				day: _date.getDay(),
			},
		];
	}

	/**
	 * Convert string to Date
	 *
	 * @param dateInStr: string (format => 'MM/dd/yyyy')
	 */
	public static getDateFromString(dateInStr: string = ""): Date {
		if (dateInStr && dateInStr.length > 0) {
			const dateParts = dateInStr.trim().split("/");
			const year = this.toInteger(dateParts[2]);
			const month = this.toInteger(dateParts[0]);
			const day = this.toInteger(dateParts[1]);
			// tslint:disable-next-line:prefer-const
			let result = new Date();
			result.setDate(day);
			result.setMonth(month - 1);
			result.setFullYear(year);
			return result;
		}

		return new Date();
	}

	/**
	 * Convert Date to string with format 'MM/dd/yyyy'
	 * @param _date: Date?
	 */
	public static getDateStringFromDate(_date: Date = new Date()): string {
		const month = _date.getMonth() + 1;
		const year = _date.getFullYear();
		const date = _date.getDate();
		return `${month}/${date}/${year}`;
	}

	public static getYYYYMMDD(dateInStr: string = ""): string {
		if (dateInStr && dateInStr.length > 0) {
			return new Date(dateInStr).toISOString().substring(0, 10);
		}
		return new Date().toISOString().substring(0, 10);
	}

	public static isNullOrEmpty(value: any): boolean {
		return (
			// null or undefined
			value == null ||
			// has length and it's zero
			(value.hasOwnProperty("length") && value.length === 0) ||
			// is an Object and has no keys
			(value.constructor === Object && Object.keys(value).length === 0)
		);
	}

	//download file from blob
	public static downloadFile(data: HttpResponse<Blob>, filename: string = "") {
		const contentDisposition2 = data.headers && data.headers.get("content-disposition");
		console.log(contentDisposition2)
		const contentDisposition = data.headers && data.headers.get("Content-Disposition");
		if (contentDisposition) {
			filename = Utilities.getFilenameFromContentDisposition(contentDisposition);
		}

		const blob = new Blob([data.body as Blob], { type: data.body?.type });
		const _window: any = window.navigator;
		if (_window && _window?.msSaveOrOpenBlob) {
			// IE11 and Edge
			_window?.msSaveOrOpenBlob(blob, filename);
		} else {
			// Chrome, Safari, Firefox, Opera
			let url = URL.createObjectURL(blob);
			this.openLink(url, filename);
			// Remove the link when done
			setTimeout(function () {
				window.URL.revokeObjectURL(url);
			}, 5000);
		}

		//const blob = new Blob([data.body], { type: data.body.type });
		//const url = window.URL.createObjectURL(blob);
		//const anchor = document.createElement("a");
		//anchor.setAttribute('style', 'display:none;');
		//anchor.download = filename;
		//anchor.href = url;
		//anchor.target = '_blank';
		//anchor.click();
		//document.body.removeChild(anchor);
	}

	private static openLink(url: string, filename: string) {
		let a = document.createElement("a");
		// Firefox requires the link to be in the body
		document.body.appendChild(a);
		a.style.display = "none";
		a.href = url;
		a.download = filename;
		a.click();
		// Remove the link when done
		document.body.removeChild(a);
	}

	public static getFilenameFromContentDisposition(contentDisposition: string): string {
		const regex = /filename=(?<filename>[^,;]+);/g;
		const match = regex.exec(contentDisposition);

		let filename = "";
		if (match && match.groups) {
			filename = match.groups['filename'];
		} else {
			var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
			var matches = filenameRegex.exec(contentDisposition);
			if (matches != null && matches[1]) {
				filename = matches[1].replace(/['"]/g, "");
			}
		}
		return filename.replace(/"/g, "");
	}

	public static getFileMIMEType(fileName: string) {
		//file type extension
		let checkFileType = fileName.split(".").pop();
		let fileType;

		if (checkFileType == ".txt") {
			fileType = "text/plain";
		}
		if (checkFileType == ".pdf") {
			fileType = "application/pdf";
		}
		if (checkFileType == ".doc") {
			fileType = "application/vnd.ms-word";
		}
		if (checkFileType == ".docx") {
			fileType = "application/vnd.ms-word";
		}
		if (checkFileType == ".xls") {
			fileType = "application/vnd.ms-excel";
		}
		if (checkFileType == ".png") {
			fileType = "image/png";
		}
		if (checkFileType == ".jpg") {
			fileType = "image/jpeg";
		}
		if (checkFileType == ".jpeg") {
			fileType = "image/jpeg";
		}
		if (checkFileType == ".gif") {
			fileType = "image/gif";
		}
		if (checkFileType == ".csv") {
			fileType = "text/csv";
		}

		return fileType;
	}

	public static getYearList(startYear = 2015): number[] {
		var currentYear = new Date().getFullYear(),
			years = [];
		startYear = startYear || 2019;
		while (startYear <= currentYear) {
			years.push(startYear++);
		}

		return years;
	}

	public static getMonths(): any[] {
		var months = [
			{ text: "January", value: 1 },
			{ text: "February", value: 2 },
			{ text: "March", value: 3 },
			{ text: "April", value: 4 },
			{ text: "April", value: 4 },
			{ text: "May", value: 5 },
			{ text: "June", value: 6 },
			{ text: "July", value: 7 },
			{ text: "August", value: 8 },
			{ text: "September", value: 9 },
			{ text: "October", value: 10 },
			{ text: "November", value: 11 },
			{ text: "December", value: 12 },
		];

		return months;
	}
}
