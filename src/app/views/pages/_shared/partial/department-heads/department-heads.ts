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
 * <kt-jx-shared-department-heads [control]="fConfig.fGroup.get('EmployeeId')" [(selectedItem)]="selectedItem" [(selectedValue)]="selectedValue" (selectChange)="yourMethod($event)" [multiple]="true"></kt-jx-shared-department-heads>
 * */

@Component({
	selector: "kt-jx-shared-department-heads",
	templateUrl: "./department-heads.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SharedDepartmentHeadsComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedDepartmentHeadsComponent implements OnChanges, OnInit {

	@Input() loadOnInit = true;
	@Input() loadOnChange = false;

	@Input() instituteId = 0;
	@Input() selectedValue = null;
	@Input() label = 'Dept. Head/Manager';
	@Input() multiple = false;
	@Input() control!: FormControl;// = new FormControl();	
	@Output() selectChange = new EventEmitter<number>();
	@Output() onLoaded = new EventEmitter<any>();
	url = `/v1/hrm/employees/departments/heads?instituteId=${this.instituteId}`;

	constructor() {}

	ngOnChanges(changes: SimpleChanges) {
	}

	ngOnInit(): void {}	

	selectChanged(selectedItem: number | undefined) {
		//this.selectedValue = selectedItem.ClassId;
		this.selectChange.emit(selectedItem);
	}

	onBindingCompleted(data: any){
		this.onLoaded.emit({dataSource: data});
	}
}
