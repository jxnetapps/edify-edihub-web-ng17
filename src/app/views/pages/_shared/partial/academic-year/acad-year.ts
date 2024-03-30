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
 * <kt-jx-shared-academicyear [control]="form.get('controlname')" [(selectedItem)]="selectedItem" [(selectedValue)]="selectedValue" (selectChange)="yourMethod($event)" [multiple]="true"></kt-shared-academicyear>
 * */

@Component({
	selector: "kt-jx-shared-academicyear",
	templateUrl: "./acad-year.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SharedAcademicYearComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedAcademicYearComponent	implements OnChanges, OnInit {

	@Input() selectedValue : any;
	@Input() multiple = false;
	@Input() control!: FormControl;// = new FormControl();	
	@Output() selectChange = new EventEmitter<number>();

	constructor() {}

	ngOnChanges(changes: SimpleChanges) {
		//console.log(changes);
	}

	ngOnInit(): void {
	}	

	selectChanged(selectedItem: number | undefined) {
		this.selectChange.emit(selectedItem);
	}
}
