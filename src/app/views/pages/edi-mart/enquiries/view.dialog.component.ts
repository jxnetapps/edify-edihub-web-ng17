// Angular
import { Component, OnInit, OnDestroy, Inject, ChangeDetectionStrategy, ViewChild } from '@angular/core';

// Lodash
import * as _lodash from 'lodash';

// RXJS
import { Subscription } from 'rxjs';


// Services and Models
import { EnquiryFollowupsModel } from '../_models';
import { EnquiryFollowupsListComponent } from '../enquiryfollowups/list.component';
import { EnquiriesPartialViewComponent } from './partial-view.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
	selector: 'kt-enquiry-view-dialog',
	templateUrl: './view.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.Default,
})
export class EnquiryViewDialogComponent implements OnInit, OnDestroy {
	// Public properties
	@ViewChild(EnquiryFollowupsListComponent, { static: true })
	enquiryFollowupsList!: EnquiryFollowupsListComponent;
	@ViewChild(EnquiriesPartialViewComponent, { static: true })
	enquiriesViewComponent!: EnquiriesPartialViewComponent;
	enquiryfollowups: EnquiryFollowupsModel = new EnquiryFollowupsModel;
	// Private properties
	private subscriptions: Subscription[] = [];

	constructor(public dialogRef: MatDialogRef<EnquiryViewDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
	}

	ngOnInit() {
		this.changeView(0);
	}

	tabChanged = ($event: { index: number; }): void => {
		this.changeView($event.index);
	}

	changeView(tabIndex: number) {
		if (tabIndex == 0) {
			this.enquiryFollowupsList.loadData(this.data.EnquiryId);
		}
		else if (tabIndex == 1) {
			this.enquiriesViewComponent?.getEnquiries(this.data.EnquiryId);
		}
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
}
