
// Angular
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
	templateUrl: './tasks.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksModuleComponent implements OnInit {
	/**
	 * Component constructor
	 */
	constructor() {}

	/**
	 * On init
	 */
	ngOnInit() {}
}
