
// Angular
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { JxBaseComponent, JxMatTableComponent, JxMatTableConfig } from 'jx-ng-core';

@Component({
	templateUrl: './active-users.html',
    selector:'preadmissions-active-users'
})
export class PreAdmActiveUsersComponent extends JxBaseComponent implements OnInit , OnChanges {
	@ViewChild(JxMatTableComponent, { static: true })
	jxmattable!: JxMatTableComponent;
	@Input() reloadGrid = false;
	displayColumns = [
		{ key: 'EmployeeName', display: 'Employee Name'},		
		{ key: 'AssignedGrades', display: 'Assigned Grades'},		
	];

	configSettings = {
		entityName: 'Active Users',
		primaryColumn: 'Id',		
		list:{
			httpType:'GET',
			url: 'api/preadmissions/usersinclass/active-users-grades',
			displayColumns: this.displayColumns,
			enableSearch: false,
		}
	};

	config = new JxMatTableConfig(this.configSettings);

	constructor(
	) {
		super();
	}

	ngOnInit() { }

	ngOnChanges(changes: SimpleChanges) {
		
		let change = changes['reloadGrid'];
		
		if(!change.firstChange && this.reloadGrid){
			this.jxmattable.refresh();
			this.reloadGrid = false;
		}
	}

	// onActionChanged(event: JxMatTableActionItem) {
	// 	if (event.action === 'edit') {
	// 		this.editAcademicGroup(event.selectedItem);
	// 	}
	// }
}
