// Angular
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";

// RXJS
import { BehaviorSubject, merge, of, Subscription } from "rxjs";
import { tap } from "rxjs/operators";
// Modules/Services
import { EnquiriesModel } from "../_models";
import { EnquiryService } from "../_services";
import { EnquiryViewDialogComponent } from "./view.dialog.component";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { LayoutUtilsService, TranslationService, SubheaderService, Utilities, MessageType } from "../../../../core";
import { BaseDataSource, QueryParamsModel } from "../../../../core/_base/crud";
import { JxBaseComponent, isNullOrEmpty, toServerDate, getDefaultArray, getDefaultInt } from "jx-ng-core";

@Component({
	selector: "kt-enquiries-list",
	templateUrl: "./list.component.html",
	styleUrls: ["./list.component.scss"],
})
export class EnquiriesListComponent extends JxBaseComponent implements OnInit, OnDestroy {
	@ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort!: MatSort;

	displayedColumns = ["select", "EnquiryId", "ProductName", "PartyName", "Contacts", "City", "CreatedOn", "FollowupDate", "Status", "actions"];
	dataSource = new BaseDataSource();

	public dataresource: any = [];

	// Selection
	selection = new SelectionModel<EnquiriesModel>(true, []);
	enquiriesResult: EnquiriesModel[] = [];
	enquiryTypeResult$ = new BehaviorSubject<any[]>([]);
	// Subscriptions
	private subscriptions: Subscription[] = [];
	enquiryType: number = 1;
	viewLoading = false;
	filterForm: FormGroup = new FormGroup({});
	statusItems: any;

	selectedUserId = ""; //Utilities.getCurrentUser().profileId;

	employeeItems$ = new BehaviorSubject<any>([]);

	constructor(private router: Router, private filterFB: FormBuilder, private layoutUtilsService: LayoutUtilsService, private dialog: MatDialog, public snackBar: MatSnackBar, private translate: TranslationService, private enquiriesService: EnquiryService, public subheaderService: SubheaderService) {
		super();
	}

