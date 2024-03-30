import { Component,	EventEmitter, Input, Output,	OnInit, ChangeDetectionStrategy,	forwardRef } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";

/**
 * Usage:
 * <kt-jx-shared-paymodes [control]="fConfig.fGroup.get('controlname')" (selectChange)="yourMethod($event)" [multiple]="true"></kt-jx-shared-paymodes>
 * */

@Component({
	selector: "kt-jx-shared-paymodes",
	templateUrl: "./paymode.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SharedPaymodeComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedPaymodeComponent implements OnInit {
	@Input() selectedValue: any;
	@Input() multiple = false;
	@Input()
	control!: FormControl;
	@Output() selectChange = new EventEmitter<number>();
	dataSource = [
		{ PayModeId: 1, Name: "Cash" },
		{ PayModeId: 2, Name: "Cheque" },
		{ PayModeId: 3, Name: "Online" },
		{ PayModeId: 4, Name: "Payment Gateway" },
	];

	constructor() {}
	
	ngOnInit(): void {}

	selectChanged(selectedItem: number | undefined) {
		//console.log(selectedItem);
		this.selectChange.emit(selectedItem);
	}
}
