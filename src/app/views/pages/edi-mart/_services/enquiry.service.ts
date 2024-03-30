import { forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { EnquiriesModel } from '../_models';
import { EnquiryMailLogModel } from '../_models/EnquiryMailLogModel'
import { JxHttpService, IPagedList, ICreateResponse, IUpdateResponse, IDeleteResponse } from 'jx-ng-core';
import { QueryParamsModel } from '../../../../core/_base/crud';

@Injectable({
	providedIn: 'root'
})
export class EnquiryService {
	// API BASE URL
	private readonly API_BASE_ROUTE = `/v1/marketing/enquiries`;

	constructor(
		private http: JxHttpService,
	) { }

	findEnquiries(enquiryType: number, queryParams: QueryParamsModel) {
		const req = { ...queryParams, ...queryParams.filter };
		delete req.filter;
		return this.http.postHttp$<IPagedList>(`${this.API_BASE_ROUTE}/search`, req);
	}

	getUserEnquiryTypeStatusReport() {
		return this.http.getHttp$<any>(`${this.API_BASE_ROUTE}/enquiry-type-status-report`);
	}

	getPreRequisites() {
		const req = forkJoin({
			statusList: this.http.getHttp$<any>(`/v1/marketing/enquiry-status`),
			products: this.http.getHttp$<any>(`/v1/marketing/enquiry-products`),
			states: this.http.getHttp$<any>(`/v1/masters/states`)
		});

		return req;
	}

	createEnquiry(enquiries: EnquiriesModel) {
		return this.http.postHttp$<ICreateResponse>(`${this.API_BASE_ROUTE}`, enquiries, true, true);
	}

	updateEnquiry(enquiry: EnquiriesModel) {
		return this.http.putHttp$<IUpdateResponse>(`${this.API_BASE_ROUTE}/${enquiry.enquiryId}`, enquiry);
	}

	deleteEnquiries(enquiryIds: number[]) {
		return this.http.deleteHttp$<IDeleteResponse>(`${this.API_BASE_ROUTE}/${enquiryIds}`, {});
	}

	changeEnquiriesStatus(status: number, enquiryIds: number[]) {
		return this.http.postHttp$<IUpdateResponse>(`${this.API_BASE_ROUTE}/changestatus/${status}/${enquiryIds}`, {});
	}

	getEnquiriesById(enquiryId: number, showLoading: boolean = true) {
		return this.http.getHttp$<EnquiriesModel>(`${this.API_BASE_ROUTE}/${enquiryId}`, showLoading);
	}

	getEnquiryStatus() {
		return this.http.getHttp$<any>(`/v1/marketing/enquiry-status`)
	}

	addMaterial$(material: any) {
		const formToSend = this.http.toFormData(material, 'files');
		return this.http.postFormHttp$<any>(`/v1/marketing/materials`, formToSend, true, true)
	}

	updateMaterial$(id: string, material: any) {
		const formToSend = this.http.toFormData(material, 'files');
		return this.http.putFormHttp$<any>(`/v1/marketing/materials/${id}`, formToSend, true, true)
	}

	addMailLog$(enquiryId: number, mailLog: EnquiryMailLogModel) {
		return this.http.postHttp$<ICreateResponse>(`/v1/marketing/enquiries/${enquiryId}/mails`, mailLog, true, true)
	}
}
