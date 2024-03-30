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
import {
	FormControl,
	NG_VALUE_ACCESSOR,
} from "@angular/forms";

/**
 * Usage:
 * <kt-jx-shared-fee-reports [control]="feemastersForm.get('TermId')" [multiple]="true"></kt-jx-shared-fee-reports>
 * */

@Component({
	selector: "kt-jx-shared-fee-reports",
	templateUrl: "./fee-reports.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SharedFeeReportsComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFeeReportsComponent implements OnChanges, OnInit {

	@Input() selectedValue: any;
	@Input() multiple = false;
	@Input() control!: FormControl;// = new FormControl();	
	@Output() selectChange = new EventEmitter<number>();
	@Input() dataSource = [
		{ FeeReportType: 'out-standing-reports', Name: 'Out standing report' },
		{ FeeReportType: 'fee-type-out-standing-report', Name: 'Fee type out standing report' },
		{ FeeReportType: 'term-out-standing-report', Name: 'Term out standing report' },
		{ FeeReportType: 'year-consolidated-report', Name: 'Year Consolidated Report' },
		{ FeeReportType: 'day-transaction-report', Name: 'Day transaction Report' },
		{ FeeReportType: 'fee-assigned-status-report', Name: 'Fee Assigned Status Report' },
		{ FeeReportType: 'student-bill-pending-prep-report', Name: 'Student Pending Bill Preparation' },
	];

	constructor() { }

	ngOnChanges(changes: SimpleChanges) {
		//console.log(changes);
	}

	ngOnInit(): void {
	}

	selectChanged(selectedItem: number | undefined) {
		//console.log(selectedItem);
		this.selectChange.emit(selectedItem);
	}
}
