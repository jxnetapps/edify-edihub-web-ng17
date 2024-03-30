import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LayoutUtilsService, TranslationService } from "../../../../../core";
import { EnquiryService } from "../../_services";
import { MarketingMaterialModel } from "../../_models";
import { Subscription } from "rxjs";
import { JxBaseComponent, JxFormConfig, JxHttpService } from "jx-ng-core";

@Component({
  selector: 'edify-material-edit',
  templateUrl: './material-edit.component.html',
  styleUrls: ['./material-edit.component.scss']
})
export class MaterialEditComponent extends JxBaseComponent implements OnInit, OnDestroy{
	formConfig: JxFormConfig = new JxFormConfig();
	enquiry: any;
	materialModel: MarketingMaterialModel = new MarketingMaterialModel;
	private subscriptions: Subscription[] = [];

	constructor(private router: Router, private fb: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
    private cdr: ChangeDetectorRef,
		private activatedRoute: ActivatedRoute,
		private _appHttp: JxHttpService,
		private enquiryService: EnquiryService, private translate: TranslationService) {
		super();
	}

	ngOnInit() {
		this.createForm();
    const componentSubscriptions = this.activatedRoute.params.subscribe(params => {
			const id = params['id'];
			if (id) {
				this._appHttp.getHttp$<MarketingMaterialModel>(`/v1/marketing/materials/${id}`, true)
					.then(
						(response) => {
							if (response) {
								this.materialModel = response;
                this.formConfig.formGroup.patchValue(this.materialModel)
								this.cdr.detectChanges();
							}
						}).finally(() => {
						});
			}
		});
		this.subscriptions.push(componentSubscriptions);
	}

	createForm() {
		this.formConfig.formGroup = this.fb.group({
			// name: [null, Validators.required],
			// subject: [null, Validators.required],
			// body: [null, Validators.required],
			name: [null, Validators.required],
			subject: [null, Validators.required],
			body: [null, Validators.required],
			files: [null],
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
			.updateMaterial$(this.materialModel.id,material)
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

  
	override ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}
}

