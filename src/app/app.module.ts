// Angular
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
//import { OverlayModule } from '@angular/cdk/overlay';
// Angular in memory
// Perfect Scroll bar
import { JX_PERFECT_SCROLLBAR_CONFIG, JxPerfectScrollbarModule } from 'jx-perfect-scrollbar';
import { JxPerfectScrollbarConfigInterface } from 'jx-perfect-scrollbar';

// SVG inline
import { InlineSVGModule } from 'ng-inline-svg-2';
// NGX Permissions
import { NgxPermissionsModule } from 'ngx-permissions';
// NGRX
// State
// Copmponents
import { AppComponent } from './app.component';
// Modules
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { ThemeModule } from "./views/theme/theme.module";

// Partials
import { PartialsModule } from './views/partials/partials.module';
// Layout Services
import {
	KtDialogService,
	LayoutConfigService,
	LayoutRefService,
	MenuAsideService,
	MenuConfigService,
	MenuHorizontalService,
	PageConfigService,
	SplashScreenService,
	SubheaderService
} from './core/_base/layout';
// Auth
import { AuthService } from './core/auth';
// CRUD
import { HttpUtilsService, LayoutUtilsService, TypesUtilsService } from './core/_base/crud';
// Config
import { LayoutConfig } from './core/_config/layout.config';


import { ConfigurationService, EndpointFactory } from './core/_helpers';
//import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './core/shared/material.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './core/reducers';
import { AuthModule } from './views/pages/auth/auth.module';

//import { JxNgFeedbackModule } from 'jx-ng-feedback'
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { JxNgCoreModule } from 'jx-ng-core';
import { environment } from '../environments/environment';
import { CommonModule } from '@angular/common';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: JxPerfectScrollbarConfigInterface = {
	wheelSpeed: 0.5,
	swipeEasing: true,
	minScrollbarLength: 40,
	maxScrollbarLength: 300,
  //suppressScrollX: true
};

export function initializeLayoutConfig(appConfig: LayoutConfigService) {
	// initialize app by loading default demo layout config
	return () => {
		if (appConfig.getConfig() === null) {
			appConfig.loadConfigs(new LayoutConfig().configs);
		}
	};
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPermissionsModule.forRoot(),
    PartialsModule,
    CoreModule,
    OverlayModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    StoreDevtoolsModule.instrument(),
    AuthModule.forRoot(),
    TranslateModule.forRoot(),
    MatProgressSpinnerModule,
    InlineSVGModule.forRoot(),
    ThemeModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    JxNgCoreModule.forRoot({
      baseApiUrl: environment.apiUrl,
      appVersion: 'v.3.0.1',
      authTokenKey: `${environment.appVersion}-${environment.authTokenKey}`,
      azureStorageConfig: {
        sasToken: environment.azure.sasToken,
        storageAccountName: environment.azure.storageAccountName,
        storageContainerName: environment.azure.storageContainerName
      }
    }),
    JxPerfectScrollbarModule
  ],
  providers: [
    //provideClientHydration(),
    provideAnimations(),
    AuthService,
    LayoutConfigService,
    LayoutRefService,
    MenuConfigService,
    PageConfigService,
    KtDialogService,
    SplashScreenService,
    {
      provide: JX_PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      // layout config initializer
      provide: APP_INITIALIZER,
      useFactory: initializeLayoutConfig,
      deps: [LayoutConfigService], multi: true
    },
    // {
    // 	provide: HIGHLIGHT_OPTIONS,
    // 	useValue: {languages: hljsLanguages}
    // },
    // template services
    SubheaderService,
    MenuHorizontalService,
    MenuAsideService,
    HttpUtilsService,
    TypesUtilsService,
    LayoutUtilsService,
    ConfigurationService,
    EndpointFactory
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
