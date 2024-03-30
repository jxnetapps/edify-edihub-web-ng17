import { BaseModel } from '../../../../core/_base/crud';

export class TaskDetailsModel extends BaseModel {
		TaskId: number;
		Subject: string;
		AssignedToId: number;
		AssignedTo: string;
		AssignedById: number;
		AssignedBy: string;
		Priority: number;
		Description: string;
		DueDate: any;
		DueDate2: any;
		CreatedOn: any;
		Status: number;
	
	clear(): void {
			this.TaskId = 0;
			this.Subject = '';
			this.AssignedToId = 0;
			this.AssignedTo = '';
			this.AssignedById = 0;
			this.AssignedBy = '';
			this.Priority = 0;
			this.Description = '';
			this.DueDate = null;
			this.DueDate2 = null;
			this.CreatedOn = null;
			this.Status = 0;
		}
}

