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
 * <kt-jx-shared-country [control]="form.get('CountryId')"></kt-shared-country>
 * */

@Component({
	selector: "kt-jx-shared-country",
	templateUrl: "./country.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SharedCountryComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedCountryComponent	implements OnChanges, OnInit {

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
