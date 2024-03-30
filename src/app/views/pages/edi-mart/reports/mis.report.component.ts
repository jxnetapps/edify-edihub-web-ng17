// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

// RXJS
import { BehaviorSubject, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

// Modules/Services
import { EnquiryReportService } from '../_services/reports.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JxBaseComponent, JxHttpService, getDefaultArray } from 'jx-ng-core';
import { Utilities, LayoutUtilsService, MessageType } from '../../../../core';

@Component({
	selector: 'kt-preadmission-mis-report',
	templateUrl: './mis.report.component.html',
	styleUrls: []
})
export class EnquiryReportComponent extends JxBaseComponent implements OnInit, OnDestroy {
	// Subscriptions
	private subscriptions: Subscription[] = [];
	misResult =new BehaviorSubject<any[]>([]);
	weeklyResult=new BehaviorSubject<any[]>([]);
	statusConversionResult=new BehaviorSubject<any[]>([]);

	statusResult$=new BehaviorSubject<any[]>([]);
	channelResult$=new BehaviorSubject<any[]>([]);
	selectedEmployeeId = '';

	isAdmin = true; //TODO

	isAdminUser = Utilities.getCurrentUserRole() === 2;

	constructor(
		private layoutUtilsService: LayoutUtilsService,
		public snackBar: MatSnackBar,
		private _httpService: JxHttpService,
		private enquiryReportService: EnquiryReportService
	) {
		super()
	 }

	ngOnInit() {		
		this.getTop7DaysNewEnquiryTotalsDayWise(this.selectedEmployeeId);
		this.getStatusConversionReport(this.selectedEmployeeId);
		this.getUserwiseEnquiryTypesReport('');
		this.getUserwiseEnquiryStatusReport('');
		this.getUserwiseChanelsReport('');
	}

	getObjectEntries(obj: any){
		return Object.entries(obj);
	}

	public getTop7DaysNewEnquiryTotalsDayWise(employeeId: any) {
		const findSubscription = this.enquiryReportService.getTop7DaysNewEnquiryTotalsDayWise(employeeId)
			.pipe(finalize(() => {
			}))
			.subscribe(
				(response) => {
					this.weeklyResult.next(response);
				},
				(error) => {
					this.layoutUtilsService.showActionNotification(Utilities.getHttpErrorMessage(error), MessageType.Read);
				});
		this.subscriptions.push(findSubscription);
	}

	public getStatusConversionReport(employeeId: any) {
		const findSubscription = this.enquiryReportService.getStatusConversionReport(employeeId)
			.pipe(finalize(() => {
			}))
			.subscribe(
				(response) => {
					this.statusConversionResult.next(response);
				},
				(error) => {
					this.layoutUtilsService.showActionNotification(Utilities.getHttpErrorMessage(error), MessageType.Read);
				});
		this.subscriptions.push(findSubscription);
	}

	getUserwiseEnquiryTypesReport(employeeId: any) {
		this._httpService.getHttp$('api/preadmissions/reports/userwise-enquiry-type/0?employeeIds='+employeeId)
			.finally(() => {
				this.takeUntilDestroy()
			})
			.then(
				(response) => {
					this.misResult.next(getDefaultArray(response));
					//this.statusConversionResult.next(response);
				});
	}

	getUserwiseEnquiryStatusReport(employeeId: any) {
		this._httpService.getHttp$('api/preadmissions/reports/userwise-enquiry-status/0?employeeIds='+employeeId)
			.finally(() => {
				this.takeUntilDestroy()
			})
			.then(
				(response) => {
					this.statusResult$.next(getDefaultArray(response));
					//this.statusConversionResult.next(response);
				});
	}

	getUserwiseChanelsReport(employeeId: any) {
		this._httpService.getHttp$('api/preadmissions/reports/userwise-channel-counts/0?employeeIds='+employeeId)
			.finally(() => {
				this.takeUntilDestroy()
			})
			.then(
				(response) => {
					this.channelResult$.next(getDefaultArray(response));
					//this.statusConversionResult.next(response);
				});
	}

	override ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}
}
