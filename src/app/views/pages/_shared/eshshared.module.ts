import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { YCSFilterSharedComponent } from "./header-filters/ycs.component";

import { JxNgxChartsModule } from "./charts/ngxCharts.module";
import { MaterialModule } from "../../../core/shared/material.module";

//Project module re-suable components
import { LeaveStatusPipe, TaskStatusPipe, EnquiryStatusPipe, PaymentStatusPipe, StudentStatusPipe, TaskPriorityPipe } from "./_pipes";
import { InfoBoxWidgetComponent } from "./info-box/info-box";

import {
	SharedAcademicYearComponent, SharedAcademicClassComponent, SharedFeeTermComponent, SharedAcademicSectionComponent, SharedAffiliationComponent, SharedScholartypeComponent, SharedDepartmentsComponent, SharedEmployeesComponent, SharedAcademicTermComponent, SharedExamListComponent,  SharedCountryComponent, SharedStateComponent, SharedHrmDesignationComponent, SharedBloodGroupsComponent, SharedGenderComponent, SharedMaritalstatusComponent, SharedRelationComponent, ChangePasswordComponent, SharedAccountsFeeMastersComponent, SharedInstituteGroupComponent, SharedPaymodeComponent, SharedFeeReportsComponent, SharedAcademicClassTeacherSectionComponent, SharedAcademicClassTeacherGradesComponent, SharedLeaveTypesComponent, LeaveSessionsComponent,
	SharedDepartmentHeadsComponent,
	EmployeeFilterComponentComponent,
	EmployeeFilterToolbarComponent
} from "./partial";
import { SharedStoreProdCategoryComponent } from "./partial/store-prod-category/prod-category";
``
import { JxDividerComponent } from "./components/divider";
import { JxNgCoreModule, FormControlPipe } from "jx-ng-core";

@NgModule({
	imports: [
		MaterialModule,
		JxNgCoreModule
	],
	//providers: [AcademicYearService, ClassesService, EmployeesService, SubjectsService, SectionsService, CommonService, SchedulesService],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	declarations: [
		EnquiryStatusPipe,
		PaymentStatusPipe,
		LeaveStatusPipe,
		TaskStatusPipe,
		TaskPriorityPipe,
		StudentStatusPipe,
		YCSFilterSharedComponent,
		SharedAffiliationComponent,
		SharedScholartypeComponent,
		//Project module resuable components
		InfoBoxWidgetComponent,

		//Partial Shared component
		SharedAcademicYearComponent,
		SharedAcademicClassComponent,
		SharedAcademicSectionComponent,
		SharedFeeTermComponent,
		SharedEmployeesComponent,
		SharedDepartmentsComponent,
		SharedAcademicTermComponent,
		SharedExamListComponent,
		SharedStateComponent,
		SharedCountryComponent,
		SharedHrmDesignationComponent,
		SharedStoreProdCategoryComponent,
		SharedRelationComponent,
		SharedBloodGroupsComponent,
		SharedGenderComponent,
		SharedMaritalstatusComponent,
		ChangePasswordComponent,
		SharedAccountsFeeMastersComponent,
		SharedInstituteGroupComponent,
		JxDividerComponent,
		SharedPaymodeComponent,
		SharedFeeReportsComponent,
		SharedAcademicClassTeacherSectionComponent,
		SharedAcademicClassTeacherGradesComponent,
		SharedLeaveTypesComponent,
		LeaveSessionsComponent,
		SharedDepartmentHeadsComponent,
		EmployeeFilterComponentComponent,
		EmployeeFilterToolbarComponent
	],
	exports: [
		JxNgxChartsModule,
		EnquiryStatusPipe,
		PaymentStatusPipe,
		LeaveStatusPipe,
		TaskPriorityPipe,
		TaskStatusPipe,
		StudentStatusPipe,
		YCSFilterSharedComponent,
		SharedAffiliationComponent,
		SharedScholartypeComponent,
		//Project module resuable components
		InfoBoxWidgetComponent,
		//Partial Shared component
		SharedAcademicYearComponent,
		SharedAcademicClassComponent,
		SharedAcademicSectionComponent,
		SharedFeeTermComponent,
		SharedEmployeesComponent,
		SharedDepartmentsComponent,
		SharedAcademicTermComponent,
		SharedExamListComponent,
		SharedStateComponent,
		SharedCountryComponent,
		SharedHrmDesignationComponent,
		SharedStoreProdCategoryComponent,
		SharedRelationComponent,
		SharedBloodGroupsComponent,
		SharedGenderComponent,
		SharedMaritalstatusComponent,
		ChangePasswordComponent,
		SharedAccountsFeeMastersComponent,
		SharedInstituteGroupComponent,
		JxDividerComponent,
		SharedPaymodeComponent,
		SharedFeeReportsComponent,
		SharedAcademicClassTeacherSectionComponent,
		SharedAcademicClassTeacherGradesComponent,
		SharedLeaveTypesComponent,
		LeaveSessionsComponent,
		SharedDepartmentHeadsComponent,
		EmployeeFilterComponentComponent,
		EmployeeFilterToolbarComponent
	],
})
export class EshSharedModule { }
