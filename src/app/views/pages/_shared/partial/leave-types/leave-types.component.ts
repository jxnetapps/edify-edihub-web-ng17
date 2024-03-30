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
 * <kt-jx-shared-leave-types [control]="form.get('controlname')" [(selectedItem)]="selectedItem" [(selectedValue)]="selectedValue" (selectChange)="yourMethod($event)" [multiple]="true"></kt-jx-shared-leave-types>
 * */

@Component({
	selector: "kt-jx-shared-leave-types",
	templateUrl: './leave-types.component.html',
  styleUrls: ['./leave-types.component.scss']	
})
export class SharedLeaveTypesComponent	implements OnChanges, OnInit {

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
