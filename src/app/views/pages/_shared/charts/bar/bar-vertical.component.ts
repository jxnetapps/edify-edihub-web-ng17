import { Component, OnInit, ElementRef, ViewChild, Input } from "@angular/core";

@Component({
  selector: "jx-bar-vertical",
  templateUrl: "./bar-vertical.component.html",
  styleUrls: ["./bar-vertical.component.scss"],
})
export class JxBarVerticalComponent implements OnInit {
  @Input() title = "";
  @Input() data: any[]=[];

  @Input() view: any[] = [300, 300];
  // options
  @Input() showXAxis = true;
  @Input() showYAxis = true;
  @Input() gradient = false;
  @Input() showLegend = true;
  @Input() showXAxisLabel = true;
  @Input() xAxisLabel = '';
  @Input() showYAxisLabel = true;
  @Input() yAxisLabel = '';

  @Input() colorScheme = {
    domain: ["#5d78ff", "#ffb822", "#0abb87", "#fd397a",'#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };
  @ViewChild("resizedDiv")
  resizedDiv!: ElementRef;
  public previousWidthOfResizedDiv: number = 0;
  constructor() {}

  ngOnInit() {}

  onSelect(data: any): void {
    //console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    //console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    //console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  ngAfterViewChecked() {
    if (
      this.previousWidthOfResizedDiv !=
      this.resizedDiv.nativeElement.clientWidth
    ) {
      //setTimeout(() => this.data = [...multi] );
    }
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  }
}
