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
 * <kt-jx-shared-class-teacher-grades [control]="fConfig.fGroup.get('ClassId')" [academicYearId]="academicYearId" [(selectedItem)]="selectedItem" [(selectedValue)]="selectedValue" (selectChange)="yourMethod($event)" [multiple]="true"></kt-jx-shared-class-teacher-grades>
 * */

@Component({
	selector: "kt-jx-shared-class-teacher-grades",
	templateUrl: "./class-teacher-grades.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SharedAcademicClassTeacherGradesComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedAcademicClassTeacherGradesComponent implements OnChanges, OnInit {

	@Input() loadOnInit = false;
	@Input() loadOnChange = true;

	@Input() academicYearId = Utilities.getDefaultAcademicYear();
	@Input() teacherId = 0;;
	@Input() selectedValue = null;
	@Input() multiple = false;
	@Input() control!: FormControl;
	@Output() selectChange = new EventEmitter<number>();
	url = `v1/academics/grades/academic-years/${this.academicYearId}/teachers/${this.teacherId}`;

	constructor() {}

	ngOnChanges(changes: SimpleChanges) {
		this.url = `v1/academics/grades/academic-years/${this.academicYearId}/teachers/${this.teacherId}`;

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
		this.url = `v1/academics/grades/academic-years/${this.academicYearId}/teachers/${this.teacherId}`;
	}	

	selectChanged(selectedItem: number | undefined) {
		//this.selectedValue = selectedItem.ClassId;
		this.selectChange.emit(selectedItem);
	}	
}
