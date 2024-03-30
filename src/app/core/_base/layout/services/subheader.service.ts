// Angular
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// RxJS
import { BehaviorSubject, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
// Object-Path
import * as objectPath from 'object-path';
// Services
import { PageConfigService } from './page-config.service';
import { MenuConfigService } from './menu-config.service';

export interface Breadcrumb {
	title: string;
	page: string | any;
	queryParams?: any;
}

export interface BreadcrumbTitle {
	title: string;
	desc?: string;
}

export interface SubHeaderToolBar {
	showTooBar?: boolean;

	addButtonShow?: boolean;
	addButtonPath?: string;
	addButtonClick?: Function;

	backButtonShow?: boolean;
	backButtonPath?: string;
	backButtonClick?: Function;
	//addButtonClick?: () => void;
}

@Injectable()
export class SubheaderService {
	// Public properties
	title$: BehaviorSubject<BreadcrumbTitle> = new BehaviorSubject<BreadcrumbTitle>({ title: '', desc: '' });
	breadcrumbs$: BehaviorSubject<Breadcrumb[]> = new BehaviorSubject<Breadcrumb[]>([]);
	disabled$: Subject<boolean> = new Subject<boolean>();

	toolBar$: BehaviorSubject<SubHeaderToolBar> = new BehaviorSubject<SubHeaderToolBar>(
		{ showTooBar: false, addButtonShow: false, addButtonPath: '', backButtonPath: '', backButtonShow: false }
	);

	// Private properties
	private manualBreadcrumbs: any = {};
	private appendingBreadcrumbs: any = {};
	private manualTitle: any = {};

	private asideMenus: any;
	private headerMenus: any;
	private pageConfig: any;

	/**
	 * Service Constructor
	 *
	 * @param router: Router
	 * @param pageConfigService: PageConfigServie
	 * @param menuConfigService: MenuConfigService
	 */
	constructor(
		private router: Router,
		private pageConfigService: PageConfigService,
		private menuConfigService: MenuConfigService) {

		const initBreadcrumb = () => {
			// get updated title current page config
			this.pageConfig = this.pageConfigService.getCurrentPageConfig();

			this.headerMenus = objectPath.default(this.menuConfigService.getMenus()).get('header');
			this.asideMenus = objectPath.default(this.menuConfigService.getMenus()).get('aside');

			// update breadcrumb on initial page load
			this.updateBreadcrumbs();

			if (objectPath.default(this.manualTitle).get(this.router.url)) {
				this.setTitle(this.manualTitle[this.router.url]);
			} else {
				// get updated page title on every route changed
				this.title$.next(objectPath.default(this.pageConfig).get('page'));

				// subheader enable/disable
				const hideSubheader = objectPath.default(this.pageConfig).get('page.subheader');
				this.disabled$.next(typeof hideSubheader !== 'undefined' && !hideSubheader);

				if (objectPath.default(this.manualBreadcrumbs).get(this.router.url)) {
					// breadcrumbs was set manually
					this.setBreadcrumbs(this.manualBreadcrumbs[this.router.url]);
				} else {
					// get updated breadcrumbs on every route changed
					this.updateBreadcrumbs();
					// breadcrumbs was appended before, reuse it for this page
					if (objectPath.default(this.appendingBreadcrumbs).get(this.router.url)) {
						this.appendBreadcrumbs(this.appendingBreadcrumbs[this.router.url]);
					}
				}
			}
		};

		initBreadcrumb();

		// subscribe to router events
		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(initBreadcrumb);
	}

	/**
	 * Update breadCrumbs
	 */
	updateBreadcrumbs() {
		// get breadcrumbs from header menu
		let breadcrumbs = this.getBreadcrumbs(this.headerMenus);
		// if breadcrumbs empty from header menu
		if (breadcrumbs.length === 0) {
			// get breadcrumbs from aside menu
			breadcrumbs = this.getBreadcrumbs(this.asideMenus);
		}

		if (
			// if breadcrumb has only 1 item
			breadcrumbs.length === 1 &&
			// and breadcrumb title is same as current page title
			breadcrumbs[0].title.indexOf(objectPath.default(this.pageConfig).get('page.title')) !== -1) {
			// no need to display on frontend
			breadcrumbs = [];
		}

		this.breadcrumbs$.next(breadcrumbs);
	}

	/**
	 * Manually set full breadcrumb paths
	 */
	setBreadcrumbs(breadcrumbs: Breadcrumb[] | any[]) {
		this.manualBreadcrumbs[this.router.url] = breadcrumbs;
		this.breadcrumbs$.next(breadcrumbs);
	}

	/**
	 * Append breadcrumb to the last existing breadcrumbs
	 * @param breadcrumbs
	 */
	appendBreadcrumbs(breadcrumbs: Breadcrumb[] | any[]) {
		this.appendingBreadcrumbs[this.router.url] = breadcrumbs;
		const prev = this.breadcrumbs$.getValue();
		this.breadcrumbs$.next(prev.concat(breadcrumbs));
	}

	/**
	 * Get breadcrumbs from menu items
	 * @param menus
	 */
	getBreadcrumbs(menus: any) {
		let url = this.pageConfigService.cleanUrl(this.router.url);
		url = url.replace(new RegExp(/\./, 'g'), '/');

		const breadcrumbs: any[] = [];
		const menuPath = this.getPath(menus, url) || [];
		menuPath.forEach(key => {
			menus = menus[key];
			if (typeof menus !== 'undefined' && menus.title) {
				breadcrumbs.push(menus);
			}
		});

		return breadcrumbs;
	}

	/**
	 * Set title
	 *
	 * @param title: string
	 */
	setTitle(title: string, description: string = '') {
		this.manualTitle[this.router.url] = title;
		this.title$.next({ title: title, desc: description });
	}

	setHeader(breadcrumbs: Breadcrumb[] | any[], title: string, description: string = '') {

		this.manualBreadcrumbs[this.router.url] = breadcrumbs;
		this.breadcrumbs$.next(breadcrumbs);

		this.manualTitle[this.router.url] = title;
		this.title$.next({ title: title, desc: description });
	}

	/**
	 * Get object path by value
	 * @param obj
	 * @param value
	 */
	getPath(obj: any, value: string) {
		if (typeof obj !== 'object') {
			return;
		}
		const path: string[] = [];
		let found = false;

		const search = (haystack: { [x: string]: any; }) => {
			// tslint:disable-next-line:forin
			for (const key in haystack) {
				path.push(key);
				if (haystack[key] === value) {
					found = true;
					break;
				}
				if (typeof haystack[key] === 'object') {
					search(haystack[key]);
					if (found) {
						break;
					}
				}
				path.pop();
			}
		};

		search(obj);
		return path;
	}

	// shared data service
	private headerSubClickedSource = new BehaviorSubject({});
	subHeaderClicked = this.headerSubClickedSource.asObservable();

	subHeaderClick(buttonType: any) {
		this.headerSubClickedSource.next(buttonType);
		this.clearSubHeaderClick();
	}

	clearSubHeaderClick() {
		this.headerSubClickedSource.next({});
	}

	setToolBarBackButton(options: { path?: string, click?: Function }) {
		const toolToUpdate = this.toolBar$.value;
		this.toolBar$.next({
			...toolToUpdate,
			backButtonShow: true,
			//...(options.path != undefined && { backButtonPath: options.path }),
			backButtonPath: options.path,
			backButtonClick: options.click
		});
		
		//this.resetTooBar();
		//this.toolBar$.next({ backButtonShow: true, backButtonPath: options.path, backButtonClick: options.click });
	}

	setToolBarAddButton(options: { path?: string, click?: Function }) {
		const toolToUpdate = this.toolBar$.value;
		this.toolBar$.next({
			...toolToUpdate,
			addButtonShow: true,
			//...(options.path != undefined && { backButtonPath: options.path }),
			addButtonPath: options.path,
			addButtonClick: options.click
		});
		//this.resetTooBar();
		//this.toolBar$.next({ addButtonShow: true, addButtonPath: options.path, addButtonClick: options.click });
	}

	setToolBar(options: { addButtonPath?: string, addClick?: Function, backButtonPath?: string, backClick?: Function }) {
		this.toolBar$.next({
			addButtonShow: true,
			addButtonPath: options.addButtonPath,
			addButtonClick: options.addClick,

			backButtonShow: true,
			backButtonPath: options.backButtonPath,
			backButtonClick: options.backClick
		});
	}

	resetTooBar() {
		this.toolBar$.next({
			addButtonShow: false,
			addButtonPath: '',
			backButtonShow: false,
			backButtonPath: '',
		});
	}
}
