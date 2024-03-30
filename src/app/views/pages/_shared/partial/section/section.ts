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
 * <kt-jx-shared-section [control]="fConfig.fGroup.get('SectionId')" [classId]="fConfig.fGroup.get('ClassId')?.value" [(selectedItem)]="selectedItem" [(selectedValue)]="selectedValue" (selectChange)="yourMethod($event)" [multiple]="true"></kt-jx-shared-section>
 * */

@Component({
	selector: "kt-jx-shared-section",
	templateUrl: "./section.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SharedAcademicSectionComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedAcademicSectionComponent implements OnChanges, OnInit {

	loadOnInit = false;
	loadOnChange = false;

	@Input() classId = null;
	@Input() selectedValue = null;
	@Input() multiple = false;
	@Input()
	control!: FormControl;// = new FormControl();	
	@Output() selectChange = new EventEmitter<number>();
	@Input() enableAuthorization = false;
	url = `api/academics/sections/classid/${this.classId}`;

	constructor() {}

	ngOnChanges(changes: SimpleChanges) {
		if(this.classId){
			if(this.enableAuthorization){
				this.url = `api/academics/sections/authorized-sections/${this.classId}/0`;
			}
			else{
				this.url = `api/academics/sections/classid/${this.classId}`;
			}
		}
		
		if (this.classId && this.classId > 0) {
			this.loadOnChange = false;
			for (const propName in changes) {
				if (changes.hasOwnProperty(propName)) {
					switch (propName) {
						case 'classId': {
							this.loadOnChange = true; break;
						}
					}
				}
			}
		}
	}

	ngOnInit(): void {
		if(this.classId){
			if(this.enableAuthorization){
				this.url = `api/academics/sections/authorized-sections/${this.classId}/0`;
			}
			else{
				this.url = `api/academics/sections/classid/${this.classId}`;
			}
		}
	}	

	selectChanged(selectedItem: number | undefined) {
		//this.selectedValue = selectedItem.ClassId;
		this.selectChange.emit(selectedItem);
	}
}
