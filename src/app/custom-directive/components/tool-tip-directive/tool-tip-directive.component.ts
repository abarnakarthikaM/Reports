import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tool-tip-directive',
  templateUrl: './tool-tip-directive.component.html',
  styleUrls: ['./tool-tip-directive.component.scss']
})
export class ToolTipDirectiveComponent implements OnInit {


  constructor() { }
  @Input() data:any;
  @Input() data2:any;
  @Input() top:any;
  @Input() left:any;
  @Input() position:any;

  ngOnInit(): void {
    // console.log(this.data,this.top,this.left);
    // console.log(this.data2);
      
  }

}
