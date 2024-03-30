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
 * <kt-jx-shared-scholartypes [control]="fConfig.fGroup.get('ScholarTypeId')" [(selectedItem)]="selectedItem" [(selectedValue)]="selectedValue" (selectChange)="yourMethod($event)" [multiple]="true"></kt-jx-shared-scholartypes>
 * */

@Component({
	selector: "kt-jx-shared-scholartypes",
	templateUrl: "./scholartype.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SharedScholartypeComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedScholartypeComponent implements OnInit {

	loadOnInit = true;
	loadOnChange = false;

	@Input() selectedValue = null;
	@Input() multiple = false;
	@Input()
	control!: FormControl;// = new FormControl();	
	@Output() selectChange = new EventEmitter<number>();
	url = `api/hrm/scholartypes/all`;

	constructor() {}	

	ngOnInit(): void {}	

	selectChanged(selectedItem: number | undefined) {
		//this.selectedValue = selectedItem.ClassId;
		this.selectChange.emit(selectedItem);
	}
}
