// Angular
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// RxJS
import { filter, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { defer, Observable, of } from 'rxjs';
// NGRX
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
// Auth actions
import { AuthActionTypes, Login, Logout, Register, UserLoaded, UserRequested } from '../_actions/auth.actions';
import { AuthService } from '../_services/index';
import { AppState } from '../../reducers';
import { environment } from '../../../../environments/environment';
import { isUserLoaded } from '../_selectors/auth.selectors';
import { AppDBkeys } from '../../_helpers/db-keys';

@Injectable()
export class AuthEffects {
    
    login$ : any = createEffect((): any =>  this.actions$.pipe(
        ofType<Login>(AuthActionTypes.Login),
        tap((action: { payload: { authToken: string; }; }) => {
            localStorage.setItem(environment.authTokenKey, action.payload.authToken);
            this.store.dispatch(new UserRequested());
        }),
    ))

    //@Effect({dispatch: false})
    logout$ : any = createEffect((): any =>  this.actions$.pipe(
        ofType<Logout>(AuthActionTypes.Logout),
        tap(() => {
            localStorage.removeItem(AppDBkeys.CURRENT_USER_ROLE);
            localStorage.removeItem(AppDBkeys.DEFAULT_ACADEMICYEARID);
            localStorage.removeItem(AppDBkeys.CURRENT_USER);
            localStorage.removeItem(environment.authTokenKey);
            this.router.navigate(['/auth/login'], {queryParams: {returnUrl: this.returnUrl}});
        })
    ))

    //@Effect({dispatch: false})
    register$ : any = createEffect((): any =>  this.actions$.pipe(
        ofType<Register>(AuthActionTypes.Register),
        tap((action: { payload: { authToken: string; }; }) => {
            localStorage.setItem(environment.authTokenKey, action.payload.authToken);
        })
    ))

    //@Effect({dispatch: false})
    loadUser$ : any = createEffect((): any =>  this.actions$
    .pipe(
        ofType<UserRequested>(AuthActionTypes.UserRequested),
        withLatestFrom(this.store.pipe(select(isUserLoaded))),
        filter(([action, _isUserLoaded]) => !_isUserLoaded),
        mergeMap(([action, _isUserLoaded]) => this.auth.getUserByToken()),
        tap((_user: any) => {
            if (_user) {
                this.store.dispatch(new UserLoaded({ user: _user }));
            } else {
                this.store.dispatch(new Logout());
            }
        })
      ))

    //@Effect()
    init$: any = createEffect((): any =>  defer(() => {
        const userToken = localStorage.getItem(environment.authTokenKey);
        let observableResult = of({type: 'NO_ACTION'});
        if (userToken) {
            observableResult = of(new Login({  authToken: userToken }));
        }
        return observableResult;
    }))

    private returnUrl!: string;

    constructor(private actions$: Actions,
                private router: Router,
                private auth: AuthService,
                private store: Store<AppState>) {

		this.router.events.subscribe((event: any) => {
			if (event instanceof NavigationEnd) {
				this.returnUrl = event.url;
			}
		});
	}
}
