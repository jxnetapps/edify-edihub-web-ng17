// Angular
import { Component, OnInit } from '@angular/core';
// Services
// Widgets model
import { Utilities } from '../../../core/_helpers';

@Component({
	selector: 'kt-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

	academicYearId = 0;
	roleId = 0;	
	public showXAxis = true;
	public showYAxis = true;
	public gradient = false;
	public showLegend = false;
	public showXAxisLabel = true;
	public xAxisLabel = 'Country';
	public showYAxisLabel = true;
	public yAxisLabel = 'Sales';
	public colorScheme = {
		domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#F47B00', '#606060']
	};


	constructor() {
	}

	ngOnInit(): void {
		this.academicYearId = Utilities.getDefaultAcademicYear();
		this.roleId = Utilities.getCurrentUserRole();
	}

	public onSelect(event: any) {
		console.log(event);
	}
}
