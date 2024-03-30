
// Angular
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ICreateResponse, JxBaseComponent, JxFormConfig, JxHttpService, getDefaultArray } from 'jx-ng-core';
import { BehaviorSubject, finalize } from 'rxjs';
import { LayoutUtilsService, ResponseModel, MessageType } from '../../../../../core';
import { ResponseStatus } from '../../../../../core/_base/crud';

@Component({
	templateUrl: './transform-enquires.html',
	selector: 'preadmissions-transform-enquires'
})
export class PreAdmTransformEnquiresComponent extends JxBaseComponent implements OnChanges, OnInit {
	@Input() reloadGrid = false;
	formConfig: JxFormConfig = new JxFormConfig();
	addUserGroup: any;
	@Output() onSuccess = new EventEmitter<boolean>();
	employeeItems$ = new BehaviorSubject<any>([]);

	constructor(
		private fb: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
		private _httpService: JxHttpService
	) {
		super()
	}

	ngOnInit() {
		this.getEmployeeList();
		this.createForm();
	}

	getEmployeeList() {
		this._httpService.getHttp$('api/preadmissions/usersinclass/active-users')
			.then((res) => {
				this.employeeItems$.next(getDefaultArray(res));
			});
	}

	createForm() {
		this.formConfig.formGroup = this.fb.group({
			fromEmployeeId: [null, Validators.required],
			toEmployeeId: [null, Validators.required],
		});
	}

	ngOnChanges(changes: SimpleChanges) {

		let change = changes['reloadGrid'];

		if (!change.firstChange && this.reloadGrid) {
			this.getEmployeeList();
			this.reloadGrid = false;
		}
	}

	onSubmit(e: any) {
		const actionName = e.action == 'transformonly' ? 'transfer-enquiries' : 'delete-and-transfer-enquiries';		
		this.save(`api/preadmissions/usersinclass/${actionName}/${this.formConfig?.formGroup?.controls['fromEmployeeId'].value}/${this.formConfig.formGroup.controls['toEmployeeId'].value}`);
	}

	save(url: string) {
		this.formConfig.saving = (true);
		this.layoutUtilsService.startLoadingMessage();
		this._httpService.postHttp$<ICreateResponse>(url, {})
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
				}
			);
	}

}
