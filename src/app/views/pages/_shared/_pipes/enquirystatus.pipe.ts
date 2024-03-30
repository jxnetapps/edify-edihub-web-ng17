import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
// import { EntityStatus } from '@/_enums';
@Pipe({
	name: "enquiryStatus",
})
export class EnquiryStatusPipe implements PipeTransform {
	constructor(private _sanitizer: DomSanitizer) {}

	transform(value: string, event?: number): SafeHtml {
		let formattedHtml = "";
		const entityStatus = parseInt(value, 0);
		switch (entityStatus) {
			case 1:
				formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-brand">Cold</span>';
				break;
			case 2:
				formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-danger">Hot</span>';
				break;
			case 3:
				formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-warning">Warm</span>';
				break;
			case 4:
				formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-danger">Dead / Closed</span>';
				break;
			case 5:
				formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-success">Aggrement / Paid</span>';
				break;
			case 6:
				formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-success">LOI</span>';
				break;
			case 7:
				formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-brand">Transferred</span>';
				break;
			case 8:
				formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-brand">Irrelevant</span>';
				break;
			case 9:
				formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-danger">InvalidNumber</span>';
				break;
			case 10:
				formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-brand">DemoClassRequested</span>';
				break;
			case 11:
				formattedHtml = '<span class="text-uppercase btn btn-bold btn-sm btn-font-sm  btn-label-warning">NotConnected</span>';
				break;
		}

		return this._sanitizer.bypassSecurityTrustHtml(formattedHtml);
	}
}
