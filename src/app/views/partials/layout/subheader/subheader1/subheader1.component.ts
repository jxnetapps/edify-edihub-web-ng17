// Angular
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
// RxJS
import { BehaviorSubject, Subscription } from 'rxjs';
// Layout
import { Router } from '@angular/router';
import { SubheaderService } from '../../../../../core';
import { Breadcrumb, SubHeaderToolBar } from '../../../../../core/_base/layout/services/subheader.service';

@Component({
	selector: 'kt-subheader1',
	templateUrl: './subheader1.component.html',
	styleUrls: ['./subheader1.component.scss']
})
export class Subheader1Component implements OnInit, OnDestroy, AfterViewInit {
	// Public properties
	@Input()
	fluid: boolean = false;
	@Input()
	clear: boolean = false;

	today: number = Date.now();
	title: string = '';
	desc: string = '';

	showSubHeaderToolbar$ = new BehaviorSubject<boolean>(false);
	showToolBarAddBtn: boolean = false;
	showToolBarBackBtn: boolean = false;
	breadcrumbs: Breadcrumb[] = [];

	private toolBarAddButtonClick!:Function;
	private toolBarBackButtonClick!:Function;
	subHeaderToolBar!: SubHeaderToolBar;

	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param subheaderService: SubheaderService
	 */
	constructor(
		private router: Router,
		public subheaderService: SubheaderService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
	}

	/**
	 * After view init
	 */
	ngAfterViewInit(): void {
		this.subscriptions.push(this.subheaderService.title$.subscribe((bt: any) => {
			// breadcrumbs title sometimes can be undefined
			if (bt) {
				Promise.resolve(null).then(() => {
					this.title = bt.title;
					this.desc = bt.desc || '';
				});
			}
		}));

		this.subscriptions.push(this.subheaderService.breadcrumbs$.subscribe((bc: Breadcrumb[]) => {
			Promise.resolve(null).then(() => {
				this.breadcrumbs = bc;
			});
		}));


		this.subscriptions.push(this.subheaderService.toolBar$.subscribe((bc: SubHeaderToolBar) => {
			Promise.resolve(null).then(() => {
				//if(!bc){
				this.subHeaderToolBar = bc;
				this.showSubHeaderToolbar$.next(bc.showTooBar as boolean || bc.addButtonShow as boolean || bc.backButtonShow as boolean)
				this.showToolBarAddBtn = bc.addButtonShow as boolean;
				this.showToolBarBackBtn = bc.backButtonShow as boolean;

				this.toolBarAddButtonClick = bc.addButtonClick as Function;
				this.toolBarBackButtonClick = bc.backButtonClick as Function;
				//}
			});
		}));
	}

	onSubHeaderAddClicked() {
		this.subheaderService.subHeaderClick('add');
		if (this.subHeaderToolBar && this.subHeaderToolBar.addButtonPath) {
			this.router.navigateByUrl(this.subHeaderToolBar.addButtonPath);
		}
		else if (this.toolBarAddButtonClick)
			this.toolBarAddButtonClick();
	}

	onSubHeaderBackClicked() {
		this.subheaderService.subHeaderClick('back');

		if (this.subHeaderToolBar && this.subHeaderToolBar.backButtonPath) {
			this.router.navigateByUrl(this.subHeaderToolBar.backButtonPath);
		}
		else if (this.toolBarBackButtonClick) {
			this.toolBarBackButtonClick();
		}
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
}
