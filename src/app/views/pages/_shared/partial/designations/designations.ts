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
 * <kt-jx-shared-designations [control]="form.get('DesignationId')" [departmentId]="form.get('DepartmentId')?.value"></kt-jx-shared-designations>
 * */

@Component({
	selector: "kt-jx-shared-designations",
	templateUrl: "./designations.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SharedHrmDesignationComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedHrmDesignationComponent implements OnChanges, OnInit {

	loadOnInit = false;
	loadOnChange = false;
	@Input() departmentId = null;
	@Input() selectedValue = null;
	@Input() multiple = false;
	@Input() control!: FormControl;// = new FormControl();	
	@Output() selectChange = new EventEmitter<number>();
	url = `api/hrm/designations/department/${this.departmentId}`;
	
	constructor() {}

	ngOnChanges(changes: SimpleChanges) {
		this.url = `api/hrm/designations/department/${this.departmentId}`;
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

	ngOnInit(): void {
		this.url = `api/hrm/designations/department/${this.departmentId}`;
	}	

	selectChanged(selectedItem: number | undefined) {
		//this.selectedValue = selectedItem.departmentId;
		this.selectChange.emit(selectedItem);
	}
}
