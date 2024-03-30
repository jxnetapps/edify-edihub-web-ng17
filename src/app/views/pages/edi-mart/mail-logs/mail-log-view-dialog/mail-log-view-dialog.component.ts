import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { JxBaseComponent, JxHttpService } from 'jx-ng-core';

@Component({
  selector: 'edify-mail-log-view-dialog',
  templateUrl: './mail-log-view-dialog.component.html',
  styleUrls: ['./mail-log-view-dialog.component.scss']
})
export class MailLogViewDialogComponent extends JxBaseComponent implements OnInit {
  // Public properties
  mailLog: any;
  viewLoading: boolean = false;

  constructor(public dialogRef: MatDialogRef<MailLogViewDialogComponent>,
    private _http: JxHttpService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }

  ngOnInit() {
    this.getMarketingEnquiryMailLog();
  }

  getMarketingEnquiryMailLog() {
    this._http.getHttp$(`/v1/marketing/enquiries/${this.data.enquiryId}/mails/${this.data.id}`)
      .finally(() => {
        this.takeUntilDestroy();
      })
      .then(
        (response: any) => {
          this.mailLog = response;
          this.cdr.detectChanges();
        });
  }

  getDownloadUrl(log: any){
    return `/v1/marketing/enquiries/${this.data.enquiryId}/mails/${this.data.id}/documents/${log.id}/download`
  }
}
