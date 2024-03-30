import { BaseModel } from "../../../../core/_base/crud";

export class EnquiryFollowupsModel {
	enquiryId!: number;
	followupId!: number;
	nextFollowupDate: any;
	followupTime!: string;
	remarks!: string;
	status!: number;
	isActive!: boolean;

	clear(): void {
		this.enquiryId = 0;
		this.followupId = 0;
		this.nextFollowupDate = null;
		this.followupTime = "";
		this.remarks = "";
		this.status = 0;
		this.isActive = false;
	}
}
