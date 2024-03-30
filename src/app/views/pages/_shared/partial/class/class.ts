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
import { Utilities } from "../../../../../core";

/**
 * Usage:
 * <kt-jx-shared-class [control]="fConfig.fGroup.get('ClassId')" [academicYearId]="academicYearId" [(selectedItem)]="selectedItem" [(selectedValue)]="selectedValue" (selectChange)="yourMethod($event)" [multiple]="true"></kt-jx-shared-class>
 * */

@Component({
	selector: "kt-jx-shared-class",
	templateUrl: "./class.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SharedAcademicClassComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedAcademicClassComponent implements OnChanges, OnInit {

	@Input() loadOnInit = false;
	@Input() loadOnChange = true;

	@Input() academicYearId = Utilities.getDefaultAcademicYear();
	@Input() selectedValue = null;
	@Input() multiple = false;
	@Input() control!: FormControl;
	@Input() enableAuthorization = false;
	@Output() selectChange = new EventEmitter<number>();
	@Output() onLoaded = new EventEmitter<any>();
	url = `api/academics/academicyear-classes/all/${this.academicYearId}`;

	constructor() {}

	ngOnChanges(changes: SimpleChanges) {
		if(this.enableAuthorization){
			this.url = `api/academics/academicyear-classes/authorized/${this.academicYearId}/0`;
		}
		else{
			this.url = `api/academics/academicyear-classes/all/${this.academicYearId}`;
		}

		if (this.academicYearId && this.academicYearId > 0) {
			let firstChange = true;
			this.loadOnChange = false;
			for (const propName in changes) {
				if (changes.hasOwnProperty(propName)) {
					let change = changes[propName];
					//console.log(`${propName}:`, change.currentValue);
					firstChange = change.firstChange;
					switch (propName) {
						case 'academicYearId': {
							this.loadOnChange = true; break;
						}
					}
				}
			}
		}
	}

	ngOnInit(): void {
		if(this.enableAuthorization){
			this.url = `api/academics/academicyear-classes/authorized/${this.academicYearId}/0`;
		}
	}	

	selectChanged(selectedItem: number | undefined) {
		//this.selectedValue = selectedItem.ClassId;
		this.selectChange.emit(selectedItem);
	}	
}
