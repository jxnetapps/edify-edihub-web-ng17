// Angular
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	OnInit,
	Renderer2
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// RxJS
import { filter } from 'rxjs/operators';
// Object-Path
import * as objectPath from 'object-path';

// HTML Class
import { HtmlClassService } from '../../html-class.service';
import { select, Store } from '@ngrx/store';
import { currentUser, User } from '../../../../core/auth';
import { AppState } from '../../../../core/reducers';
import { Observable } from 'rxjs';
import { MenuOptions, OffcanvasOptions, MenuHorizontalService, MenuConfigService, LayoutConfigService } from '../../../../core/_base/layout';

@Component({
	selector: 'kt-menu-horizontal',
	templateUrl: './menu-horizontal.component.html',
	styleUrls: ['./menu-horizontal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuHorizontalComponent implements OnInit, AfterViewInit {
	// Public properties
	currentRouteUrl: any = '';

	rootArrowEnabled: boolean = false;

	menuOptions: MenuOptions = {
		submenu: {
			desktop: 'dropdown',
			tablet: 'accordion',
			mobile: 'accordion'
		},
		accordion: {
			slideSpeed: 200, // accordion toggle slide speed in milliseconds
			expandAll: false // allow having multiple expanded accordions in the menu
		},
		dropdown: {
			timeout: 50
		}
	};

	offcanvasOptions: OffcanvasOptions = {
		overlay: true,
		baseClass: 'kt-header-menu-wrapper',
		closeBy: 'kt_header_menu_mobile_close_btn',
		toggleBy: {
			target: 'kt_header_mobile_toggler',
			state: 'kt-header-mobile__toolbar-toggler--active'
		}
	};

	user$!: Observable<User>; 

	/**
	 * Component Conctructor
	 *
	 * @param el: ElementRef
	 * @param htmlClassService: HtmlClassService
	 * @param menuHorService: MenuHorService
	 * @param menuConfigService: MenuConfigService
	 * @param layoutConfigService: LayouConfigService
	 * @param router: Router
	 * @param render: Renderer2
	 * @param cdr: ChangeDetectorRef
	 */
	constructor(
		private el: ElementRef,
		public htmlClassService: HtmlClassService,
		public menuHorService: MenuHorizontalService,
		private menuConfigService: MenuConfigService,
		private layoutConfigService: LayoutConfigService,
		private router: Router,
		private render: Renderer2,
		private cdr: ChangeDetectorRef,
		private store: Store<AppState>,
	) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * After view init
	 */
	ngAfterViewInit(): void {
	}

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.rootArrowEnabled = this.layoutConfigService.getConfig('header.menu.self.root-arrow');

		this.currentRouteUrl = this.router.url;
		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(() => {
				this.currentRouteUrl = this.router.url;
				this.cdr.markForCheck();
			});

			// this.menuHorService.menuList$.subscribe(x=>{
			// 	console.log(x)
			// })

		this.user$ = this.store.pipe(select(currentUser));
	}

	/**
	 * Return Css Class Name
	 * @param item: any
	 */
	getItemCssClasses(item: any) {
		let classes = 'kt-menu__item';

		if (objectPath.default(item).get('submenu')) {
			classes += ' kt-menu__item--submenu';
		}

		if (!item.submenu && this.isMenuItemIsActive(item)) {
			classes += ' kt-menu__item--active kt-menu__item--here';
		}

		if (item.submenu && this.isMenuItemIsActive(item)) {
			classes += ' kt-menu__item--open kt-menu__item--here';
		}

		if (objectPath.default(item).get('resizer')) {
			classes += ' kt-menu__item--resize';
		}

		const menuType = objectPath.default(item).get('submenu.type') || 'classic';
		if ((objectPath.default(item).get('root') && menuType === 'classic')
			|| parseInt(objectPath.default(item).get('submenu.width'), 10) > 0) {
			classes += ' kt-menu__item--rel';
		}

		const customClass = objectPath.default(item).get('custom-class');
		if (customClass) {
			classes += ' ' + customClass;
		}

		if (objectPath.default(item).get('icon-only')) {
			classes += ' kt-menu__item--icon-only';
		}

		return classes;
	}

	/**
	 * Returns Attribute SubMenu Toggle
	 * @param item: any
	 */
	getItemAttrSubmenuToggle(item: any) {
		let toggle = 'hover';
		if (objectPath.default(item).get('toggle') === 'click') {
			toggle = 'click';
		} else if (objectPath.default(item).get('submenu.type') === 'tabs') {
			toggle = 'tabs';
		} else {
			// submenu toggle default to 'hover'
		}

		return toggle;
	}

	/**
	 * Returns Submenu CSS Class Name
	 * @param item: any
	 */
	getItemMenuSubmenuClass(item: any) {
		let classes = '';

		const alignment = objectPath.default(item).get('alignment') || 'right';

		if (alignment) {
			classes += ' kt-menu__submenu--' + alignment;
		}

		const type = objectPath.default(item).get('type') || 'classic';
		if (type === 'classic') {
			classes += ' kt-menu__submenu--classic';
		}
		if (type === 'tabs') {
			classes += ' kt-menu__submenu--tabs';
		}
		if (type === 'mega') {
			if (objectPath.default(item).get('width')) {
				classes += ' kt-menu__submenu--fixed';
			}
		}

		if (objectPath.default(item).get('pull')) {
			classes += ' kt-menu__submenu--pull';
		}

		return classes;
	}

	/**
	 * Check Menu is active
	 * @param item: any
	 */
	isMenuItemIsActive(item: any): boolean {
		if (item.submenu) {
			return this.isMenuRootItemIsActive(item);
		}

		if (!item.page) {
			return false;
		}

		return this.currentRouteUrl.indexOf(item.page) !== -1;
	}

	/**
	 * Check Menu Root Item is active
	 * @param item: any
	 */
	isMenuRootItemIsActive(item: any): boolean {
		if (item.submenu.items) {
			for (const subItem of item.submenu.items) {
				if (this.isMenuItemIsActive(subItem)) {
					return true;
				}
			}
		}

		if (item.submenu.columns) {
			for (const subItem of item.submenu.columns) {
				if (this.isMenuItemIsActive(subItem)) {
					return true;
				}
			}
		}

		if (typeof item.submenu[Symbol.iterator] === 'function') {
			for (const subItem of item.submenu) {
				const active = this.isMenuItemIsActive(subItem);
				if (active) {
					return true;
				}
			}
		}

		return false;
	}
}
