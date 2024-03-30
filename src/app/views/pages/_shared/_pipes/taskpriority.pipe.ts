import { Pipe, PipeTransform } from '@angular/core';  
import { DomSanitizer, SafeHtml} from '@angular/platform-browser';
//import { EntityStatus } from '@/_enums';
@Pipe({  
	name: 'taskPriority'  
})  
  
export class TaskPriorityPipe implements PipeTransform {  
  
  constructor(private _sanitizer: DomSanitizer) { }  
  
  transform(value: string, event?: number): SafeHtml {  

	  let formattedHtml = "";
	  let entityStatus = parseInt(value, 0);
	  switch (entityStatus) {
		  case 1:
			  formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-info">Low</span>'; break;
		 case 2:
			  formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-warning">Medium</span>'; break;
		  case 3:
			  formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-danger">High</span>'; break;
		  case 4:
			  formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-info">OnGoingTask</span>'; break;
	  }

	  return this._sanitizer.bypassSecurityTrustHtml(formattedHtml);    
  }  
}  
