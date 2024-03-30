import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { JxBarVertical2DComponent } from './bar/bar-vertical-2d.component';
import { JxBarVerticalComponent } from './bar/bar-vertical.component';
import {JxPieChartComponent} from './pie/pie.component';
import {JxPieAdvanceChartComponent} from './pie/pie.advance.component';
import {JxLineChartComponent} from './line/line.component';
import { CoreModule } from '../../../../core/core.module';

export const routes = [];

@NgModule({
  declarations: [
    JxBarVertical2DComponent,
    JxPieChartComponent,
    JxLineChartComponent,
    JxBarVerticalComponent,
    JxPieAdvanceChartComponent
  ],
  imports: [
    CoreModule,
    CommonModule,
    RouterModule.forChild(routes), 
    NgxChartsModule
  ],
  exports:[
    JxBarVertical2DComponent,
    JxPieChartComponent,
    JxLineChartComponent,
    JxBarVerticalComponent,
    JxPieAdvanceChartComponent
  ]
})
export class JxNgxChartsModule { }
