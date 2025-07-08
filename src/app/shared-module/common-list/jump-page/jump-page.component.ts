import { Component, OnInit,Input, Output,EventEmitter, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-jump-page',
  templateUrl: './jump-page.component.html',
  styleUrls: ['./jump-page.component.scss']
})
export class JumpPageComponent implements OnInit,OnChanges {

  constructor() { }
  name = new FormControl('');
  jumpVal: boolean = true;
  @Input() noOfPage: any;
  @Input() currentPage: any;
  @Output() jumpToPage = new EventEmitter();
  ngOnChanges() {
  }
  ngOnInit() {
  }

  // When user enter the page number and click the button means following method is trigged.
  jumpPage() {
    this.jumpVal = false;
    if (this.name.value != '' && this.name.value != 0){
      if (this.name.value <= this.noOfPage) {
        this.jumpVal = true;
        this.jumpToPage.emit(this.name.value);
      }
    }      
  }

}
