// Angular
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

// RxJS
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../../../environments/environment';
import { KtDialogService } from '../../layout';

/**
 * More information there => https://medium.com/@MetonymyQT/angular-http-interceptors-what-are-they-and-how-to-use-them-52e060321088
 */
@Injectable()
export class InterceptService implements HttpInterceptor {
	constructor(private router: Router, private dialog: KtDialogService) { }

	// intercept request and add token
	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		// modify request
		// console.log('----request----');
		// const token = localStorage.getItem(environment.authTokenKey);
		// if (token) {
		// 	request = request.clone({
		// 		setHeaders: {
		// 			Authorization: `Bearer ${localStorage.getItem(environment.authTokenKey)}`
		// 		}
		// 	});
		// }
		// if (!request.headers.has('Content-Type')) {
		// 	request = request.clone({
		// 		setHeaders: {
		// 			'content-type': 'application/json'
		// 		}
		// 	});
		// }
		// request = request.clone({
		// 	headers: request.headers.set('Accept', 'application/json')
		// });
		// console.log(request);
		// console.log('--- end of request---');

		return next.handle(request).pipe(
			tap(
				(event: any) => {
					if (event instanceof HttpResponse) {
						// console.log('all looks good');
						// http response status code
						// console.log(event.status);
					}
				},
				(error: { status: number; }) => {
					// http response status code
					if (this.dialog.checkIsShown()) {
						this.dialog.hide();
					}
					//console.log(`Error response:${JSON.stringify(error)}`);
					// console.error('status code:');
					// tslint:disable-next-line:no-debugger
					// console.error(error.status);
					// console.error(error.message);
					if (this.router.url !== '/auth/login' && error.status === 401) {
						localStorage.removeItem(environment.authTokenKey);
						this.router.navigate(['/auth/login']);
					}
					else if (error.status === 0) {
						this.dialog.show('Please check your internet connection.');
					}
					// console.log('--- end of response---');
				}
			)
		);
	}
}
