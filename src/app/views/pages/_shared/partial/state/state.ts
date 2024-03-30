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
 * <kt-jx-shared-state [control]="form.get('StateId')" [countryId]="filterForm.get('CountryId')?.value" [(selectedItem)]="selectedItem" [(selectedValue)]="selectedValue" (selectChange)="yourMethod($event)" [multiple]="true"></kt-jx-shared-state>
 * */

@Component({
	selector: "kt-jx-shared-state",
	templateUrl: "./state.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SharedStateComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedStateComponent implements OnChanges, OnInit {

	loadOnInit = false;
	loadOnChange = false;

	@Input() countryId = null;
	@Input() selectedValue = null;
	@Input() multiple = false;
	@Input()
	control!: FormControl;// = new FormControl();	
	@Output() selectChange = new EventEmitter<number>();
	url = `api/settings/states/country/${this.countryId}`;

	constructor() {}

	ngOnChanges(changes: SimpleChanges) {
		this.url = `api/settings/states/country/${this.countryId}`;
		if (this.countryId && this.countryId > 0) {
			let firstChange = true;
			this.loadOnChange = false;
			for (const propName in changes) {
				if (changes.hasOwnProperty(propName)) {
					let change = changes[propName];
					//console.log(`${propName}:`, change.currentValue);
					firstChange = change.firstChange;
					switch (propName) {
						case 'countryId': {
							this.loadOnChange = true; break;
						}
					}
				}
			}
		}
	}

	ngOnInit(): void {
		this.url = `api/settings/states/country/${this.countryId}`;
	}	

	selectChanged(selectedItem: number | undefined) {
		//this.selectedValue = selectedItem.countryId;
		this.selectChange.emit(selectedItem);
	}
}