	ngOnInit() {
		// load user MIS
		this.getEnquiryCurrentStatus(); //TODO
		this.initFilterForm();

		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				tap(() => {
					this.loadData();
				})
			)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);
		// First load
		this.loadData(true);
		this.setUpSubHeader();
		//this.getEmployeeList();
	}

	setUpSubHeader() {
		//this.subheaderService.setToolBarAddButton({}); //TODO
		this.subheaderService.setToolBarAddButton({click:()=>{
			this.router.navigateByUrl(`/edi-mart/add-enquiry`);
		}})
	}

	initFilterForm() {
		this.filterForm = this.filterFB.group({
			EnquiryTypeCode: [this.enquiryType],
			PartyName: [null],
			Mobile: [null],
			City: [null],
			Email: [null],
			EnquiryId: [null],
			ProductIds: [null],
			Status: [null],
			States: [null],
			FollowupDateRange: this.filterFB.group({
				startDate: null,
				endDate: null,
			}),
			CreatedDateRange: this.filterFB.group({
				startDate: null,
				endDate: null,
			}),
		});
	}

	clearFilter() {
		this.initFilterForm();

		this.onFilterSubmit();
	}

	private loadData(firstLoad: boolean = false) {
		this.selection.clear();
		this.dataSource.loading$ = of(true);
		const filterReq = this.filterForm.value;

		if (!isNullOrEmpty(filterReq.CreatedDateRange.startDate) && !isNullOrEmpty(filterReq.CreatedDateRange.endDate)) {
			filterReq.CreatedDateRange.startDate = toServerDate(filterReq.CreatedDateRange.startDate);
			filterReq.CreatedDateRange.endDate = toServerDate(filterReq.CreatedDateRange.endDate);
		}

		if (!isNullOrEmpty(filterReq.FollowupDateRange.startDate) && !isNullOrEmpty(filterReq.FollowupDateRange.endDate)) {
			filterReq.FollowupDateRange.startDate = toServerDate(filterReq.FollowupDateRange.startDate);
			filterReq.FollowupDateRange.endDate = toServerDate(filterReq.FollowupDateRange.endDate);
		}

		const queryParams = new QueryParamsModel(filterReq, this.sort.direction === "" ? "desc" : this.sort.direction, this.sort.active === undefined ? "ModifiedOn" : this.sort.active, this.paginator.pageIndex, firstLoad ? 10 : this.paginator.pageSize === undefined ? 10 : this.paginator.pageSize);
		this.enquiriesService
			.findEnquiries(this.enquiryType, queryParams)

			.then((response) => {
				const resultData: any[] = getDefaultArray(response.items);

				resultData.forEach((x) => {
					x["Child"] = `<div class="d-flex justify-content-start flex-column">
					<span href="#" class="text-dark fw-bolder text-hover-primary fs-6"><button mat-icon-button color="primary"<mat-icon>child_care</mat-icon></button>&nbsp${x.ChildName}</span>
					<span class="text-muted fw-bold text-muted d-block fs-7">${x.ParentName}</span>
				</div>`;
					x["Contact"] = `<div class="d-flex justify-content-start flex-column">
					<span href="#" class="text-dark fw-bolder text-hover-primary fs-6">${x.Mobile}</span>
					<span class="text-muted fw-bold text-muted d-block fs-7">${x.Email}</span>
				</div>`;
					x["City"] = `<div class="d-flex justify-content-start flex-column">
					<span href="#" class="text-dark fw-bolder text-hover-primary fs-6">${x.City}</span>
					<span class="text-muted fw-bold text-muted d-block fs-7">${x.StateName}</span>
				</div>`;
				});
				this.dataSource.entitySubject.next(resultData);
				this.dataSource.paginatorTotalSubject.next(response.totalCount);
				this.enquiriesResult = resultData;
			})
			.finally(() => {
				this.dataSource.loading$ = of(false);
				this.viewLoading = false;
			});
	}

	getEnquiryCurrentStatus() {
		this.enquiriesService
			.getUserEnquiryTypeStatusReport()
			.finally(() => {
				this.dataSource.loading$ = of(false);
				this.takeUntilDestroy();
			})
			.then((res) => {
				let todays = 0,
					newPending = 0,
					followups = 0,
					followupPending = 0,
					future = 0;
					res.items?.forEach((element:any) => {
						todays = todays + getDefaultInt(element.todays);
						newPending = newPending + getDefaultInt(element.newPendings);
						followups = followups + getDefaultInt(element.followups);
						followupPending = followupPending + getDefaultInt(element.followupPendings);
						future = future + getDefaultInt(element.future);
					});

				const enquiryTypeResult: any = [];
				enquiryTypeResult.push({ EnquiryTypeId: 1, EnquiryTypeName: "Todays", Total: todays });
				enquiryTypeResult.push({ EnquiryTypeId: 3, EnquiryTypeName: "NewPendings", Total: newPending });
				enquiryTypeResult.push({ EnquiryTypeId: 2, EnquiryTypeName: "Followups", Total: followups });
				enquiryTypeResult.push({ EnquiryTypeId: 4, EnquiryTypeName: "FollowupPendings", Total: followupPending });
				enquiryTypeResult.push({ EnquiryTypeId: 5, EnquiryTypeName: "Future", Total: future });
				this.enquiryTypeResult$.next(enquiryTypeResult);
			});
	}

	/**
	 * Apply filter on key press
	 */
	public onFilterSubmit() {
		this.viewLoading = true;
		this.paginator.pageIndex = 0;
		this.loadData();
	}

	override ngOnDestroy() {
		//this.subheaderService.showToolBarAddBtn$.next(false); //TODO
		this.subheaderService.resetTooBar()
		this.subscriptions.forEach((el) => el.unsubscribe());
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.enquiriesResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.enquiriesResult.length) {
			this.selection.clear();
		} else {
			this.enquiriesResult.forEach((row) => this.selection.select(row));
		}
	}

	updateStatusForEnquiries() {
		const changeStatusLabels: any = {
			title: this.translate.getTranslation("CRUD.UPDATE_STATUS.TITLE", {
				name: "Enquiries",
			}),
			waitDesciption: this.translate.getTranslation("CRUD.CHANGE_WAIT_DESCRIPTION", { name: "Enquiries" }),
			message: this.translate.getTranslation("CRUD.UPDATE_STATUS.MESSAGE", { name: "Enquiries" }),
			selectRecord: this.translate.getTranslation("CRUD.DELETE_ENTITY_FORM.SELECT_RECORD"),
		};

		const statuses = Utilities.getEntityStatus();
		const messages: any[] = [];

		this.selection.selected.forEach((elem) => {
			messages.push({
				text: `${elem.partyName}`,
				id: elem.enquiryId.toString(),
				status: elem.status,
				statusTitle: Utilities.getItemStatusString(elem.status),
				statusCssClass: Utilities.getItemCssClassByStatus(elem.status),
			});
		});

		const dialogRef = this.layoutUtilsService.updateStatusForEntities(changeStatusLabels.title, statuses, messages);
		const changeStatusSubscription = dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				// this.selection.clear();
				return;
			}

			const idsForUpdate: number[] = [];
			for (const selectedItem of this.selection.selected) {
				idsForUpdate.push(selectedItem.enquiryId);
			}

			if (idsForUpdate.length === 0) {
				this.layoutUtilsService.showActionNotification(changeStatusLabels.selectRecord, MessageType.Delete);
				return;
			}

			this.layoutUtilsService.startLoadingMessage(changeStatusLabels.waitDesciption);
			this.enquiriesService
				.changeEnquiriesStatus(res, idsForUpdate)
				.finally(() => {
					this.layoutUtilsService.stopLoadingMessage();
				})
				.then((response) => {
					if (response.isSuccess) {
						this.selection.clear();
						this.loadData();
					}
				});
		});
		this.subscriptions.push(changeStatusSubscription);
	}

	deleteEnquiries() {
		const deleteFormLabels: any = {
			title: this.translate.getTranslation("CRUD.DELETE_ENTITY_FORM.TITLE", { name: "enquiries" }),
			description: this.translate.getTranslation("CRUD.DELETE_ENTITY_FORM.DESCRIPTION", { name: "enquiries" }),
			waitDesciption: this.translate.getTranslation("CRUD.DELETE_ENTITY_FORM.WAIT_DESCRIPTION", { name: "enquiries" }),
			deleteMessage: this.translate.getTranslation("CRUD.DELETE_ENTITY_FORM.MESSAGE", { name: "enquiries" }),
			selectRecord: this.translate.getTranslation("CRUD.DELETE_ENTITY_FORM.SELECT_RECORD"),
		};

		const dialogRef = this.layoutUtilsService.deleteElement(deleteFormLabels.title, deleteFormLabels.description, deleteFormLabels.waitDesciption);
		const deleteDialogSubscription = dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}

			const idsForDeletion: number[] = [];
			for (const selectedItem of this.selection.selected) {
				idsForDeletion.push(selectedItem.enquiryId);
			}

			if (idsForDeletion.length === 0) {
				this.layoutUtilsService.showActionNotification(deleteFormLabels.selectRecord, MessageType.Delete);
				return;
			}

			this.layoutUtilsService.startLoadingMessage(deleteFormLabels.waitDesciption);
			this.enquiriesService
				.deleteEnquiries(idsForDeletion)
				.finally(() => {
					this.layoutUtilsService.stopLoadingMessage();
				})
				.then((response) => {
					if (response.isSuccess) {
						this.selection.clear();
						this.loadData();
					}
				});
		});

		this.subscriptions.push(deleteDialogSubscription);
	}

	// addEnquiries() {
	// 	debugger;
	// 	const newEnquiries = new EnquiriesModel();
	// 	newEnquiries.clear(); // Set all defaults fields
	// 	this.editEnquiries(newEnquiries);
	// }

	editEnquiries(item: EnquiriesModel) {
		this.router.navigateByUrl(`/edi-mart/edit/${item.enquiryId}/enquiry`);
		// const dialogRef = this.dialog.open(EnquiriesEditDialogComponent, {
		// 	data: { EnquiryId: item.enquiryId },
		// 	disableClose: true,
		// });
		// dialogRef.afterClosed().subscribe((res) => {
		// 	if (!res) {
		// 		return;
		// 	}
		// 	this.loadData();
		// 	//this.getEnquiryCurrentStatus();
		// });
	}

	viewEnquiries(item: EnquiriesModel) {
		const dialogRef = this.dialog.open(EnquiryViewDialogComponent, {
			data: { EnquiryId: item.enquiryId },
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}
		});
	}

	editFollowup(item: EnquiriesModel) {
		this.router.navigateByUrl(`/edi-mart/enquiries/${item.enquiryId}/followups`);
	}

	rbtEnquiryTypeChange($event: { value: string }) {
		this.enquiryType = parseInt($event.value, 0);
		this.paginator.pageIndex = 0;
		this.loadData();
	}
}
