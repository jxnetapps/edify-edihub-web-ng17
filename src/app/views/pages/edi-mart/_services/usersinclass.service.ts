import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { QueryParamsModel, QueryResultsModel, ResponseModel } from '../../../../core/_base/crud';
import { ConfigurationService, EndpointFactory } from '../../../../core/_helpers';

import { UsersInClassModel } from '../_models';

@Injectable()
export class UsersInClassService {

	// API BASE URL
	private readonly API_BASEROUTE = `${this.configurations.baseUrl}/api/preadmissions/usersinclass`;
	
	constructor(
		private http: HttpClient,
		private configurations: ConfigurationService,
		private endpointFactory: EndpointFactory,
	) { }

	getUserByClassId(classId: number): Observable<UsersInClassModel> {
		return this.http.get<UsersInClassModel>(`${this.API_BASEROUTE}/class/${classId}`, this.endpointFactory.getRequestHeaders());
	}

	// findUsersInClasss(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
	// 	return this.http.post<QueryResultsModel>(`${this.API_BASEROUTE}/find`, queryParams, this.endpointFactory.getRequestHeaders());
	// }

	// createUsersInClass(usersInClass: UsersInClassModel): Observable<any> {
	// 	return this.http.post<ResponseModel>(`${this.API_BASEROUTE}/create`, usersInClass, this.endpointFactory.getRequestHeaders());
	// }

	// updateUsersInClass(usersInClass: UsersInClassModel): Observable<ResponseModel> {
	// 	return this.http.put<ResponseModel>(`${this.API_BASEROUTE}/update`, usersInClass, this.endpointFactory.getRequestHeaders());
	// }

	// deleteUsersInClass(ids: number[]) {
	// 	return this.http.delete<ResponseModel>(`${this.API_BASEROUTE}/delete/${ids}`, this.endpointFactory.getRequestHeaders());
	// }

	// changeUsersInClassStatus(status: number, ids: number[]) {
	// 	return this.http.get<ResponseModel>(`${this.API_BASEROUTE}/changestatus/${status}/${ids}`, this.endpointFactory.getRequestHeaders());
	// }

	// getUsersInClassById(id: number): Observable<UsersInClassModel> {
	// 	return this.http.get<UsersInClassModel>(`${this.API_BASEROUTE}/id/${id}`, this.endpointFactory.getRequestHeaders());
	// }
}
