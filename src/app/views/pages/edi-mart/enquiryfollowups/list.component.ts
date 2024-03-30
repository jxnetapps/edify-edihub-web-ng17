// Angular
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

// RXJS
import { of, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

// Layout
import { LayoutUtilsService, BaseDataSource, MessageType } from '../../../../core/_base/crud';
import { Utilities } from '../../../../core/_helpers/utilities';

// Modules/Services
import { EnquiryFollowupsModel } from '../_models';
import { EnquiryFollowupsService } from '../_services';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'kt-enquiryfollowups-list',
	templateUrl: './list.component.html',
	styleUrls:['./list.component.scss']
})
export class EnquiryFollowupsListComponent implements OnInit, OnDestroy {
	displayedColumns = ['id', 'Status', 'NextFollowupDate', 'followupCreatedDate','followupCreatedBy','Remarks'];
	dataSource = new BaseDataSource();

	// Selection
	selection = new SelectionModel<EnquiryFollowupsModel>(true, []);
	enquiryfollowupsResult: EnquiryFollowupsModel[] = [];
	// Subscriptions
	private subscriptions: Subscription[] = [];

	constructor(
		private _cdr: ChangeDetectorRef,
		public snackBar: MatSnackBar,
		private enquiryfollowupsService: EnquiryFollowupsService,
	) { }

	ngOnInit() {
		// First load
		//this.loadData(true);
	}

	public loadData(enquiryId: number) {
		this.selection.clear();
		this.dataSource.loading$ = of(true);
		this.enquiryfollowupsService.getByEnquiryId(enquiryId)
			.finally(() => {
				this.dataSource.loading$ = of(false);
			})
			.then(
				(response) => {
					const resultData = response.items == null ? [] : response.items;
					this.dataSource.entitySubject.next(resultData);
					this.dataSource.hasItems$.next(resultData.length > 0)
					this.dataSource.paginatorTotalSubject.next(resultData.length);
					this.enquiryfollowupsResult = resultData;
					this._cdr.detectChanges()
				});
	}

	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	getNextFollowupDateTime(item: any){

		if(item.nextFollowupDateText)
		{
			if(item.followupTime)
			{
			   return `${item.nextFollowupDateText} at ${item.followupTime}`
			}

			return `${item.nextFollowupDateText}`
		}

 return '';
         
	}
}
