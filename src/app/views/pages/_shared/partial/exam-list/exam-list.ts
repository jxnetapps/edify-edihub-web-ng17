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

/**
 * Usage:
 * <kt-jx-shared-exam-list [control]="form.get('ExamId')" [academicYearId]="filterForm.get('AcademicYearId')?.value" [termId]="filterForm.get('TermId')?.value" [classId]="filterForm.get('ClassId')?.value" [(selectedItem)]="selectedItem" [(selectedValue)]="selectedValue" (selectChange)="yourMethod($event)" [multiple]="true"></kt-jx-shared-exam-list>
 * */

@Component({
	selector: "kt-jx-shared-exam-list",
	templateUrl: "./exam-list.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SharedExamListComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedExamListComponent implements OnChanges, OnInit {

	loadOnInit = false;
	loadOnChange = false;

	@Input() academicYearId = null;
	@Input() termId = null;
	@Input() classId = null;
	@Input() selectedValue = null;
	@Input() multiple = false;
	@Input() control!: FormControl;// = new FormControl();	
	@Output() selectChange = new EventEmitter<number>();
	@Input() enableAuthorization = false;
	url = `api/examinations/exams/examlist/${this.academicYearId}/${this.termId}/${this.classId}/`;

	constructor() {}

	ngOnChanges(changes: SimpleChanges) {
		this.url = `api/examinations/exams/examlist/${this.academicYearId}/${this.termId}/${this.classId}/`;

		if (this.academicYearId && this.academicYearId > 0 && this.termId && this.termId > 0 && this.classId && this.classId > 0) {
			let firstChange = true;
			this.loadOnChange = false;
			for (const propName in changes) {
				if (changes.hasOwnProperty(propName)) {
					let change = changes[propName];
					//console.log(`${propName}:`, change.currentValue);
					firstChange = change.firstChange;
					switch (propName) {
						case 'termId': {
							this.loadOnChange = true; break;
						}
					}
				}
			}
		}
	}

	ngOnInit(): void {
		this.url = `api/examinations/exams/examlist/${this.academicYearId}/${this.termId}/${this.classId}/`;
	}	

	selectChanged(selectedItem: number | undefined) {
		//this.selectedValue = selectedItem.ClassId;
		this.selectChange.emit(selectedItem);
	}
}
