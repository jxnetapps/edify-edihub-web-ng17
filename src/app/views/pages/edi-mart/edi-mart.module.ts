// Angular
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
// NGRX
// Translate
import { TranslateModule } from "@ngx-translate/core";
import { PartialsModule } from "../../partials/partials.module";

// Shared
import { ActionNotificationComponent, DeleteEntityDialogComponent, UpdateStatusDialogComponent } from "../../partials/content/crud";
// import jx custom module
// Components
import { EdiMartModuleComponent } from "./edi-mart.component";

import { EnquiriesListComponent } from "./enquiries/list.component";
import { EnquiryFollowupsListComponent } from "./enquiryfollowups/list.component";
import { EnquiryFollowupEditComponent } from "./enquiryfollowups/edit.component";

// services
import { EnquiryService, EnquiryFollowupsService, UsersInClassService } from "./_services";
import { EshSharedModule } from "../_shared/eshshared.module";
import { EnquiriesPartialViewComponent } from "./enquiries/partial-view.component";
import { EnquiryViewDialogComponent } from "./enquiries/view.dialog.component";
import { EnquiryReportService } from "./_services/reports.service";
import { EnquiryReportComponent } from "./reports/mis.report.component";
import { NgxPermissionsModule } from "ngx-permissions";
import { PreAdmissionsSettingComponent, PreAdmActiveUsersComponent, PreAdmAddUserComponent, PreAdmTransformEnquiresComponent } from "./settings";
import { DeadStatusReportComponent } from "./reports/dead-status-report/dead-status-report.component";
import { EnquiryFilterComponent } from "./partial/enquiry-filter/enquiry-filter.component";
import { EditEnquiryComponent } from './enquiries/edit-enquiry/edit-enquiry.component'
import { AddEnquiryComponent } from './enquiries/add-enquiry/add-enquiry.component'
import { MaterialListComponent } from './material/material-list/material-list.component'
import { MaterialAddComponent } from './material/material-add/material-add.component'
import { MaterialViewComponent } from './material/material-view/material-view.component'
import { MaterialEditComponent } from './material/material-edit/material-edit.component'
import { MailLogListComponent } from './mail-logs/mail-log-list/mail-log-list.component'
import { MailLogViewDialogComponent } from './mail-logs/mail-log-view-dialog/mail-log-view-dialog.component'
import { HttpUtilsService, InterceptService, LayoutUtilsService, TypesUtilsService } from "../../../core/_base/crud";
import { MaterialModule } from "../../../core/shared/material.module";
import { JxHttpService, JxNgCoreModule } from "jx-ng-core";

const routes: Routes = [
	{
		path: "",
		component: EdiMartModuleComponent,
		children: [
			{
				path: "",
				redirectTo: "manage-enquiries", // TODO
				pathMatch: "full",
			},
			{
				path: "manage-enquiries",
				component: EnquiriesListComponent,
			},
			{
				path: "reports/mis",
				component: EnquiryReportComponent,
			},
			{
				path: "settings",
				component: PreAdmissionsSettingComponent,
			},
			{
				path: "add-enquiry",
				component: AddEnquiryComponent
			},
			{
				path: "edit/:enquiryId/enquiry",
				component: EditEnquiryComponent,
			},
			{
				path: 'enquiries/:id/followups',
				component: EnquiryFollowupEditComponent
			},
			{
				path: "reports/dead-status-report",
				component: DeadStatusReportComponent,
			},
			{
				path: "manage-materials",
				component: MaterialListComponent,
			},
			{
				path: 'manage-materials/add',
				component: MaterialAddComponent
			},
			{
				path: 'manage-materials/:id/edit',
				component: MaterialEditComponent
			},
			{
				path: 'manage-materials/:id/view',
				component: MaterialViewComponent
			}
		],
	},
];

@NgModule({
	imports: [
		CommonModule, 
		HttpClientModule,
		PartialsModule, 
		NgxPermissionsModule.forChild(),
		RouterModule.forChild(routes),
		 FormsModule,
		ReactiveFormsModule,
		TranslateModule.forChild(), 
		MaterialModule,
		JxNgCoreModule,
		EshSharedModule
	],
	providers: [
		InterceptService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true,
		},
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService,
		EnquiryService,
		EnquiryFollowupsService,
		UsersInClassService,
		EnquiryReportService,
		JxHttpService
	],
	// entryComponents: [
	// 	ActionNotificationComponent,
	// 	DeleteEntityDialogComponent,
	// 	UpdateStatusDialogComponent,
	// ],
	declarations: [
		EdiMartModuleComponent,
		EnquiriesListComponent,
		EnquiryFollowupsListComponent,
		EnquiryFollowupEditComponent,
		EnquiriesPartialViewComponent,
		EnquiryViewDialogComponent,
		EnquiryReportComponent,
		PreAdmissionsSettingComponent,
		PreAdmActiveUsersComponent,
		PreAdmAddUserComponent,
		PreAdmTransformEnquiresComponent,
		DeadStatusReportComponent,
		EnquiryFilterComponent,
		AddEnquiryComponent,
		EditEnquiryComponent,
		MaterialListComponent,
		MaterialAddComponent,
		MaterialViewComponent,
		MaterialEditComponent,
		MailLogListComponent,
		MailLogViewDialogComponent
	],
})
export class EdiMartModule { }
