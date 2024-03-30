// Angular
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Lodash
import * as _lodash from 'lodash';
// Layout
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { Utilities } from '../../../../core/_helpers/utilities';
import { ResponseModel, ResponseStatus } from '../../../../core/_base/crud/models/response-models';
import { TranslationService } from '../../../../core/_base/layout/services/translation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProgressStatus, ProgressStatusEnum } from '../../../jx-module/_models/progress-status.model';
import { TaskHistoryModel, TaskDetailsModel } from '../_models';
import { JxHttpService } from '../../../jx-module';

@Component({
	selector: 'kt-task-history-edit',
	templateUrl: './edit.component.html',
	styleUrls: ['./edit.component.scss']
})
export class TaskHistoryEditComponent implements OnInit {
	// Public properties
	ticketHistoryDetails: any;
	ticketshistory: TaskHistoryModel;
	ticketshistoryList: Array<TaskHistoryModel>;
	tickets: TaskDetailsModel = new TaskDetailsModel();
	ticketshistoryForm: FormGroup;
	uploadedFiles: FileList;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	isFormSubmitted: boolean = false;
	formLabels: any = {
		ADD_MESSAGE: this.translate.getTranslation('CRUD.EDIT.ADD_MESSAGE', { name: 'Task note' }),
		UPDATE_MESSAGE: this.translate.getTranslation('CRUD.EDIT.UPDATE_MESSAGE', { name: 'Task note' })
	};

	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<TicketsHistoryEditDialogComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private ticketshistoryFB: FormBuilder,
		private cdr: ChangeDetectorRef,
		private layoutUtilsService: LayoutUtilsService,
		private _httpService: JxHttpService,
		private translate: TranslationService) {
	}

	/**
	 * On init
	 */
	ngOnInit() {

		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params['id'];
			if (id && id > 0) {
				this.loadHistory(id);
			}
		});
		this.subscriptions.push(routeSubscription);
	}

	/**
	 * Load history
	 * */
	loadHistory(ticketId) {
		//edit
		this.layoutUtilsService.startLoadingMessage();
		this._httpService.getHttp$(`api/tasks/taskdetails/history/${ticketId}`)
			.then(
				(response: any) => {
					if (response) {
						this.ticketHistoryDetails = response;
						this.ticketshistoryList = response.taskDetails.History;
						this.tickets = response.taskDetails;
						this.initPage();
						this.cdr.detectChanges();
					}
				},
				error => {
					this.layoutUtilsService.showActionNotification(Utilities.getHttpErrorMessage(error), MessageType.Read);
				}).finally(() => {
					this.layoutUtilsService.stopLoadingMessage();
				});
	}
	/**
	 *Init Page
	 * */
	initPage() {
		this.createForm();
		this.getTitle();
	}

	/**
	 * Create form
	 */
	createForm() {
		this.ticketshistory = new TaskHistoryModel();
		this.ticketshistory.clear();
		this.ticketshistoryForm = this.ticketshistoryFB.group({
			EndDate: [this.tickets.DueDate2, Validators.required],
			ReplyRemark: [null, Validators.required],
			Status: [this.tickets.Status, Validators.required],
		});
	}

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
		this.isFormSubmitted = true;
		const controls = this.ticketshistoryForm.controls;
		/** check form */
		if (this.ticketshistoryForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const editedTicketsHistory = this.prepareTicketsHistory();

		this.createTicketsHistory(editedTicketsHistory);
	}


	/**
	 * Returns prepared data for save
	 */
	prepareTicketsHistory(): TaskHistoryModel {
		const controls = this.ticketshistoryForm.controls;
		const _ticketshistory = new TaskHistoryModel();
		_ticketshistory.clear();
		_ticketshistory.TaskId = this.tickets.TaskId;
		_ticketshistory.ReplyRemark = controls['ReplyRemark'].value;
		_ticketshistory.Status = controls['Status'].value;
		let date = controls.EndDate.value;
		if (date) {
			_ticketshistory.EndDate = Utilities.toServerDate(date);
		}

		return _ticketshistory;
	}

	/**
	 * Add TicketsHistory
	 *
	 * @param _ticketshistory: TicketsHistory
	 * @param withBack: boolean
	 */
	createTicketsHistory(_ticketshistory: TaskHistoryModel) {
		this.viewLoading = true;
		this.loadingAfterSubmit = true;
		this.layoutUtilsService.startLoadingMessage();

		let formData = Utilities.prepareFileUploadFormData(_ticketshistory, 'Attachments', this.uploadedFiles);

		this._httpService.postFormHttp(`api/tasks/taskhistory/create`,formData)
			.then(
				(response: any) => {
					const message = response.Status == ResponseStatus.Success ? this.formLabels.ADD_MESSAGE : response.Message;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create);
					if (response.Status == ResponseStatus.Success) {
						this.loadHistory(this.tickets.TaskId);
					}
				},
				error => {
					this.layoutUtilsService.showActionNotification(Utilities.getHttpErrorMessage(error));
				}).finally(() => {
					this.layoutUtilsService.stopLoadingMessage();
					this.loadingAfterSubmit = false;
					this.viewLoading = false;
				});
	}

	/**
	 * Reset
	 */
	reset() {
		this.ticketshistory = new TaskHistoryModel();
		this.createForm();
		this.hasFormErrors = false;
		this.ticketshistoryForm.markAsPristine();
		this.ticketshistoryForm.markAsUntouched();
		this.ticketshistoryForm.updateValueAndValidity();
	}

	/** UI */
	/**
	 * Returns component title
	 */
	getTitle(): string {
		let result = this.translate.getTranslation('CRUD.EDIT.CREATE_ENTITY', { name: 'Tickets History' });

		if (!this.ticketshistory || !this.ticketshistory.TaskHistoryId) {
			return result;
		}

		result = this.translate.getTranslation('CRUD.EDIT.EDIT_ENTITY', { name: 'Tickets History', title: '' });

		return result;
	}

	fileChanged(files: FileList) {
		//console.log(files);
		this.uploadedFiles = files;
	}

	public fileInDownload: string;
	public percentage: number | undefined;
	public showProgress: boolean;
	public showDownloadError: boolean;
	public downloadStatus(event: ProgressStatus) {
		switch (event.status) {
			case ProgressStatusEnum.START:
				this.showDownloadError = false;
				break;
			case ProgressStatusEnum.IN_PROGRESS:
				this.showProgress = true;
				this.percentage = event.percentage;
				break;
			case ProgressStatusEnum.COMPLETE:
				this.showProgress = false;
				break;
			case ProgressStatusEnum.ERROR:
				this.showProgress = false;
				this.showDownloadError = true;
				break;
		}
	}

	goBackWithId() {
		const url = `/manage-tasks/list`;
		this.router.navigateByUrl(url, /* Removed unsupported properties by Angular migration: relativeTo. */ {});
	}
}
