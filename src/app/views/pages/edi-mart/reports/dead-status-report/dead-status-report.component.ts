import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslationService } from '../../../../../core/_base/layout';
import { JxBaseComponent, JxMatTableComponent, JxMatTableConfig, JxMatTableActionItem } from 'jx-ng-core';

@Component({
  selector: 'kt-dead-status-report',
  templateUrl: './dead-status-report.component.html',
  styleUrls: ['./dead-status-report.component.scss']
})
export class DeadStatusReportComponent extends JxBaseComponent implements OnInit {

  @ViewChild(JxMatTableComponent, { static: true })
  jxmattable!: JxMatTableComponent;
  displayColumns = [
    { key: 'EnquiryId', display: 'Enquiry ID' },
    { key: 'Child2', display: 'Child Details', template: `<div class='d-flex justify-content-start flex-column'><span href='#' class='text-dark fw-bolder text-hover-primary fs-6'>{{ChildName}}</span><span class='text-muted fw-bold text-muted d-block fs-7'>{{ParentName}}</span></div>` },
    { key: 'ClassName', display: 'Grade' },
    { key: 'Contact', display: 'Contact', template: `<div class='d-flex justify-content-start flex-column'><span href='#' class='text-dark fw-bolder text-hover-primary fs-6'>{{Mobile}}</span><span class='text-muted fw-bold text-muted d-block fs-7'>{{Email}}</span></div>` },
    { key: 'City', display: 'City', template: `<div class='d-flex justify-content-start flex-column'><span href='#' class='text-dark fw-bolder text-hover-primary fs-6'>{{City}}</span><span class='text-muted fw-bold text-muted d-block fs-7'>{{StateName}}</span></div>` },
    { key: 'CreatedOn', display: 'Created Date' },
    { key: 'DeadStatusReason', display: 'Dead Status Reason' },
  ];

  configSettings = {
    entityName: 'Dead status enquiries',
    primaryColumn: 'EnquiryId',
    list: {
      url: 'api/preadmissions/dead-enquiries/find/0',
      displayColumns: this.displayColumns,
      sortActive: 'ModifiedOn',
      sortDirection: 'asc',
      filter: {},
      title: 'Dead status enquiries',
      enableSearch: false,
    }
  };

  config = new JxMatTableConfig(this.configSettings);

  constructor(
    private dialog: MatDialog,
    private translate: TranslationService
  ) {
    super();
  }

  ngOnInit() { }

  onActionChanged(event: JxMatTableActionItem) {
    console.log(event)
  }

  onFilterChanged(e: any) {
    this.jxmattable.config.list.filter = e;
    this.jxmattable.refresh();
  }

  onFilterCleared() {
    this.jxmattable.config.list.filter = {};
    this.jxmattable.refresh();
  }

  onColumnClicked(e: any) {
    console.log(e)
  }

}
