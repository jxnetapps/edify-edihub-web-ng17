
// Angular
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ICreateResponse, JxBaseComponent, JxFormConfig, JxHttpService } from 'jx-ng-core';
import { LayoutUtilsService } from '../../../../../core';

@Component({
	templateUrl: './add-user.html',
	selector: 'preadmissions-add-user'
})
export class PreAdmAddUserComponent extends JxBaseComponent implements OnInit {
	formConfig: JxFormConfig = new JxFormConfig();
	
	addUserGroup: any;
	@Output() onSuccess = new EventEmitter<boolean>();

	constructor(
		private fb: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
		private httpService: JxHttpService
	) {
		super()
	}

	ngOnInit() {
		this.createForm();
	}

	createForm() {
		this.formConfig.formGroup = this.fb.group({
			EmployeeId: [null, Validators.required],
			GradeIds: [null, Validators.required],
		});
	}

	onSubmit(withBack: boolean = false) {
		this.formConfig.saving = false;
		const dataToBeSaved = this.formConfig.formGroup?.value;
		this.save(dataToBeSaved);
	}

	save(createRequest: any) {
		this.formConfig.saving = true;
		this.layoutUtilsService.startLoadingMessage();
		this.httpService.postHttp$<ICreateResponse>(`api/preadmissions/usersinclass/create`, createRequest)
			.finally(() => {
				this.layoutUtilsService.stopLoadingMessage();
				this.formConfig.saving = false;
				this.takeUntilDestroy();
			})
			.then(
				(response) => {
					if (response.isSuccess) {
						this.createForm();
						this.onSuccess.emit(true);
					}
				});
	}

}
