import { Component, Input, OnInit } from '@angular/core';

declare var bodymovin: any;
declare var $: any;
@Component({
  selector: 'app-common-loader',
  templateUrl: './common-loader.component.html',
  styleUrls: ['./common-loader.component.scss']
})
export class CommonLoaderComponent implements OnInit {
  @Input() idVal: number;
  @Input() loader: string = '';
  @Input() home: boolean = false;

  constructor() { }

  ngOnInit(): void {

  }
  ngAfterViewInit() {

    let loader = this.loader ? this.loader : '23470-loading.json';

    //Dynamic id name from parent component  
    let id = "loader" + this.idVal;
    bodymovin.loadAnimation({
      container: document.getElementById(id),
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: `./assets/loading/${loader}`
    });
  }

}
