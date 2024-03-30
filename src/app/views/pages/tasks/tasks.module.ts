// Angular
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
// Translate
import { TranslateModule } from "@ngx-translate/core";
import { PartialsModule } from "../../partials/partials.module";
// Services
import {
	HttpUtilsService,
	TypesUtilsService,
	InterceptService,
	LayoutUtilsService,
} from "../../../core/_base/crud";
// Shared
import {
	ActionNotificationComponent,
	DeleteEntityDialogComponent,
	UpdateStatusDialogComponent,
} from "../../partials/content/crud";
// import jx custom module
// Components
import { TasksModuleComponent } from "./tasks.component";
import { TaskDetailsListComponent } from "./taskdetails/list.component";

// services
import { TaskHistoryEditComponent } from "./taskhistory/edit.component";
import { TaskDashboardComponent } from "./dashboard/dashboard.component";
import { MaterialModule } from "../../../core/shared/material.module";
import {EshSharedModule} from "../_shared/eshshared.module";
import { TasksListTemplateComponent } from "./taskdetails/shared/list.component";
import { CoreModule } from "../../../core/core.module";
import { TaskDetailsEditComponent } from "./taskdetails/edit.component";
import { JxNgCoreModule } from "jx-ng-core";

const routes: Routes = [
	{
		path: "",
		component: TasksModuleComponent,
		children: [
			{
				path: "",
				redirectTo: "dashboard", // TODO
				pathMatch: "full",
			},
			{
				path: "dashboard",
				component: TaskDashboardComponent,
			},
			{
				path: "list",
				component: TaskDetailsListComponent,
			},
			{
				path: "history/:id",
				component: TaskHistoryEditComponent,
			},
			{
				path: "add-new",
				component: TaskDetailsEditComponent,
			},
			{
				path: "edit/:id",
				component: TaskDetailsEditComponent,
			}			
		],
	},
];

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		PartialsModule,
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
		TranslateModule.forChild(),
		MaterialModule,
		JxNgCoreModule,
		EshSharedModule,
		CoreModule
	],
	providers: [
		InterceptService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true,
		},
		// {
		// 	provide: MAT_DIALOG_DEFAULT_OPTIONS,
		// 	useValue: {
		// 		hasBackdrop: true,
		// 		panelClass: "kt-mat-dialog-container__wrapper",
		// 		height: "auto",
		// 		width: "900px",
		// 	},
		// },
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService,
	],
	// entryComponents: [
	// 	ActionNotificationComponent,
	// 	DeleteEntityDialogComponent,
	// 	UpdateStatusDialogComponent,
	// ],
	declarations: [
		TasksModuleComponent,
		TaskDetailsListComponent,
		TaskDashboardComponent,
		TasksListTemplateComponent,
		TaskHistoryEditComponent,
		TaskDetailsEditComponent,
	],
})
export class TasksModule {}
