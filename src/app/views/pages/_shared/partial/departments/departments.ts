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
import {
	FormControl,
	NG_VALUE_ACCESSOR,
} from "@angular/forms";

/**
 * Usage:
 * <kt-jx-shared-departments [control]="control" [(selectedItem)]="selectedItem" [(selectedValue)]="selectedValue" (selectChange)="yourMethod($event)" [multiple]="true"></kt-shared-departments>
 * */

@Component({
	selector: "kt-jx-shared-departments",
	templateUrl: "./departments.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SharedDepartmentsComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedDepartmentsComponent	implements OnChanges, OnInit {

	@Input() selectedValue : any;
	@Input() multiple = false;
	@Input() control!: FormControl;	
	@Output() selectChange = new EventEmitter<number>();

	constructor() {}

	ngOnChanges(_changes: SimpleChanges) {
	}

	ngOnInit(): void {
	}	

	selectChanged(selectedItem: any) {
		this.selectChange.emit(selectedItem);
	}
}
