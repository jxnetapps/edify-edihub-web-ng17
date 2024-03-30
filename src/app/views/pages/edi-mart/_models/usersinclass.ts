import { BaseModel } from '../../../../core/_base/crud';

export class UsersInClassModel extends BaseModel {
	Id!: number;
		ClassId!: number;
		EmployeeId!: number;
		InstituteId!: number;
		ModifiedOn: any;
		ModifiedBy!: string;
		Status!: number;
	
	clear(): void {
			this.Id = 0;
			this.ClassId = 0;
			this.EmployeeId = 0;
			this.InstituteId = 0;
			this.ModifiedOn = null;
			this.ModifiedBy = '';
			this.Status = 0;
		}
}

