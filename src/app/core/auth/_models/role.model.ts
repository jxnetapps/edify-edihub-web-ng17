import { BaseModel } from '../../_base/crud';

export class Role extends BaseModel {
    id!: number | undefined;
    title!: string;
    permissions!: number[];
    isCoreRole: boolean = false;

    clear(): void {
        this.id = undefined;
        this.title = '';
        this.permissions = [];
        this.isCoreRole = false;
	}
}
