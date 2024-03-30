import {
	Component,
	OnInit,
	Input,
	ChangeDetectorRef,
	OnDestroy,
	OnChanges,
	SimpleChanges,
} from "@angular/core";
import { JxBaseComponent , JxHttpService} from "../../../../jx-module";
import {
	LayoutUtilsService,
} from "../../../../../core/_base/crud";
import { Utilities } from "../../../../../core/_helpers";

@Component({
	selector: "jx-shared-payment-status-widget",
	templateUrl: "./payment-status.html",
	styleUrls: ["./payment-status.scss"],
})
export class PaymentStatusWidgetComponent extends JxBaseComponent implements OnInit, OnChanges, OnDestroy {
	@Input() dataSource;
	@Input() tenantId = 0;
	@Input() academicYearId = 0;
	@Input() studentId = 0;
	@Input() termId = 0;
	@Input() enableLocalData = false;
	@Input() showProgress = true;
	totalFeeData = [];
	constructor(
		private _httpService: JxHttpService,
		private cdr: ChangeDetectorRef,
		private layoutUtilsService: LayoutUtilsService
	) {
		super();
	}

	ngOnInit() {
		this.academicYearId = Utilities.getDefaultAcademicYear();
		if(this.enableLocalData){
			//this.summary = this.dataSource;
		}else{
			this.loadsummary();
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		let firstChange= true;
        for (const propName in changes) {
			if (changes.hasOwnProperty(propName)) {
			  let change = changes[propName];
			  //console.log(`${propName}:`, change.currentValue);
			  firstChange = change.firstChange;
			//   switch (propName) {
			// 	case 'pageSize': {
			// 	  console.log(`pageSize changed to:`, change.currentValue);
			// 	}
			//   }
			}
		  }

		  if(!firstChange && !this.enableLocalData){
			  this.loadsummary();
		  }
	}
	
	loadsummary = () => {		
		
	};

	ngOnDestroy(): void {
	}
}
