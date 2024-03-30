// Angular
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Lodash
import * as _lodash from 'lodash';
// Layout
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { Utilities } from '../../../../core/_helpers/utilities';
import { SubheaderService } from '../../../../core/_base/layout';
import { ResponseModel, ResponseStatus } from '../../../../core/_base/crud/models/response-models';
import { TranslationService } from '../../../../core/_base/layout/services/translation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';



// Services and Models
import { TaskDetailsModel } from '../_models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JxHttpService } from '../../../jx-module';

@Component({
	selector: 'kt-taskdetails-edit',
	templateUrl: './edit.component.html',
	styleUrls: []
})
export class TaskDetailsEditComponent implements OnInit {
	// Public properties
	taskdetails: TaskDetailsModel;
	taskdetailsForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	isFormSubmitted: boolean = false;
	uploadedFiles: FileList;
	selectedEmployeeId =0;
	taskId=0;
	priority = [{id:1, text:'Low'},{id:2, text:'Medium'},{id:3, text:'High'},{id:4, text:'OnGoingTask'},];

	formLabels: any = {
		ADD_MESSAGE: this.translate.getTranslation('CRUD.EDIT.ADD_MESSAGE', { name: 'Task note' }),
		UPDATE_MESSAGE: this.translate.getTranslation('CRUD.EDIT.UPDATE_MESSAGE', { name: 'Task note' })
	};

