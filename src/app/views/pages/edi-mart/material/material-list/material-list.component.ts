import { Component, OnInit, ViewChild } from '@angular/core';
import { MarketingMaterialModel } from '../../_models';
import { Router } from '@angular/router';
import { JxBaseComponent, JxMatTableComponent, JxMatTableConfig, JxMatTableActionItem } from 'jx-ng-core';

@Component({
	selector: 'kt-marketing-material-list',
	templateUrl: './material-list.component.html',
	styleUrls: ['./material-list.component.scss']
})
export class MaterialListComponent extends JxBaseComponent {

	@ViewChild(JxMatTableComponent, { static: true })
	jxMatTable!: JxMatTableComponent;
	displayColumns = [
		{ key: 'name', display: 'Name', displayType: 'link' },
		{ key: 'subject', display: 'Subject' },
		{
			key: 'createdOn', display: 'Created On', config: {
				sort: false,
				isDate: true,
				format: "dd MMM yy"
			}
		},
		{ key: "action", display: "Action", config: { isAction: true, showDefaultActions: true } }
	];

	configSettings = {
		entityName: 'Marketing Material',
		primaryColumn: 'id',
		list: {
			httpType: 'GET',
			url: '/v1/marketing/materials',
			displayColumns: this.displayColumns,
			sortActive: 'id',
			sortDirection: 'asc',
			filter: {},
			title: 'Marketing Material',
			enableSearch: true,
			searchColumn: 'id',
		},
		create: {
			url: '/v1/marketing/materials'
		},
		update: {
			url: '/v1/marketing/materials/{id}'
		},
		delete: {
			url: '/v1/marketing/materials'
		}
	};

	config = new JxMatTableConfig(this.configSettings);

	constructor(private router: Router) {
		super();
	}

	ngOnInit() { }

	onActionChanged(event: JxMatTableActionItem) {
		if (event.action === 'edit') {
			this.editMarketingMaterial(event.selectedItem);
		}
	}

	addMarketingMaterial() {
		this.router.navigate(['/edi-mart/manage-materials/add'])
	}

	editMarketingMaterial(item: MarketingMaterialModel) {
		this.router.navigate([`/edi-mart/manage-materials/${item.id}/edit`])
	}

	onColumnClicked(e: any) {
		// console.log(e.data.id)
		this.router.navigate([`/edi-mart/manage-materials/${e.data.id}/view`])
	}
}

