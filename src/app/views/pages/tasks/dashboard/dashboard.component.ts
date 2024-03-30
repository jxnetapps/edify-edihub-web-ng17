// Angular
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { finalize } from "rxjs/operators";
import { LayoutUtilsService, MessageType } from "../../../../core/_base/crud";
import { Utilities } from "../../../../core/_helpers";
import { JxHttpService, JxBaseComponent } from "../../../../views/jx-module";
// Services
// Widgets model

@Component({
	selector: "kt-task-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["dashboard.component.scss"],
})
export class TaskDashboardComponent extends JxBaseComponent implements OnInit {
	public my: any = {};
	public assignee: any = {};
	public myStatusData: any[] = [];
	public assigneeStatusData: any[] = [];
	public myPriorityData: any[] = [];
	public assigneePriorityData: any[] = [];

	public totalFeeData: any[] = [];
	public classFeeData: any[] = [];
	public feetypesFeeData: any[] = [];
	public paymentTypeFeeData: any[] = [];
	public monthwiseFeeData: any[] = [];
	public academicYearId = 0;
	// Private properties
	constructor(
		private _httpService: JxHttpService,
		private cdr: ChangeDetectorRef,
		private layoutUtilsService: LayoutUtilsService
	) {super()}

	ngOnInit(): void {
		this.academicYearId = Utilities.getDefaultAcademicYear();
		this.getReportSummary();
	}

	getReportSummary = () => {
		this.layoutUtilsService.startLoadingMessage();
		//this.viewLoading = true;
		this.my = {};
		this._httpService
			.get(`api/tasks/reports/summary`)
			.pipe(
				finalize(() => {
					this.layoutUtilsService.stopLoadingMessage();
					//this.viewLoading = false;
					this.takeUntilDestroy();
				})
			)
			.subscribe(
				(response: any) => {
					if (response) {
						this.my = response.myReturnTasks;
						this.assignee = response.assigneeReturnTasks;
						this.getStatusData();
						this.getPriorityData();
					}
					this.cdr.detectChanges();
				},
				(error) =>
					this.layoutUtilsService.showActionNotification(
						Utilities.getHttpErrorMessage(error),
						MessageType.Read
					)
			);
	};

	getStatusData = () => {		
		//this.viewLoading = true;
		this.myStatusData = [];
		let data: any = [];
		if (
			this.my &&
			this.my.myStatuswise &&
			this.my.myStatuswise.length > 0
		) {
			this.my.myStatuswise.forEach((x) => {
				data.push({
					name: x.StatusName,
					value: x.Total,
				});
			});
			this.myStatusData = data;
		}
		if (
			this.assignee &&
			this.assignee.assigneeStatuswise &&
			this.assignee.assigneeStatuswise.length > 0
		) {
			this.assigneeStatusData = [];
			data = [];
			this.assignee.assigneeStatuswise.forEach((x) => {
				data.push({
					name: x.StatusName,
					value: x.Total,
				});
			});
			this.assigneeStatusData = data;
		}
	};

	getPriorityData = () => {
		
		//this.viewLoading = true;
		this.myPriorityData= [];
		let data: any = [];

		if (
			this.my &&
			this.my.myPrioritywise &&
			this.my.myPrioritywise.length > 0
		) {
			this.my.myPrioritywise.forEach((x: any) => {
				data.push({
					name: x.PriorityName,
					value: x.Total,
				});
			});
			this.myPriorityData = data;
		}

		if (
			this.assignee &&
			this.assignee.assigneePrioritywise &&
			this.assignee.assigneePrioritywise.length > 0
		) {
			this.assigneePriorityData = [];
			data = [];
			this.assignee.assigneePrioritywise.forEach((x) => {
				data.push({
					name: x.PriorityName,
					value: x.Total,
				});
			});
			this.assigneePriorityData = data;
		}
	};

	public onSelect(event: any) {
		console.log(event);
	}
}
