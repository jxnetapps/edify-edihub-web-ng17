import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';

@Component({
  selector: 'jx-pie-chart',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss']
})
export class JxPieChartComponent implements OnInit {
  @Input() title = "";
  @Input() data: any[]=[]; 
  @Input() view: any[] = [300, 300];
  @Input() showLegend = false;
  @Input() legendPosition: string = 'bottom';
  @Input()  gradient = true;
  @Input()  colorScheme = {
    domain: ['#0abb87', '#5d78ff', '#fd397a', '#ffb822']
  }; 
  @Input()  showLabels = true;
  @Input()  explodeSlices = false;
  @Input()  doughnut = false; 
  @ViewChild('resizedDiv')
  resizedDiv!: ElementRef;
  public previousWidthOfResizedDiv:number = 0;
  
  constructor() { }

  ngOnInit(){
  }
  
  public onSelect(event: any) {
    console.log(event);
  }

  ngAfterViewChecked() {    
    if(this.previousWidthOfResizedDiv != this.resizedDiv.nativeElement.clientWidth){
      //setTimeout(() => this.data = this.data );
    }
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  }

}
