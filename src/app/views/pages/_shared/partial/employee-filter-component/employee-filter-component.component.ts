import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
	selector: "kt-shared-employee-filter-component",
	templateUrl: "./employee-filter-component.component.html",
	styleUrls: ["./employee-filter-component.component.scss"],
})
export class EmployeeFilterComponentComponent implements OnInit {
	filterForm!: FormGroup;

	viewLoading: boolean = false;
	@Output() onSubmit = new EventEmitter<any>();

	constructor(private filterFB: FormBuilder) {}

	ngOnInit() {
		this.createForm();
	}

	createForm() {
		this.filterForm = this.filterFB.group({
			departmentId: [null],
			employeeId: [null],
		});
	}

	get departmentChanged() {
		return Number(this.filterForm.controls["departmentId"].value) > 0;
	}

	get getEmployeeApiUrl() {
		const departmentId = Number(this.filterForm.controls["departmentId"].value);
		if (departmentId > 0) return `/v1.2/hrm/employees/lookup?departmentId=${departmentId}`;
		else return `/v1.2/hrm/employees/lookup?`;
	}

	submit() {
		this.onSubmit.emit(this.filterForm.value);
	}

	clearFilter() {
		this.filterForm.controls["departmentId"].setValue(null);
		this.filterForm.controls["employeeId"].setValue(null);
		this.onSubmit.emit({});
	}
}
