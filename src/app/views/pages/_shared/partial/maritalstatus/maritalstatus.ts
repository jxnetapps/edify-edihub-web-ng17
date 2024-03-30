import {
	Component,
	EventEmitter,
	Input,
	Output,
	OnInit,
	ChangeDetectionStrategy,
	forwardRef,
} from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";

/**
 * Usage:
 * <kt-jx-shared-maritalstatus [control]="control" [(selectedItem)]="selectedItem" [(selectedValue)]="selectedValue" (selectChange)="yourMethod($event)" [multiple]="true"></kt-jx-shared-maritalstatus>
 * */

@Component({
	selector: "kt-jx-shared-maritalstatus",
	templateUrl: "./maritalstatus.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SharedMaritalstatusComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedMaritalstatusComponent implements OnInit {

	loadOnInit = true;
	loadOnChange = false;

	@Input() selectedValue = null;
	@Input() multiple = false;
	@Input() control!: FormControl;// = new FormControl();	
	@Output() selectChange = new EventEmitter<number>();
	url = `api/common/maritalstatus`;

	constructor() {}	

	ngOnInit(): void {}	

	selectChanged(selectedItem: number | undefined) {
		//this.selectedValue = selectedItem.ClassId;
		this.selectChange.emit(selectedItem);
	}
}
