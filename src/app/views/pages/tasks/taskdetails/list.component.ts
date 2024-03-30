// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
// RXJS

// Modules/Services

@Component({
	selector: 'kt-taskdetails-list',
	templateUrl: './list.component.html',
	styleUrls: []
})
export class TaskDetailsListComponent implements OnInit, OnDestroy {
	activeTabIndex =0;
	constructor(
			) {}

	ngOnInit() { }

	ngOnDestroy() {
	}

	tabChanged(index: number){
		this.activeTabIndex=index;
	}
}
