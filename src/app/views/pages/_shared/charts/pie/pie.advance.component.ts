import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';

@Component({
  selector: 'jx-pie-advance-chart',
  templateUrl: './pie.advance.component.html',
  styleUrls: ['./pie.advance.component.scss']
})
export class JxPieAdvanceChartComponent implements OnInit {
  @Input() title = "";
  @Input() data: any[]=[]; 
  @Input() view: any[] = [300, 300];
  // options
  @Input() gradient: boolean = true;
  @Input() showLegend: boolean = true;
  @Input() showLabels: boolean = true;
  @Input() isDoughnut: boolean = false;

  @Input()  colorScheme = {
    domain: ['#0abb87', '#5d78ff', '#fd397a', '#ffb822']
  }; 
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
