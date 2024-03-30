import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '../../../../../core/shared/material.components';
import { EnquiryMailLogModel } from '../../_models/EnquiryMailLogModel';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
//import { MarketingEnquiryMailLogEditDialogComponent } from './edit.dialog.component';
import { SubheaderService } from '../../../.././../core';
import { EnquiryService } from '../../_services';
import { MailLogViewDialogComponent } from '../mail-log-view-dialog/mail-log-view-dialog.component';
import { JxBaseComponent, JxFormConfig, JxMatTableActionItem, JxMatTableComponent, JxMatTableConfig } from 'jx-ng-core';

@Component({
  selector: 'edify-mail-log-list',
  templateUrl: './mail-log-list.component.html',
  styleUrls: ['./mail-log-list.component.scss']
})
export class MailLogListComponent extends JxBaseComponent implements OnInit, OnDestroy {

  @ViewChild(JxMatTableComponent, { static: true })
  jxMatTable!: JxMatTableComponent;
  displayColumns = [
    { key: 'subject', display: 'Subject', displayType:'link' },
    { key: 'receiverEmailId', display: 'Receiver Email' },
    { key: 'ccMailId', display: 'CC' },
    //{ key: 'message', display: 'Message' },
    {
      key: 'createdOn', display: 'Created On', config: {
        isDate: true,
        format: "dd MMM yyyy"
      }
    }
  ];

  configSettings = {
    entityName: 'Marketing Enquiry Mail Log',
    primaryColumn: 'id',
    list: {
      httpType: 'GET',
      url: '/v1/marketing/enquiries/{enquiryid}/mails',
      displayColumns: this.displayColumns,
      sortActive: 'id',
      sortDirection: 'asc',
      filter: {},
      title: 'Marketing Enquiry Mail Log',
    }
  };

  config = new JxMatTableConfig(this.configSettings);
  enquiryId: any;
  formConfig: JxFormConfig = new JxFormConfig();
  mailLogModel!: EnquiryMailLogModel;

  showCreateSection = false;

  constructor(
    private fb: FormBuilder,
    private subheaderService: SubheaderService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private _cdr: ChangeDetectorRef,
    private _enquiryService: EnquiryService,
  ) {
    super();
  }

  ngOnInit() {
    this.activatedRoute.params.pipe(finalize(() => {
      this.takeUntilDestroy();
    })).subscribe((params: any) => {
      this.enquiryId = params['id'];
      if (this.enquiryId && this.enquiryId > 0) {
        this.subheaderService.setToolBar({
          addClick: () => {
            //add clicked
            this.showHideCreate()
          },
          backButtonPath: `/edi-mart`
        });
        this.subheaderService.setHeader([
          { title: 'Manage Enquiries', page: `edi-mart` },
        ], '', `ENQUIRY#${this.enquiryId}`);
        // edit
        this.configSettings.list.url = `/v1/marketing/enquiries/${this.enquiryId}/mails`
      }
    });
  }

  showHideCreate() {
    this.showCreateSection = !this.showCreateSection;
    if (this.showCreateSection)
      this.createForm()
    this._cdr.detectChanges()
  }

  createForm() {
    this.mailLogModel = new EnquiryMailLogModel();
    //TODO
    // this.mailLogModel = new EnquiryMailLogModel(
    //   (new Date()).getMilliseconds() + '@test.com', (new Date()).getMilliseconds() + '-subject',
    //   (new Date()).getMilliseconds() + '-message', null)

    this.formConfig.formGroup = this.fb.group({
      receiverEmailId: [this.mailLogModel.receiverEmailId,
      Validators.compose([
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(320)
      ])
      ],
      ccMailId: [this.mailLogModel.ccMailId],
      subject: [this.mailLogModel.subject, Validators.required],
      message: [this.mailLogModel.message, Validators.required],
      attachments: [this.mailLogModel.attachments, Validators.required]
    });
  }

  onSubmit() {
    const logToSend: EnquiryMailLogModel = this.formConfig.formGroup.value;
    logToSend.enquiryId = this.enquiryId;

    this._enquiryService
      .addMailLog$(this.enquiryId, this.formConfig.formGroup.value)
      .then((response) => {
        if (response.isSuccess) {
          this.showHideCreate();
          this.jxMatTable.refresh();
        }
      })
      .catch((error) => {
        console.log(error)
        //this.showHideCreate();
      })
  }

  onActionChanged(event: JxMatTableActionItem) {
    if (event.action === 'edit') {
      
    }
  }

  onRowLinkClick(e: any) {
		const dialogRef = this.dialog.open(MailLogViewDialogComponent, {
      data: {
        id: e.data.id,
        enquiryId: this.enquiryId
      } 
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (!res) {
        return;
      }
    });
	}

  override ngOnDestroy(): void {
    this.subheaderService.resetTooBar();
  }
}

