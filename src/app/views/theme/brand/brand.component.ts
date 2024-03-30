// Angular
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { currentUser, User } from '../../../core/auth';
import { AppState } from '../../../core/reducers';
// Layout
import { HtmlClassService } from '../html-class.service';
import { ToggleOptions, LayoutConfigService } from '../../../core/_base/layout';

@Component({
	selector: 'kt-brand',
	templateUrl: './brand.component.html',
	styleUrls: ['./brand.component.scss'],
})
export class BrandComponent implements OnInit, AfterViewInit {
	// Public properties
	headerLogo!: string;
	headerStickyLogo!: string;
	user$!: Observable<User>; 
	toggleOptions: ToggleOptions = {
		target: 'body',
		targetState: 'kt-aside--minimize',
		togglerState: 'kt-aside__brand-aside-toggler--active'
	};

	/**
	 * Component constructor
	 *
	 * @param layoutConfigService: LayoutConfigService
	 * @param htmlClassService: HtmlClassService
	 */
	constructor(private store: Store<AppState>,
		private layoutConfigService: LayoutConfigService, 
		public htmlClassService: HtmlClassService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.headerLogo = this.layoutConfigService.getLogo();
		this.headerStickyLogo = this.layoutConfigService.getStickyLogo();
		this.user$ = this.store.pipe(select(currentUser));
	}

	/**
	 * On after view init
	 */
	ngAfterViewInit(): void {
	}
}
