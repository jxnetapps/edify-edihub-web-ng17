import { Component, Input } from '@angular/core';

@Component({
  selector: 'jx-line-chart',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class JxLineChartComponent { 
  @Input() title = "";
  @Input() data: any[]=[];
  @Input() showXAxis = true;
  @Input() showYAxis = true;
  @Input() gradient = false;
  @Input() showLegend = false;
  @Input() showXAxisLabel = true;
  @Input() xAxisLabel = 'Days';
  @Input() showYAxisLabel = true;
  @Input() yAxisLabel = 'Views';
  @Input() colorScheme = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#F47B00', '#606060']
  }; 
  public autoScale = true; 
  
  constructor() {
  }
  
  onSelect(event: any) {
    console.log(event);
  }

}
