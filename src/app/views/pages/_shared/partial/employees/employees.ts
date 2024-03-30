import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	OnInit,
	ChangeDetectionStrategy,
	forwardRef,
} from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";

/**
 * Usage:
 * <kt-jx-shared-employees [control]="fConfig.fGroup.get('EmployeeId')" [(selectedItem)]="selectedItem" [(selectedValue)]="selectedValue" (selectChange)="yourMethod($event)" [multiple]="true"></kt-jx-shared-employees>
 * */

@Component({
	selector: "kt-jx-shared-employees",
	templateUrl: "./employees.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SharedEmployeesComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedEmployeesComponent implements OnChanges, OnInit {

	@Input() loadOnInit = true;
	@Input() loadOnChange = false;

	@Input() instituteId = 0;
	@Input() departmentId = null;
	@Input() selectedValue = null;
	@Input() label = 'Employee';
	@Input() multiple = false;
	@Input() control!: FormControl;// = new FormControl();	
	@Output() selectChange = new EventEmitter<number>();
	@Output() onLoaded = new EventEmitter<any>();
	url = `/v1.2/hrm/employees/lookup?instituteId=${this.instituteId}&departmentId=${this.departmentId}`;

	constructor() {}

	ngOnInit(): void {
		this.url = `/v1.2/hrm/employees/lookup?instituteId=${this.instituteId}&departmentId=${this.departmentId}`;
	}	

	selectChanged(selectedItem: number | undefined) {
		//this.selectedValue = selectedItem.ClassId;
		this.selectChange.emit(selectedItem);
	}

	ngOnChanges(changes: SimpleChanges) {
		this.url = `/v1.2/hrm/employees/lookup?instituteId=${this.instituteId}&departmentId=${this.departmentId}`;
		if (this.departmentId && this.departmentId > 0) {
			let firstChange = true;
			this.loadOnChange = false;
			for (const propName in changes) {
				if (changes.hasOwnProperty(propName)) {
					let change = changes[propName];
					//console.log(`${propName}:`, change.currentValue);
					firstChange = change.firstChange;
					switch (propName) {
						case 'departmentId': {
							this.loadOnChange = true; break;
						}
					}
				}
			}
		}
	}

	onBindingCompleted(data: any){
		this.onLoaded.emit({dataSource: data});
	}
}
