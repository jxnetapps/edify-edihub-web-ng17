import {
    Component, Input, OnInit} from '@angular/core';

/**
 * Usage:
 * <jx-divider [title]="''"></jx-divider>
 * */
@Component({
    selector: 'jx-divider',
    templateUrl: './divider.html',
})
export class JxDividerComponent implements OnInit{
    @Input() title='';
    constructor() { }
    ngOnInit(): void {}
}
