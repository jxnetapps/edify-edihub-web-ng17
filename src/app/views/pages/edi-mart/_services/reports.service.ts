import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationService, EndpointFactory } from '../../../../core/_helpers';


@Injectable()
export class EnquiryReportService {

	// API BASE URL
	private readonly API_BASEROUTE = `${this.configurations.baseUrl}/api/preadmissions/reports`;
	
	constructor(
		private http: HttpClient,
		private configurations: ConfigurationService,
		private endpointFactory: EndpointFactory,
	) { }

	getEnquiryCurrentStatus(employeeId: any): Observable<any> {
		return this.http.get<any>(`${this.API_BASEROUTE}/userwise-enquiry-type/0?employeeIds=`+employeeId, this.endpointFactory.getRequestHeaders());
	}

	getTop7DaysNewEnquiryTotalsDayWise(employeeId: any): Observable<any> {
		return this.http.get<any>(`${this.API_BASEROUTE}/last7days/0?employeeIds=`+employeeId, this.endpointFactory.getRequestHeaders());
	}

	getStatusConversionReport(employeeId: any): Observable<any> {
		return this.http.get<any>(`${this.API_BASEROUTE}/status-conversion/0?employeeIds=`+employeeId, this.endpointFactory.getRequestHeaders());
	}
}
