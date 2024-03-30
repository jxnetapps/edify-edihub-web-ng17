// Angular
import { Component, OnInit, OnDestroy, Inject, ChangeDetectionStrategy, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Lodash
import * as _lodash from 'lodash';

// RXJS
import { BehaviorSubject, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

// Services and Models
import { EnquiriesModel, EnquiryFollowupsModel } from '../_models';
import { EnquiryFollowupsService, EnquiryService } from '../_services';
import { EnquiryFollowupsListComponent } from './list.component';
import { EnquiriesPartialViewComponent } from '../enquiries/partial-view.component';
import { Router, ActivatedRoute } from '@angular/router';
import { LayoutUtilsService, SubheaderService, TranslationService, Utilities } from '../../.././../core';
import { JxBaseComponent, JxHttpService, toServerDate, getDefaultInt, ICreateResponse } from 'jx-ng-core';


@Component({
	selector: 'kt-followupModel-edit-dialog',
	templateUrl: './edit.component.html',
	changeDetection: ChangeDetectionStrategy.Default,
})
export class EnquiryFollowupEditComponent extends JxBaseComponent implements OnInit, OnDestroy {
	// Public properties
	@ViewChild(EnquiryFollowupsListComponent, { static: true })
	enquiryFollowupsList!: EnquiryFollowupsListComponent;
	@ViewChild(EnquiriesPartialViewComponent, { static: true })
	enquiriesViewComponent!: EnquiriesPartialViewComponent;
	followupModel: EnquiryFollowupsModel = new EnquiryFollowupsModel;
	enquiryModel: EnquiriesModel = new EnquiriesModel;
	followupForm!: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	isFormSubmitted: boolean = false;
	statusItems: any[] = [];

	@Output() onFollowupSuccess = new EventEmitter<any>();

	// Private properties
	private subscriptions: Subscription[] = [];
	followupUpdated: boolean = false;
	deadStatusReasonItems$ = new BehaviorSubject<any[]>([]);
	enquiryStatusId: any;
	enquiryId: any;
	currentTab: number = 0;

	constructor(
		private subheaderService: SubheaderService,
		private followupFB: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
		private followupService: EnquiryFollowupsService,
		private enquiryService: EnquiryService,
		private translate: TranslationService,
		private _http: JxHttpService,
		private _cdr: ChangeDetectorRef,
		private router: Router,
		private activatedRoute: ActivatedRoute) {
		super();
	}

	ngOnInit() {
		this.loadOnInit();
	}

	private loadOnInit() {
		this.activatedRoute.params.pipe(finalize(() => {
			this.takeUntilDestroy();
		})).subscribe(params => {
			this.enquiryId = params['id'];
			if (this.enquiryId && this.enquiryId > 0) {
				this.subheaderService.setToolBarBackButton({ path: `/edi-mart` });
				this.subheaderService.setHeader([
					{ title: 'Manage Enquiries', page: `edi-mart` },
				],
				'Add Followup', `ENQUIRY#${this.enquiryId}`);
				// edit
				this.getEnquiryDetails(() => {
					this.initPage()
				});
			}
		});
	}

	initPage() {
		this.createForm();
		this.getTitle();
	}

	createForm() {
		this.followupForm = this.followupFB.group({
			NextFollowupDate: [new Date(), Validators.required],
			FollowupTime: [Utilities.printTimeOnly(new Date())],
			Remarks: [this.followupModel.remarks, Validators.required],
			Status: [this.followupModel.status, Validators.required],
			PreviousStatus: [this.followupModel.status, Validators.required], //TODO
			DeadStatusId: [0],
			DeadStatusReason: [null]
		});

		this._cdr.detectChanges()
	}

	getEnquiryDetails(onSuccess?: () => void) {
		this.enquiryService.getEnquiriesById(this.enquiryId)
			.then(enquiry => {
				this.enquiryModel = enquiry;
				this.followupModel = new EnquiryFollowupsModel();
				this.followupModel.clear();
				this.followupModel.enquiryId = this.enquiryId;
				this.followupModel.status = this.enquiryModel.status;
				this.enquiryFollowupsList.loadData(this.enquiryId);
				if (onSuccess)
					onSuccess();
			})
			.finally(() => {
			});
	}

	// statusChanged(e: any) {
	// 	this.enquiryStatusId = e.StatusId;
	// 	if (this.enquiryStatusId === 7) { // deadstatus
	// 		this.getDeadStatusReasons()
	// 	}
	// }

	deadStatusReasonChanged(e: any) {
		this.followupForm.controls['DeadStatusId'].setValue(e.StatusId);
		this.followupForm.controls['DeadStatusReason'].setValue(e.Name);
	}

	// getDeadStatusReasons() {
	// 	this._http.get('api/preadmissions/status-types/all-dead-status-reasons')
	// 		.subscribe((response) => {
	// 			this.deadStatusReasonItems$.next(getDefaultArray(response));
	// 		});
	// }

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
		this.isFormSubmitted = true;
		const controls = this.followupForm.controls;
		/** check form */
		if (this.followupForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const editedEnquiryFollowups = this.prepareEnquiryFollowups();
		this.createEnquiryFollowups(editedEnquiryFollowups, withBack);
	}

	prepareEnquiryFollowups(): EnquiryFollowupsModel {
		const followupModel = this.followupForm.value;
		followupModel['FollowupId'] = this.followupModel.followupId;
		followupModel['enquiryId'] = this.enquiryId;
		const date = followupModel.NextFollowupDate;
		if (date) {
			followupModel.NextFollowupDate = toServerDate(date);
		}

		return followupModel;
	}

	createEnquiryFollowups(followupModel: EnquiryFollowupsModel, withBack: boolean) {
		if (this.enquiryStatusId === 7) { // deadstatus
			const _deadStatusId = getDefaultInt(this.followupForm.controls['DeadStatusId'].value);

			if (_deadStatusId == 0) {
				this.layoutUtilsService.showActionNotification('Please select dead status reason');
				return;
			}
		}
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.followupService.createEnquiryFollowups<ICreateResponse>(followupModel)
			.finally(() => {
				this.layoutUtilsService.stopLoadingMessage();
				this.loadingAfterSubmit = false;
				this.viewLoading = false;
				this.takeUntilDestroy()
			})
			.then(
				(response) => {
					if (response.isSuccess) {
						if (withBack) {
							this.goBackToList()
						}
						else {
							this.followupUpdated = true;
							this.getEnquiryDetails(()=>{
								this.reset();
							})
						}
					}
				});
	}

	goBackToList() {
		this.router.navigateByUrl(`/edi-mart`);
	}


	getTitle(): string {
		let result = this.translate.getTranslation('CRUD.EDIT.CREATE_ENTITY', { name: 'Enquiry Followups' });
		if (!this.followupModel || !this.followupModel.followupId) {
			return result;
		}
		result = this.translate.getTranslation('CRUD.EDIT.EDIT_ENTITY', { name: 'followupModel', title: this.followupModel.followupTime });

		return result;
	}

	reset() {
		this.followupModel = new EnquiryFollowupsModel();
		this.followupModel.enquiryId = this.enquiryId;
		this.followupModel.status = this.enquiryModel.status;
		this.createForm();
		this.hasFormErrors = false;
		this.followupForm.markAsPristine();
		this.followupForm.markAsUntouched();
		this.followupForm.updateValueAndValidity();
	}

	tabChanged = ($event: { index: number; }): void => {
		this.changeView($event.index);
	}

	changeView(tabIndex: number) {
		this.currentTab = tabIndex;
		
		if (tabIndex == 0) {
			this.enquiryFollowupsList.loadData(this.enquiryId);
		}
		else if (tabIndex == 1) {
			this.enquiriesViewComponent.getEnquiries(this.enquiryId);
		}
	}

	override ngOnDestroy() {
		this.subheaderService.resetTooBar()
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
}
