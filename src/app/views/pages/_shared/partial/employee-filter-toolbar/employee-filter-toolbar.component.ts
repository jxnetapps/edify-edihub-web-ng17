import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
	selector: "kt-employee-filter-toolbar",
	templateUrl: "./employee-filter-toolbar.component.html",
	styleUrls: ["./employee-filter-toolbar.component.scss"],
})
export class EmployeeFilterToolbarComponent implements OnInit {
	
	filterForm!: FormGroup;

	viewLoading: boolean = false;

	@Output() change = new EventEmitter<any>();

	@Input() showEmployee:boolean = true;

	constructor(private filterFB: FormBuilder) {}

	ngOnInit() {
		this.createForm();
	}

	createForm() {
		this.filterForm = this.filterFB.group({
			searchText: [null],
			departmentId: [null],
			employeeId: [null],
		});

		this.filterForm.valueChanges.subscribe((x: any) => {

			const filter: any = Object.entries(x).reduce((a:any, [k, v]) => (v ? ((a[k] = v), a) : a), {});

			// if (filter.searchText?.length <= 1) {
			// 	delete filter["searchText"];
			// }

			this.change.emit(filter);
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

	clearFilter() {
		this.filterForm.controls["departmentId"].setValue(null);
		this.filterForm.controls["employeeId"].setValue(null);
		this.change.emit({});
	}
}
