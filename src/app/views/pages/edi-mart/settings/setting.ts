
// Angular
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
	templateUrl: './setting.html',
    styleUrls:['./setting.scss']
})
export class PreAdmissionsSettingComponent implements OnInit {
	reloadGrid = false;
	constructor() {}

	/**
	 * On init
	 */
	ngOnInit() {}

    onUserAdded(e:any){
        this.reloadGrid = true;
    }
}
