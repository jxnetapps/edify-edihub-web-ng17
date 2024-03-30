import { style } from '@angular/animations';
// Angular
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// RXJS
import { Subscription } from 'rxjs';

// Modules/Services
import { EnquiriesModel } from '../_models';
import { EnquiryService } from '../_services';
import { LayoutUtilsService, TranslationService } from '../../../../core';

@Component({
	selector: 'kt-enquiries-partial-view',
	templateUrl: './partial-view.component.html',
	styleUrls:['./partial-view.component.scss'],	
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnquiriesPartialViewComponent implements OnInit, OnDestroy {
	// Public properties
	enquiry: EnquiriesModel = new EnquiriesModel;

	// Private properties
	private subscriptions: Subscription[] = [];

	constructor(private cdr: ChangeDetectorRef,
		private layoutUtilsService: LayoutUtilsService,
		private enquiriesService: EnquiryService,
		private translate: TranslationService) { }

	ngOnInit() { }

	public getEnquiries(enquiryId: number) {
		this.layoutUtilsService.startLoadingMessage();
		this.enquiriesService.getEnquiriesById(enquiryId)
			.then(
				(response) => {
					if (response) {
						this.enquiry = response;
						this.cdr.detectChanges();
					}
				}).finally(() => {
					this.layoutUtilsService.stopLoadingMessage();
				});
	}

	getTitle(): string {
		let result = this.translate.getTranslation('CRUD.EDIT.CREATE_ENTITY', { name: 'Enquiries' });

		if (!this.enquiry || !this.enquiry.enquiryId) {
			return result;
		}

		result = this.translate.getTranslation('CRUD.EDIT.EDIT_ENTITY', { name: 'enquiry', title: this.enquiry.partyName });

		return result;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	getGender(id: number) {
		return id === 1 ? 'Male' : id === 2 ? 'Female' : 'Other';
	}
}
