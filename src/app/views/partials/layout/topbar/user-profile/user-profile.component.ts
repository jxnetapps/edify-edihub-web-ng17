// Angular
import { Component, Input, OnInit } from "@angular/core";
// RxJS
import { Observable } from "rxjs";
// NGRX
import { select, Store } from "@ngrx/store";
// State
import { AppState } from "../../../../../core/reducers";
import { currentUser, Logout, User } from "../../../../../core/auth";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
	selector: "kt-user-profile",
	templateUrl: "./user-profile.component.html",
})
export class UserProfileComponent implements OnInit {
	// Public properties
	user$!: Observable<User>; 

	@Input() avatar: boolean = true;
	@Input() greeting: boolean = true;
	@Input()
	badge!: boolean;
	@Input()
	icon!: boolean;

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 */
	constructor(private store: Store<AppState>,
		private activatedRoute: ActivatedRoute,
		private router: Router) {}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.user$ = this.store.pipe(select(currentUser));
	}

	/**
	 * Log out
	 */
	logout() {
		this.store.dispatch(new Logout());
	}

	gotoProfile = (user: any) => {
		if (user.roles.includes(4) || user.roles.includes(5)) {
			//parent
			const url=`/student-management/details/0/${user.id}/${user.fullname.replace(/ /g, "-").toLowerCase()}`;
			this.router.navigateByUrl(url);
			//this.router.navigate([`/student-management/students/details`, 0, user.id, user.fullname.replace(/ /g, "-").toLowerCase()], { relativeTo: this.activatedRoute });
			//this.router.navigate([`/student-management/students/details`, user.id], { relativeTo: this.activatedRoute });
		} else {
			//employee
			this.router.navigate(['/hrm/employees/details', user.id], { relativeTo: this.activatedRoute });
		}
	};
}
