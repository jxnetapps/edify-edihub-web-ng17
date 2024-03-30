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
 * <kt-jx-shared-fee-terms [control]="feemastersForm.get('TermId')" [multiple]="true"></kt-jx-shared-fee-terms>
 * */

@Component({
	selector: "kt-jx-shared-fee-terms",
	templateUrl: "./fee-terms.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SharedFeeTermComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFeeTermComponent	implements OnChanges, OnInit {

	@Input() selectedValue : any;
	@Input() multiple = true;
	@Input() control!: FormControl;// = new FormControl();	
	@Output() selectChange = new EventEmitter<number>();
	dataSource = [{TermId:1, Name:'Term 1'},{TermId:2, Name:'Term 2'},{TermId:3, Name:'Term 3'}];

	constructor() {}

	ngOnChanges(changes: SimpleChanges) {
		//console.log(changes);
	}

	ngOnInit(): void {
	}	

	selectChanged(selectedItem: number | undefined) {
		//console.log(selectedItem);
		this.selectChange.emit(selectedItem);
	}
}
