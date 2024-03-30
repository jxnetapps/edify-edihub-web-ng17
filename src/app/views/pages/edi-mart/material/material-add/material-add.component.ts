import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LayoutUtilsService, TranslationService } from "../../../../../core";
import { EnquiryService } from "../../_services";
import { JxBaseComponent, JxFormConfig } from "jx-ng-core";

@Component({
	selector: "kt-material-add",
	templateUrl: "./material-add.component.html",
	styleUrls: ['./material-add.component.scss'],
})
export class MaterialAddComponent extends JxBaseComponent implements OnInit {
	formConfig: JxFormConfig = new JxFormConfig();
	enquiry: any;

	constructor(private router: Router, private fb: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
		private enquiryService: EnquiryService, private translate: TranslationService) {
		super();
	}

	ngOnInit() {
		this.createForm();
	}

	createForm() {
		this.formConfig.formGroup = this.fb.group({
			name: [null, Validators.required],
			subject: [null, Validators.required],
			body: [null, Validators.required],			
			files: [null, Validators.required],
		});
	}

	goBackToList() {
		this.router.navigateByUrl(`/edi-mart/manage-materials`);
	}

	onSubmit(withBack: boolean = false) {
		this.formConfig.saving = false;
		const dataToBeSaved = this.formConfig.formGroup.value;
		this.save(dataToBeSaved, withBack);
	}

	fileSelected(files: any) {
		console.log(this.formConfig.formGroup.value)
		if (files && files.length > 0)
			this.formConfig.formGroup.controls['files'].setValue(files);
	}

	save(material: any, withBack: boolean = false) {
		this.formConfig.saving = true;
		this.layoutUtilsService.startLoadingMessage();
		this.enquiryService
			.addMaterial$(material)
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

