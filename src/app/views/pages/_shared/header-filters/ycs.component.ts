import {
	Component, EventEmitter, OnChanges, Output,
	SimpleChanges, OnInit, OnDestroy, ChangeDetectorRef, Input, ChangeDetectionStrategy, forwardRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LayoutUtilsService, AppDBkeys } from '../../../../core';

/**
 * <kt-shared-ycs-filter [viewLoading]="true" (submitChange)="applyFilter($event)"></kt-shared-ycs-filter>
 * public applyFilter(filterValue: YCSModelArgs) { console.log(filterValue);}
 */

@Component({
	selector: 'kt-shared-ycs-filter',
	templateUrl: './ycs.component.html',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => YCSFilterSharedComponent),
			multi: true
		}
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class YCSFilterSharedComponent implements OnChanges, OnInit, OnDestroy {

	// Private properties
	private subscriptions: Subscription[] = [];
	filterForm: FormGroup = new FormGroup({});
	selectedAcademicYearId = 0;
	selectedClassId = 0;
	selectedSectionId = 0;
	@Input() enableAuthorization = false;
	@Input() viewLoading = false;
	@Output() submitChange = new EventEmitter<YCSModelArgs>();


	constructor(private layoutUtilsService: LayoutUtilsService,
		private filterFB: FormBuilder,
	) { }

	ngOnChanges(changes: SimpleChanges) {
		// console.log(changes);
	}

	ngOnInit(): void {
		this.viewLoading = false;
		this.selectedAcademicYearId = parseInt(localStorage.getItem(AppDBkeys.DEFAULT_ACADEMICYEARID) as string, 0);
		this.createForm();
	}
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	createForm() {
		this.filterForm = this.filterFB.group({
			AcademicYearId: [0, Validators.required],
			ClassId: [0, Validators.required],
			SectionId: [0, Validators.required],
		});
	}

	academicYearSelectChanged(selectedId: any) {
		this.selectedAcademicYearId = selectedId;
	}

	classSelectChanged(selectedId: any) {
		this.selectedClassId = selectedId;
	}

	sectionSelectChanged(selectedId: any) {
		this.selectedSectionId = selectedId;
	}

	onSubmit() {
		if (this.selectedSectionId > 0) {
			let savParamters: YCSModelArgs = { AcademicYearId: this.selectedAcademicYearId, SectionId: this.selectedSectionId, ClassId: this.selectedClassId };

			this.submitChange.emit(savParamters);
		} else {
			this.layoutUtilsService.showActionNotification('Please select section..!');
		}
	}
}

export interface YCSModelArgs {
	AcademicYearId: number,
	ClassId: number,
	SectionId: number
}
