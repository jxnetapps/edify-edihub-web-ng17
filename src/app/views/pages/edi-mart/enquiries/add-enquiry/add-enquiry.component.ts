import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LayoutUtilsService, TranslationService } from "../../../../../core";
import { EnquiryService } from "../../_services";
import { JxBaseComponent, JxFormConfig } from "jx-ng-core";

@Component({
	selector: "kt-enquiry-add",
	templateUrl: "./add-enquiry.component.html",
	styleUrls: ['./add-enquiry.component.scss'],
})
export class AddEnquiryComponent extends JxBaseComponent implements OnInit {
	formConfig: JxFormConfig = new JxFormConfig();
	enquiry: any;

	constructor(private router: Router, private fb: FormBuilder, 
    private layoutUtilsService: LayoutUtilsService, 
    private enquiryService: EnquiryService) {
		super();
	}

	ngOnInit() {
		this.createForm();
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
			remarks: [null, Validators.required],			
			status: [null, Validators.required],
		});
	}

	goBackToList() {
		this.router.navigateByUrl(`/edi-mart`);
	}

	onSubmit(withBack: boolean = false) {
		this.formConfig.saving = false;
		const dataToBeSaved = this.formConfig.formGroup.value;
		this.save(dataToBeSaved, withBack);
	}

	save(enquiry: any, withBack: boolean = false) {
		this.formConfig.saving = true;
		this.layoutUtilsService.startLoadingMessage();
		this.enquiryService
			.createEnquiry(enquiry)
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
						if(withBack){
              this.goBackToList();
            }
            else{
              this.createForm();
            }
					}
				}
			);
	}
}
