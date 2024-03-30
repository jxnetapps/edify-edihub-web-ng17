import { Component,	EventEmitter, Input, Output,	OnInit, ChangeDetectionStrategy,	forwardRef } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";

/**
 * Usage:
 * <kt-jx-shared-academic-terms [control]="[control]="form.get('controlname')""  (selectChange)="yourMethod($event)" [multiple]="true"></kt-jx-shared-academic-terms>
 * */

@Component({
	selector: "kt-jx-shared-academic-terms",
	templateUrl: "./terms.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SharedAcademicTermComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedAcademicTermComponent implements OnInit {
	@Input() selectedValue: any;
	@Input() multiple = false;
	@Input() control!: FormControl;
	@Output() selectChange = new EventEmitter<number>();
	dataSource = [
		{ TermId: 1, Name: "Term 1" },
		{ TermId: 2, Name: "Term 2" },
	];

	constructor() {}
	
	ngOnInit(): void {}

	selectChanged(selectedItem: number | undefined) {
		//console.log(selectedItem);
		this.selectChange.emit(selectedItem);
	}
}
