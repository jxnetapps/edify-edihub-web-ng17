import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { finalize } from "rxjs/operators";
import { LayoutUtilsService, TranslationService } from "../../../../../core";
import { EnquiryService } from "../../_services";
import { JxBaseComponent, JxFormConfig } from "jx-ng-core";

@Component({
	selector: 'edify-edit-enquiry',
	templateUrl: './edit-enquiry.component.html',
	styleUrls: ['./edit-enquiry.component.scss']
})
export class EditEnquiryComponent extends JxBaseComponent implements OnInit {
	formConfig: JxFormConfig = new JxFormConfig();
	enquiry: any;
	enquiryId: number = 0;

	constructor(private router: Router,
		private activatedRoute: ActivatedRoute,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private layoutUtilsService: LayoutUtilsService,
		private enquiryService: EnquiryService) {
		super();
	}

	ngOnInit() {
		this.createForm();
		this.activatedRoute.params.pipe(finalize(() => {
			this.takeUntilDestroy()
		})).subscribe(params => {
			this.enquiryId = params['enquiryId'];
			if (this.enquiryId && this.enquiryId > 0) {
				this.getEnquiryById(this.enquiryId);
			}
		});
	}

	createForm() {
		this.formConfig.formGroup = this.fb.group({
			reportingPersonId: [null, Validators.required],
			productId: [null, Validators.required],
			stateId: [null, Validators.required],
			partyName: [null, Validators.required],
			email: [null, Validators.required],
			mobile: [null, Validators.required],
			landLineNo: [null],
			address: [null, Validators.required],
			city: [null, Validators.required],
			companyName: [null],
			area: [null],
			investmentCapacity: [null],
			source: [null, Validators.required],
			remarks: [null, Validators.required]
		});
	}

	getEnquiryById(enquiryId: number) {
		this.layoutUtilsService.startLoadingMessage();
		this.formConfig.formLoading = true;
		this.enquiryService.getEnquiriesById(enquiryId)
			.finally(() => {
				this.layoutUtilsService.stopLoadingMessage();
				this.formConfig.formLoading = false;
				this.takeUntilDestroy();
			})
			.then(
				(response: any) => {
					if (response) {
						this.enquiry = response;
						this.formConfig.formGroup.patchValue(this.enquiry);
						this.cdr.detectChanges();
					}
				});
	}

	goBackToList() {
		this.router.navigateByUrl(`/edi-mart`);
	}

	onSubmit(withBack: boolean = false) {
		this.formConfig.saving = false;
		const dataToBeSaved: any = this.formConfig.formGroup.value;
		dataToBeSaved['enquiryId'] = this.enquiryId;
		this.save(dataToBeSaved, withBack);
	}

	save(enquiry: any, withBack: boolean = false) {
		this.formConfig.saving = true;
		this.layoutUtilsService.startLoadingMessage();
		this.enquiryService
			.updateEnquiry(enquiry)
			.finally(
				() => {
					this.layoutUtilsService.stopLoadingMessage();
					this.formConfig.saving = false;
					this.takeUntilDestroy();
				}
			)
			.then(
				(response) => {
					if (response.isSuccess) {
						if (withBack) {
							this.goBackToList();
						}
						else {
							this.createForm();
						}
					}
				}
			);
	}
}
