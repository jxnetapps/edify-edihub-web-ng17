import { Pipe, PipeTransform } from '@angular/core';  
import { DomSanitizer, SafeHtml} from '@angular/platform-browser';
//import { EntityStatus } from '@/_enums';
@Pipe({  
	name: 'taskStatus'  
})  
  
export class TaskStatusPipe implements PipeTransform {  
  
  constructor(private _sanitizer: DomSanitizer) { }  
  
  transform(value: string, event?: number): SafeHtml {  

	  let formattedHtml = "";
	  let entityStatus = parseInt(value, 0);
	  switch (entityStatus) {
		  case 1:
			  formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-info">Open</span>'; break;
		 case 2:
			  formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-success">Closed</span>'; break;
		  case 3:
			  formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-warning">OnHold</span>'; break;
		  case 4:
			  formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-danger">Cancelled</span>'; break;
		  case 5:
			  formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-warning">ReProduced</span>'; break;
		  case 6:
			  formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-warning">InProgress</span>'; break;
			case 7:
			  formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-warning">Completed</span>'; break;
			  case 8:
			  formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-danger">Declined</span>'; break;
	  }

	  return this._sanitizer.bypassSecurityTrustHtml(formattedHtml);    
  }  
}  
