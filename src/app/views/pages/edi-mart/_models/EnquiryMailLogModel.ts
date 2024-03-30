export class EnquiryMailLogModel {
	id!: string;
	enquiryId!: number;
	senderEmailId!: string;
	receiverEmailId: string;
	ccMailId!: string;
	bccMailId!: string;
	subject: string;
	message: string;
	createdOn: any;
	createdBy!: string;
	attachments: any[] | null;
	constructor(receiverEmailId?: string, subject?: string, message?: string, attachments?: string[]) {
		this.receiverEmailId = receiverEmailId || '';
		this.subject = subject || '';
		this.message = message || '';
		this.attachments = attachments  || null;
	}

	clear(): void {
		this.id = '';
		this.enquiryId = 0;
		this.senderEmailId = '';
		this.receiverEmailId = '';
		this.ccMailId = '';
		this.bccMailId = '';
		this.subject = '';
		this.message = '';
		this.createdOn = null;
		this.createdBy = '';
		this.attachments = null;
	}
}

