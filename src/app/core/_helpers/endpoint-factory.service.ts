import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { mergeMap, switchMap, catchError } from 'rxjs/operators';

import { ConfigurationService } from './configuration.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class EndpointFactory {
	static readonly apiVersion: string = '1';

	private get tokenUrl() { return this.configurations.tokenUrl; }

	public get loginUrl() { return this.configurations.loginUrl; }

	private taskPauser!: Subject<any | null>;

	constructor(protected http: HttpClient, protected configurations: ConfigurationService, private injector: Injector,
		private router: Router

	) { }

	getLoginEndpoint<T>(userName: string, password: string): Observable<T> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');

		const params = new HttpParams()
			.append('userName', userName)
			.append('password', password);

		return this.http.post<T>(this.tokenUrl, { UserName: userName, Password: password }, { headers: httpHeaders });
	}

	getRequestHeaders(): { headers: HttpHeaders | { [header: string]: string | string[]; } } {
		const headers = new HttpHeaders({
			Authorization: 'Bearer ' + localStorage.getItem(environment.authTokenKey),
			'Content-Type': 'application/json',
			Accept: `application/vnd.iman.v${EndpointFactory.apiVersion}+json, application/json, text/plain, */*`,
			'App-Version': ConfigurationService.appVersion
		});

		return { headers };
	}

	getRequestFormUploadHeaders(): { headers: HttpHeaders | { [header: string]: string | string[]; } } {
		const headers = new HttpHeaders({
			Authorization: 'Bearer ' + localStorage.getItem(environment.authTokenKey),
			// 'Content-Type': 'multipart/form-data;',
			// 'Accept': `application/vnd.iman.v${EndpointFactory.apiVersion}+json, application/json, text/plain, */*`,
			'App-Version': ConfigurationService.appVersion
		});

		return { headers };
	}

	getDownloadRequestHeaders(): any {
		const headers = new HttpHeaders({
			Authorization: 'Bearer ' + localStorage.getItem(environment.authTokenKey),

			// 'Content-Type': 'multipart/form-data;',
			// 'Accept': `application/vnd.iman.v${EndpointFactory.apiVersion}+json, application/json, text/plain, */*`,
			'App-Version': ConfigurationService.appVersion
		});

		return {
			headers,
			reportProgress: true,
			responseType: 'blob',// as 'json',
			observe: 'response',
		};
	}

	handleError(error: { status: number; url: string; error: { error_description: any; }; }, continuation: () => Observable<any>) {
		if (error.status === 401 || error.url && error.url.toLowerCase().includes(this.loginUrl.toLowerCase())) {
			localStorage.removeItem(environment.authTokenKey);
			const redirect = this.loginUrl;
			this.router.navigate([redirect]);
			this.resumeTasks(false);
			return throwError((error.error && error.error.error_description) ? `session expired (${error.error.error_description})` : 'session expired');
		} else {
			return throwError(error);
		}
	}

	private pauseTask(continuation: () => Observable<any>) {
		if (!this.taskPauser) {
			this.taskPauser = new Subject();
		}

		return this.taskPauser.pipe(switchMap((continueOp: any) => {
			return continueOp ? continuation() : throwError('session expired');
		}));
	}

	private resumeTasks(continueOp: boolean) {
		setTimeout(() => {
			if (this.taskPauser) {
				this.taskPauser.next(continueOp);
				this.taskPauser.complete();
			}
		});
	}
}
