// Angular
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'kt-fetch-entity-dialog',
	templateUrl: './fetch-entity-dialog.component.html'
})
export class FetchEntityDialogComponent implements OnInit {

	messages: any[] = [];
	settings: any;
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<FetchEntityDialogComponent>,
	 * @param data: any
	 */
	constructor(
		public dialogRef: MatDialogRef<FetchEntityDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	ngOnInit(): void {
		this.messages = this.data.messages;
		this.settings = this.data.settings;
	}

	/**
	 * Close dialog with false result
	 */
	onNoClick(): void {
		this.dialogRef.close();
	}

	/** UI */
	/**
	 * Returns CSS Class Name by status type
	 * @param status: number
	 */
	getItemCssClassByStatus(status: number = 0) {
		switch (status) {
			case 0: return 'success';
			case 1: return 'metal';
			case 2: return 'danger';
			default: return 'success';
		}
	}

	getTitle() {
		if (this.data.settings && this.data.settings.headerText) {
			return this.data.settings.headerText;
		}

		return 'Fetch selected elements';
	}
}
