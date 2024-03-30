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
 * <kt-jx-shared-relation [control]="fConfig.fGroup.get('Relation')" [(selectedItem)]="selectedItem" [(selectedValue)]="selectedValue" (selectChange)="yourMethod($event)" [multiple]="true"></kt-jx-shared-relation>
 * */

@Component({
	selector: "kt-jx-shared-relation",
	templateUrl: "./relation.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SharedRelationComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedRelationComponent implements OnInit {

	loadOnInit = true;
	loadOnChange = false;

	@Input() selectedValue = null;
	@Input() multiple = false;
	@Input()
	control!: FormControl;// = new FormControl();	
	@Output() selectChange = new EventEmitter<number>();
	url = `api/common/relation`;

	constructor() {}	

	ngOnInit(): void {}	

	selectChanged(selectedItem: number | undefined) {
		//this.selectedValue = selectedItem.ClassId;
		this.selectChange.emit(selectedItem);
	}
}
