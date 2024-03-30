// Angular
import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// RXJS
import { merge, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

// Modules/Services
import { LayoutUtilsService, MessageType, QueryParamsModel, QueryResultsModel } from '../../../../../core/_base/crud';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '../../../../../core/shared/material.components';
import { TranslationService } from '../../../../../core/_base/layout';
import { Utilities } from '../../../../../core/_helpers';
import { TaskDetailsModel } from '../../_models';
import { JxHttpService } from '../../../../jx-module';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'kt-tasks-list-template',
	templateUrl: './list.component.html',
	styles: []
})
export class TasksListTemplateComponent implements OnInit {
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	@Input() tasktype: string;

	displayedColumns = ['TaskId', 'Subject', 'AssignedBy', 'Priority', 'DueDate', 'CreatedOn', 'Status', 'actions'];
	assignedToOtherColumns = ['TaskId', 'Subject', 'AssignedTo', 'Priority', 'DueDate', 'CreatedOn', 'Status', 'actions'];
	taskPriority : any[];
	taskStatus : any[];
	dataSource: MatTableDataSource<any>;
	paginatorTotal$: number = 0;
	loadingIndicator: boolean = false;
	taskfilterForm!: FormGroup;
	
	constructor(
		private layoutUtilsService: LayoutUtilsService,
		private dialog: MatDialog,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public snackBar: MatSnackBar,
		private taskFilterFB: FormBuilder,
		private translate: TranslationService,
		private _httpService: JxHttpService,
	) {
		// Init DataSource
		this.dataSource = new MatTableDataSource();
	}

	ngOnInit() {
		this.createFilterForm();
		this.loadPreSettings();
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		merge(this.sort.sortChange, this.paginator.page)
			.pipe(tap(() => { this.loadData(); }))
			.subscribe();
		this.dataSource = new MatTableDataSource();
		this.loadData(true);
	}

	getDisplayedColumns(): string[] {
		return this.tasktype === 'my' ? this.displayedColumns : this.assignedToOtherColumns;
	}

	createFilterForm() {
		this.taskFilterForm = this.taskFilterFB.group({
			TaskId: [null],
			Subject: [null],
			Priority: [0],
			Status: [0],
		});
	}

	private loadPreSettings() {
		this.layoutUtilsService.startLoadingMessage();
		this._httpService.get(`api/tasks/taskdetails/pre-settings/all`)
			.subscribe(
				(response: any) => {
					this.layoutUtilsService.stopLoadingMessage();
					this.taskPriority = response.taskPriority;
					this.taskStatus = response.taskStatus;
				},
				error => {
					this.layoutUtilsService.stopLoadingMessage();
					this.layoutUtilsService.showActionNotification(Utilities.getHttpErrorMessage(error), MessageType.Read);
				});
	}


	public applyFilter(filterValue: string) {
		if (filterValue.trim().length != 0 && filterValue.trim().length < 2)
			return false;
		this.paginator.pageIndex = 0;
		this.loadData();
	}

	private loadData(firstLoad: boolean = false) {
		this.layoutUtilsService.startLoadingMessage();
		this.loadingIndicator = true;
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction === '' ? 'asc' : this.sort.direction,
			this.sort.active === undefined ? 'CreatedOn' : this.sort.active,
			this.paginator.pageIndex,
			firstLoad ? 10 : this.paginator.pageSize === undefined ? 10 : this.paginator.pageSize
		);
		this._httpService.post(`api/tasks/taskdetails/find/${this.tasktype}`,queryParams)
			.subscribe(
				(response: QueryResultsModel) => {
					this.loadingIndicator = false;
					this.layoutUtilsService.stopLoadingMessage();
					this.dataSource.data = response.items == null ? [] : response.items;
					this.paginatorTotal$ = response.totalCount;
				},
				error => {
					this.layoutUtilsService.stopLoadingMessage();
					this.loadingIndicator = false;
					this.layoutUtilsService.showActionNotification(Utilities.getHttpErrorMessage(error), MessageType.Read);
				});
	}

	filterConfiguration(): any {
		const filter: any = this.taskFilterForm.value || {};
		filter.TaskId=filter.TaskId || 0;
		return filter;
	}

	onFilterSubmit = () => this.loadData();
	onFilterClear = () => {
		this.taskFilterForm.patchValue({Priority:0, Status:0, Subject:'', TaskId:''});
		this.loadData();
	}	

	deleteTask(_item: TaskDetailsModel) {
		var deleteFormLabels: any = {
			description: this.translate.getTranslation('CRUD.DELETE_ENTITY_FORM.DESCRIPTION', { name: 'Casts' }),
			waitDesciption: this.translate.getTranslation('CRUD.DELETE_ENTITY_FORM.WAIT_DESCRIPTION', { name: 'Casts' }),
			deleteMessage: this.translate.getTranslation('CRUD.DELETE_ENTITY_FORM.MESSAGE', { name: 'Casts' }),
		};

		this.snackBar.open(deleteFormLabels.description, this.translate.getTranslation('COMMON.DELETE'), { duration: 5000 })
			.onAction().subscribe(() => {
				this.layoutUtilsService.startLoadingMessage(deleteFormLabels.waitDesciption);
				this.loadingIndicator = true;

				this._httpService.delete(`api/tasks/taskdetails/delete/${_item.TaskId}`)
					.subscribe(results => {
						this.layoutUtilsService.stopLoadingMessage();
						this.layoutUtilsService.showActionNotification(deleteFormLabels.deleteMessage, MessageType.Delete);
						this.loadData();
					},
						error => {
							this.layoutUtilsService.stopLoadingMessage();
							this.loadingIndicator = false;
							this.layoutUtilsService.showActionNotification(Utilities.getHttpErrorMessage(error), MessageType.Delete);
						});
			});
	}

	editTask(_item: TaskDetailsModel) {
		this.router.navigate(['/manage-tasks/edit', _item.TaskId], { relativeTo: this.activatedRoute });
	}

	updateStatus =(_item: TaskDetailsModel)=>{
		this.router.navigate(['../history', _item.TaskId], { relativeTo: this.activatedRoute });
	}	
}
