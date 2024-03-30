import {
    Component, Input, ChangeDetectionStrategy, OnInit} from '@angular/core';

/**
 * Usage:
 * <kt-info-box-widget [look]="[look]" [type]="'type'" [header]="header" [subheader]="'[subheader]'"></kt-info-box-widget>
 * */
@Component({
    selector: 'kt-info-box-widget',
    templateUrl: './info-box.html',
    styleUrls: ["./info-box.scss"],
})
export class InfoBoxWidgetComponent implements OnInit{
    @Input() look='box';
    @Input() header : any;
	@Input() subheader : any;
	@Input() type = '';
	@Input() icon = '';

    constructor() { }
    ngOnInit(): void {
       
    }
}
