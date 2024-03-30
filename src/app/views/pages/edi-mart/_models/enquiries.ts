import { BaseModel } from '../../../../core/_base/crud';

export class EnquiriesModel extends BaseModel {
	reportingPersonId!: string;
  enquiryId!: number;
  partyName!: string;
  email!: string;
  mobile!: string;
  city!: string;
  createdDate!: string;
  productName!: string;
  stateName!: string;
  status!: number;
  productId!: number;
  stateId!: number;
  enquiryType!: string;

	clear(): void {
		
	}
}
