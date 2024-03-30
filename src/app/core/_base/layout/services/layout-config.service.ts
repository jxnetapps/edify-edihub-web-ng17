// Angular
import { Injectable } from '@angular/core';
// RxJS
import { Subject } from 'rxjs';
// Object-Path
import * as objectPath from 'object-path';
// Lodash
import { merge } from 'lodash';
// Models
import { LayoutConfigModel } from '../models/layout-config.model';

@Injectable()
export class LayoutConfigService {
	// Public properties
	onConfigUpdated$: Subject<LayoutConfigModel>;
	layoutConfig!: LayoutConfigModel;

	/**
	 * Servcie constructor
	 */
	constructor() {
		// register on config changed event and set default config
		this.onConfigUpdated$ = new Subject();
	}

	/**
	 * Save layout config to the local storage
	 * @param layoutConfig
	 */
	saveConfig(layoutConfig: LayoutConfigModel): void {
		if (layoutConfig) {
			window.localStorage.setItem('layoutConfig', JSON.stringify(layoutConfig));
		}
	}

	/**
	 * Get layout config from local storage
	 */
	getSavedConfig() {
		const config = window.localStorage.getItem('layoutConfig') as string;
		try {
			return JSON.parse(config);
		} catch (e) {
		}
	}

	/**
	 * Remove saved layout config and revert back to default
	 */
	resetConfig(): void {
		window.localStorage.removeItem('layoutConfig');
	}

	/**
	 * Get all config or by object path
	 * @param path | object path separated by dot
	 */
	getConfig(path?: string): LayoutConfigModel | any {
		// merge default layout config with the saved config from layout storage
		// @todo; known issue; viewing 2 or more demos at the time in different browser's tabs, can cause conflict to the layout config
		this.layoutConfig = this.getSavedConfig();

		if (path) {
			// if path is specified, get the value within object
			return this.getObjectValue(path);
		}

		return this.layoutConfig;
	}

	/**
	 * Set existing config with a new value
	 * @param value
	 * @param save
	 */
	setConfig(value: any, save?: boolean): void {
		this.layoutConfig = merge(this.layoutConfig, value);

		if (save) {
			this.saveConfig(this.layoutConfig);
		}

		// fire off an event that all subscribers will listen
		this.onConfigUpdated$.next(this.layoutConfig);
	}

	/**
	 * Get brand logo
	 */
	getLogo(): string {
		const menuAsideLeftSkin = this.getObjectValue('brand.self.skin');
		// set brand logo
		const logoObject = this.getObjectValue('self.logo');

		let logo;
		if (typeof logoObject === 'string') {
			logo = logoObject;
		}
		if (typeof logoObject === 'object') {
			logo = this.getObjectValue(menuAsideLeftSkin + '');
		}
		if (typeof logo === 'undefined') {
			try {
				const logos = this.getObjectValue('self.logo');
				logo = logos[Object.keys(logos)[0]];
			} catch (e) {
			}
		}
		return logo;
	}

	/**
	 * Returns sticky logo
	 */
	getStickyLogo(): string {
		let logo = this.getObjectValue('self.logo.sticky');
		if (typeof logo === 'undefined') {
			logo = this.getLogo();
		}
		return logo + '';
	}

	/**
	 * Initialize layout config
	 * @param config
	 */
	loadConfigs(config: LayoutConfigModel) {
		this.layoutConfig = this.getSavedConfig();
		// use saved config as priority, or load new config if demo does not matched
		if (!this.layoutConfig || this.getObjectValue('demo') !== config.demo) {
			this.layoutConfig = config;
		}
		this.saveConfig(this.layoutConfig);
	}

	/**
	 * Reload current layout config to the state of latest saved config
	 */
	reloadConfigs(): LayoutConfigModel {
		this.layoutConfig = this.getSavedConfig();
		this.onConfigUpdated$.next(this.layoutConfig);
		return this.layoutConfig;
	}

	getObjectValue(path: string) {
		return objectPath.default(this.layoutConfig).get(path)
	}
}
