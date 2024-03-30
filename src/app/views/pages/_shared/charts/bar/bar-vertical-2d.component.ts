import { Component, OnInit, ElementRef, ViewChild, Input } from "@angular/core";

@Component({
  selector: "jx-bar-vertical-2d",
  templateUrl: "./bar-vertical-2d.component.html",
  styleUrls: ["./bar-vertical-2d.component.scss"],
})
export class JxBarVertical2DComponent implements OnInit {
  @Input() title = "";
  @Input() data: any[]=[];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  @Input()  xAxisLabel: string = "";
  showYAxisLabel: boolean = true;
  @Input() yAxisLabel: string = "";
  @Input() legendTitle: string = "";

  colorScheme = {
    domain: ["#5d78ff", "#ffb822", "#0abb87", "#fd397a"],
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
