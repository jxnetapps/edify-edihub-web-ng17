import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubheaderService } from '../../../../../core/_base/layout';
import { isNullOrEmpty, toServerDate } from 'jx-ng-core';

@Component({
  selector: 'kt-enquiry-filter',
  templateUrl: './enquiry-filter.component.html',
  styleUrls: ['./enquiry-filter.component.scss']
})
export class EnquiryFilterComponent implements OnInit {
  filterForm!: FormGroup;
  @Input() viewLoading = false;
  @Input() showCreatedDate = true;
  @Input() showFollowupDate = true;
  @Input() showModifiedDate = false;
  @Input() showStatus = true;
  @Output() onFilterChange = new EventEmitter<any>();
  @Output() onFilterClear = new EventEmitter<any>();
  constructor(
    private filterFB: FormBuilder,
    public snackBar: MatSnackBar,
    public subheaderService: SubheaderService,
  ) { }

  ngOnInit(): void {
    this.initFilterForm()
  }

  initFilterForm() {
    this.filterForm = this.filterFB.group({
      ParentName: [null],
      ChildName: [null],
      Mobile: [null],
      City: [null],
      Email: [null],
      EnquiryId: [null],
      ClassIds: [null],
      Status: [null],
      CreatedDateRange: this.filterFB.group({
        startDate: null,
        endDate: null
      }),
      FollowupDateRange: this.filterFB.group({
        startDate: null,
        endDate: null
      }),
      LastUpdatedDateRange:
      this.filterFB.group({
        startDate: null,
        endDate: null
      })
    });
  }

  onFilterSubmit() {
    const filterVal = this.filterForm.value;
    filterVal.CreatedDateRange.startDate = isNullOrEmpty(filterVal.CreatedDateRange.startDate) ? null : toServerDate(filterVal.CreatedDateRange.startDate);
    filterVal.CreatedDateRange.endDate = isNullOrEmpty(filterVal.CreatedDateRange.endDate) ? null :toServerDate(filterVal.CreatedDateRange.endDate);
    filterVal.FollowupDateRange.startDate = isNullOrEmpty(filterVal.FollowupDateRange.startDate) ? null :toServerDate(filterVal.FollowupDateRange.startDate);
    filterVal.FollowupDateRange.endDate = isNullOrEmpty(filterVal.FollowupDateRange.endDate) ? null :toServerDate(filterVal.FollowupDateRange.endDate);
    filterVal.LastUpdatedDateRange.startDate = isNullOrEmpty(filterVal.LastUpdatedDateRange.startDate) ? null :toServerDate(filterVal.LastUpdatedDateRange.startDate);
    filterVal.LastUpdatedDateRange.endDate = isNullOrEmpty(filterVal.LastUpdatedDateRange.endDate) ? null :toServerDate(filterVal.LastUpdatedDateRange.endDate);
    
    this.onFilterChange.emit(this.filterForm.value);
  }

  clearFilter() {
    this.initFilterForm();
    this.onFilterClear.emit();
  }

}
