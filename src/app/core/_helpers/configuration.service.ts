import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Utilities } from './utilities';
import { environment } from '../../../environments/environment';


@Injectable()
export class ConfigurationService {

  constructor() {

  }

  public static readonly appVersion: string = '2.7.2';

  // ***Specify default configurations here***
  public static readonly defaultLanguage: string = 'en';
  public static readonly defaultHomeUrl: string = '/';
  public static readonly defaultThemeId: number = 1;
  public static readonly defaultShowDashboardStatistics: boolean = true;
  public static readonly defaultShowDashboardNotifications: boolean = true;
  public static readonly defaultShowDashboardTodo: boolean = false;
  public static readonly defaultShowDashboardBanner: boolean = true;

  public baseUrl = environment.apiUrl || Utilities.baseUrl();
  public tokenUrl = environment.tokenUrl || environment.apiUrl || Utilities.baseUrl();
  public loginUrl = environment.loginUrl;
  public fallbackBaseUrl = 'http://quickapp.ebenmonney.com';

  private onConfigurationImported: Subject<boolean> = new Subject<boolean>();
	configurationImported$ = this.onConfigurationImported.asObservable();

  public getDefaultImage(path:string){
    return Utilities.isNullOrEmpty(path) ? './assets/media/users/default.jpg': `${this.baseUrl}/${path}`; 
  }
}
