import { Injectable } from '@angular/core';

import { EnquiryFollowupsModel } from '../_models';
import { JxHttpService } from 'jx-ng-core';

@Injectable()
export class EnquiryFollowupsService {

	constructor(
		private http: JxHttpService,
	) { }

	createEnquiryFollowups<ICreateResponse>(followup: EnquiryFollowupsModel) {
		return this.http.postHttp$<ICreateResponse>(`/v1/marketing/enquiries/${followup.enquiryId}/followups`, followup, true, true);
	}

	getByEnquiryId(enquiryId: number) {
		return this.http.getHttp$<any>(`/v1/marketing/enquiries/${enquiryId}/followups`);
	}
}
