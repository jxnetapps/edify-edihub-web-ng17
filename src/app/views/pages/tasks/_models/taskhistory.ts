import { BaseModel } from '../../../../core/_base/crud';

export class TaskHistoryModel extends BaseModel {
	TaskId: number;
		TaskHistoryId: number;
		ReplyRemark: string;
		EndDate: any;
		FileDisplayName: string;
		FilePath: string;
		CreatedOn: any;
		CreatedBy: string;
		Status: number;
	
	clear(): void {
			this.TaskId = 0;
			this.TaskHistoryId = 0;
			this.ReplyRemark = '';
			this.EndDate = null;
			this.FileDisplayName = '';
			this.FilePath = '';
			this.CreatedOn = null;
			this.CreatedBy = '';
			this.Status = 0;
		}
}

