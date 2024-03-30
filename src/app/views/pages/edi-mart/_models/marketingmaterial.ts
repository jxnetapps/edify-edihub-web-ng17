import { BaseModel } from '../../../../core/_base/crud';

export class MarketingMaterialModel extends BaseModel {
	id!: string;
	name!: string;
	statusCode!: string;
	subStatusCode!: string;
	createdOn: any;
	attachments: any;

	clear(): void {
		this.id = '';
		this.name = '';
		this.statusCode = '';
		this.subStatusCode = '';
		this.createdOn = null;
	}
}