	// Private properties
	private subscriptions: Subscription[] = [];

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		public snackBar: MatSnackBar,
		private taskdetailsFB: FormBuilder,
		private cdr: ChangeDetectorRef,
		private layoutUtilsService: LayoutUtilsService,
		private _httpService: JxHttpService,
		private subheaderService: SubheaderService,
		private translate: TranslationService) { }

	ngOnInit() {
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			this.taskId = params['id'];
			if (this.taskId && this.taskId > 0) {
				this.getTaskDetailsById(this.taskId);
			} else {
				this.taskdetails = new TaskDetailsModel();
				this.taskdetails.clear();
				this.initPage();
			}
		});
		this.subscriptions.push(routeSubscription);
	}

	getTaskDetailsById(taskId) {
		this.layoutUtilsService.startLoadingMessage();
		this.viewLoading = true;
		const routeSubscription = this._httpService.get(`api/tasks/taskdetails/id/${taskId}`)
			.pipe(finalize(() => {
				this.layoutUtilsService.stopLoadingMessage();
				this.viewLoading = false;
			}))
			.subscribe(
				(response: TaskDetailsModel) => {
					if (response) {
						this.taskdetails = response;
						this.selectedEmployeeId = this.taskdetails.AssignedToId;
						this.initPage();
						this.cdr.detectChanges();
					} else {
						this.taskdetails = new TaskDetailsModel();
						this.taskdetails.clear();
						const _date = new Date();
						this.taskdetails.DueDate = new Date(`${_date.getFullYear()}-${_date.getMonth()+1}-${_date.getDate()}`);
						this.initPage();
					}
				},
				(error) => {
					this.layoutUtilsService.showActionNotification(Utilities.getHttpErrorMessage(error), MessageType.Read);
				});
		this.subscriptions.push(routeSubscription);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	initPage() {
		this.createForm();
		// if (!this.taskdetails.TaskId) {
		// 	//this.subheaderService.setTitle('Create Task');
		// 	this.subheaderService.setBreadcrumbs([
		// 		{ title: 'Home', page: `dashboard` },
		// 		{ title: 'Dashboard', page: `manage-tasks` },
		// 		{ title: 'Create Task', page: `manage-tasks/add-new` }
		// 	]);
		// 	return;
		// }
		// //this.subheaderService.setTitle('Edit task');
		// this.subheaderService.setBreadcrumbs([
		// 	{ title: 'User Management', page: `dashboard` },
		// 	{ title: 'Dashboard', page: `manage-tasks` },
		// 	{ title: 'Edit Task', page: `manage-tasks/edit`, queryParams: { TaskId: this.taskdetails.TaskId } }
		// ]);
	}

	createForm() {
		this.taskdetailsForm = this.taskdetailsFB.group({
			TaskId: [this.taskdetails.TaskId, Validators.required],
			Subject: [this.taskdetails.Subject, Validators.required],
			AssignedToId: [this.taskdetails.AssignedToId, Validators.required],
			AssignedTo: [''],
			Priority: [this.taskdetails.Priority, Validators.required],
			Description: [this.taskdetails.Description, Validators.required],
			DueDate: [this.taskdetails.DueDate, Validators.required],
			//Status: [this.taskdetails.Status, Validators.required],
		});
	}

	employeeChanged(event: any){
		console.log(event)
		this.taskdetailsForm.controls['AssignedTo'].setValue(event.FullName)
	}

	goBackWithId() {
		this.reset()
		const url = `/manage-tasks/list`;
		this.router.navigate([url]);
	}

	refreshTaskDetails() {		
		this.getTaskDetailsById(this.taskId);
	}

	reset() {
		this.taskdetails = new TaskDetailsModel();
		this.createForm();
		this.hasFormErrors = false;
		this.taskdetailsForm.markAsPristine();
		this.taskdetailsForm.markAsUntouched();
		this.taskdetailsForm.updateValueAndValidity();
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.taskdetailsForm.controls;
		/** check form */
		if (this.taskdetailsForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const editedUser = this.prepareTaskDetails();

		if (editedUser.TaskId > 0) {
			this.updateTaskDetails(editedUser, withBack);
			return;
		}

		this.createTaskDetails(editedUser, withBack);
	}

	fileChanged(files: FileList) {
		//console.log(files);
		this.uploadedFiles = files;
	}

	prepareTaskDetails(): TaskDetailsModel {
		const controls = this.taskdetailsForm.controls;
		const taskdetails = new TaskDetailsModel();
		taskdetails.clear();
		taskdetails.TaskId = this.taskId | 0;
		taskdetails.Subject = controls.Subject.value;
		taskdetails.AssignedToId = controls.AssignedToId.value;
		taskdetails.AssignedTo = controls.AssignedTo.value;
		taskdetails.Priority = controls.Priority.value;
		taskdetails.Description = controls.Description.value;
		const dueDate = controls.DueDate.value;
		if(dueDate)
			taskdetails.DueDate = Utilities.toServerDate(dueDate);

		return taskdetails;
	}

	createTaskDetails(taskdetails: TaskDetailsModel, withBack: boolean = false) {
		this.loadingAfterSubmit = true;
		let formData = Utilities.prepareFileUploadFormData(taskdetails, 'Attachments', this.uploadedFiles);
		this.layoutUtilsService.startLoadingMessage();
		const createSubscription = this._httpService.postForm(`api/tasks/taskdetails/create`, formData)
			.pipe(finalize(() => {
				this.layoutUtilsService.stopLoadingMessage();
				this.loadingAfterSubmit = false;
			}))
			.subscribe(
				(response: ResponseModel) => {
					const message = response.Code === ResponseStatus.Success ? this.formLabels.ADD_MESSAGE : response.Message;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create);
					if (response.Code === ResponseStatus.Success) {
						if(withBack)
							this.goBackWithId()
						else
							this.refreshTaskDetails();
					}
				},
				(error) => {
					this.layoutUtilsService.showActionNotification(Utilities.getHttpErrorMessage(error));
				});
		this.subscriptions.push(createSubscription);
	}

	updateTaskDetails(taskdetails: TaskDetailsModel, withBack: boolean = false) {
		let formData = Utilities.prepareFileUploadFormData(taskdetails, 'Attachments', this.uploadedFiles);
		this.layoutUtilsService.startLoadingMessage();
		this.loadingAfterSubmit = true;
		const updateSubscription = this._httpService.putForm(`api/tasks/taskdetails/update`, formData)
			.pipe(finalize(() => {
				this.layoutUtilsService.stopLoadingMessage();
				this.loadingAfterSubmit = false;
			}))
			.subscribe(
				(response: ResponseModel) => {
					const message = response.Code === ResponseStatus.Success ? this.formLabels.UPDATE_MESSAGE : response.Message;
					this.layoutUtilsService.showActionNotification(message, MessageType.Update);
					if (response.Code === ResponseStatus.Success) {
						this.refreshTaskDetails();
					}
				},
				(error) => {
					this.layoutUtilsService.showActionNotification(Utilities.getHttpErrorMessage(error), MessageType.Update);
				});
		this.subscriptions.push(updateSubscription);
	}

	/**
	 * Returns component title
	 */
	getComponentTitle() {
		let result = this.translate.getTranslation('CRUD.EDIT.CREATE_ENTITY', { name: 'Task Details' });
		if (!this.taskdetails || !this.taskdetails.TaskId) {
			return result;
		}
		result = this.translate.getTranslation('CRUD.EDIT.EDIT_ENTITY', { name: 'taskdetails', title: this.taskdetails.Subject });

		return result;
	}

	onEmployeeSelected(selectedEmployee: any){
		this.taskdetailsForm.patchValue({
			AssignedToId:selectedEmployee.EmployeeId,
			AssignedTo:`${selectedEmployee.FirstName} ${selectedEmployee.LastName}`
		});
	}

	deleteTaskAttachment =(attachmentId: number)=>{
		var deleteFormLabels: any = {
			description: this.translate.getTranslation('CRUD.DELETE_ENTITY_FORM.DESCRIPTION', { name: 'Attachment' }),
			waitDesciption: this.translate.getTranslation('CRUD.DELETE_ENTITY_FORM.WAIT_DESCRIPTION', { name: 'Attachment' }),
			deleteMessage: this.translate.getTranslation('CRUD.DELETE_ENTITY_FORM.MESSAGE', { name: 'Attachment' }),
		};

		this.snackBar.open(deleteFormLabels.description, this.translate.getTranslation('COMMON.DELETE'), { duration: 5000 })
			.onAction().subscribe(() => {
				this.layoutUtilsService.startLoadingMessage(deleteFormLabels.waitDesciption);
				this._httpService.delete(`api/tasks/taskdetails/attachment-delete/${attachmentId}`)
					.subscribe(results => {
						this.layoutUtilsService.stopLoadingMessage();
						this.layoutUtilsService.showActionNotification(deleteFormLabels.deleteMessage, MessageType.Delete);
						this.refreshTaskDetails();
					},
						error => {
							this.layoutUtilsService.stopLoadingMessage();
							this.layoutUtilsService.showActionNotification(Utilities.getHttpErrorMessage(error), MessageType.Delete);
						});
			});
	}

	/**
	 * Close Alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
}
