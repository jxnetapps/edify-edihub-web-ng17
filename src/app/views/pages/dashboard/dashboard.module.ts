// Angular
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';// Material
import { JxPerfectScrollbarModule } from 'jx-perfect-scrollbar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxPermissionsModule } from 'ngx-permissions';

// Core Module
import { PartialsModule } from '../../partials/partials.module';
import { DashboardComponent } from './dashboard.component';
import { EshSharedModule } from '../_shared/eshshared.module';
import { TranslationService } from '../../../core/_base/layout';
import { CoreModule } from '../../../core/core.module';
import { MaterialModule } from '../../../core/shared/material.module';
import { JxNgCoreModule } from 'jx-ng-core';

@NgModule({
	imports: [
		CommonModule,
		PartialsModule,
		CoreModule,
		JxPerfectScrollbarModule,
		NgxPermissionsModule.forChild(),
		RouterModule.forChild([
			{
				path: '',
				component: DashboardComponent
			},
		]),
		TranslateModule.forChild(),
		NgxChartsModule,
		MaterialModule,
		EshSharedModule,
		JxNgCoreModule,
	],
	providers: [
		TranslationService,
	],
	declarations: [
		DashboardComponent,
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	],
})
export class DashboardModule {
}
