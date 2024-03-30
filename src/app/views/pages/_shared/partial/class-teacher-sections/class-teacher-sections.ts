import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, OnInit, ChangeDetectionStrategy, forwardRef } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";

/**
 * Usage:
 * <kt-jx-shared-class-teacher-section [control]="fConfig.fGroup.get('SectionId')" [classId]="fConfig.fGroup.get('ClassId')?.value" [(selectedItem)]="selectedItem" [(selectedValue)]="selectedValue" (selectChange)="yourMethod($event)" [multiple]="true"></kt-jx-shared-class-teacher-section>
 * */

@Component({
	selector: "kt-jx-shared-class-teacher-section",
	templateUrl: "./class-teacher-sections.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SharedAcademicClassTeacherSectionComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedAcademicClassTeacherSectionComponent implements OnChanges, OnInit {
	loadOnInit = false;
	loadOnChange = false;

	@Input() classId = null;
	@Input() employeeId = 0;
	@Input() selectedValue = null;
	@Input() multiple = false;
	@Input() control!: FormControl; // = new FormControl();
	@Output() selectChange = new EventEmitter<number>();
	url = `v1/academics/sections/grades/${this.classId}/teachers/${this.employeeId}`;

	constructor() {}

	ngOnChanges(changes: SimpleChanges) {
		if (this.classId) {
			this.url = `v1/academics/sections/grades/${this.classId}/teachers/${this.employeeId}`;
		}

		if (this.classId && this.classId > 0) {
			this.loadOnChange = false;
			for (const propName in changes) {
				if (changes.hasOwnProperty(propName)) {
					switch (propName) {
						case "classId": {
							this.loadOnChange = true;
							break;
						}
					}
				}
			}
		}
	}

	ngOnInit(): void {
		if (this.classId) {
			this.url = `v1/academics/sections/grades/${this.classId}/teachers/${this.employeeId}`;
		}
	}

	selectChanged(selectedItem: number | undefined) {
		//this.selectedValue = selectedItem.ClassId;
		this.selectChange.emit(selectedItem);
	}
}
