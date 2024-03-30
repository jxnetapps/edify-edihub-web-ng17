// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';

import {EdiMartModule} from './edi-mart/edi-mart.module'
import { JxNgCoreModule } from 'jx-ng-core';

@NgModule({
	declarations: [],
	exports: [],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		CoreModule,
		PartialsModule,
		JxNgCoreModule,
		EdiMartModule,
		//TasksModule,

		//DashboardModule
	],
	providers: []
})
export class PagesModule {
}
