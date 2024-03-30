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
 * <jx-shared-institute-group [control]="fConfig.fGroup.get('InstituteGroupId')" [(selectedItem)]="selectedItem" [(selectedValue)]="selectedValue" (selectChange)="yourMethod($event)" [multiple]="true"></jx-shared-institute-group>
 * */

@Component({
	selector: "jx-shared-institute-group",
	templateUrl: "./institute-group.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SharedInstituteGroupComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedInstituteGroupComponent	implements OnChanges, OnInit {

	@Input() selectedValue : any;
	@Input() multiple = false;
	@Input() control!: FormControl;// = new FormControl();	
	@Output() selectChange = new EventEmitter<number>();

	constructor() {}

	ngOnChanges(changes: SimpleChanges) {
		//console.log(changes);
	}

	ngOnInit(): void {
	}	

	selectChanged(selectedItem: number | undefined) {
		this.selectChange.emit(selectedItem);
	}
}
