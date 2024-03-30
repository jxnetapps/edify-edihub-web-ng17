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
 * <kt-jx-shared-gender [control]="fConfig.fGroup.get('Gender')" [(selectedItem)]="selectedItem" [(selectedValue)]="selectedValue" (selectChange)="yourMethod($event)" [multiple]="true"></kt-jx-shared-gender>
 * */

@Component({
	selector: "kt-jx-shared-gender",
	templateUrl: "./gender.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SharedGenderComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedGenderComponent implements OnInit {

	loadOnInit = true;
	loadOnChange = false;

	@Input() selectedValue = null;
	@Input() multiple = false;
	@Input() control!: FormControl;// = new FormControl();	
	@Output() selectChange = new EventEmitter<number>();
	url = `api/common/gender`;

	constructor() {}	

	ngOnInit(): void {}	

	selectChanged(selectedItem: number | undefined) {
		//this.selectedValue = selectedItem.ClassId;
		this.selectChange.emit(selectedItem);
	}
}
