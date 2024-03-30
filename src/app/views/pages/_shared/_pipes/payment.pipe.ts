import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// import { EntityStatus } from '@/_enums';
@Pipe({
  name: 'paymentStatus'
})

export class PaymentStatusPipe implements PipeTransform {

  constructor(private _sanitizer: DomSanitizer) { }

  transform(value: string, event?: number): SafeHtml {

	  let formattedHtml = '';
	  const entityStatus = parseInt(value, 0);
	  switch (entityStatus) {
		  case 1:
			  formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-success">Completed</span>'; break;
		 case 2:
			  formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-warning">Pending</span>'; break;
		  case 3:
			  formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-danger">Canccelled</span>'; break;		  
	  }

	  return this._sanitizer.bypassSecurityTrustHtml(formattedHtml);
  }
}
