import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { AppService } from 'src/app/core-module/service/app.service';
@Component({
  selector: 'app-items-per-page',
  templateUrl: './items-per-page.component.html',
  styleUrls: ['./items-per-page.component.scss']
})
export class ItemsPerPageComponent implements OnInit {

  @HostListener('document:click', ['$event']) onDocumentClick() {
    this.itemsShow = false;
  }

  @Input() public totalRecords: number = 0;
  @Input() public defaultItem: number = 5;
  @Input() public arrowFlag:any;
  @Output() public selectedItemPerPage = new EventEmitter();
  public itemsShow: boolean = false;
  public items: Array<any> = ['All', 5, 50, 100];
  public selectedItem: any;
  constructor(public appService: AppService) { }

  ngDoCheck() {
    if(this.appService.displayData && this.selectedItem != 'All' && this.selectedItem != this.appService.displayData)
      this.selectedItem = this.appService.displayData;
      this.selectedItem === 0 ? this.selectedItem = 'All' : this.selectedItem;
  }

  ngOnInit() {
    this.appService.displayData = undefined;
    this.selectedItem = this.defaultItem > this.totalRecords ? this.totalRecords : this.defaultItem;
  }

  public openItems() {
    this.itemsShow = true;
  }

  ngOnChanges(): void {
    this.selectedItem = this.defaultItem > this.totalRecords ? this.totalRecords : this.defaultItem;
    this.selectedItem === 0 ? this.selectedItem = 'All' : this.selectedItem;
  }
  
  // When user choose any display option flowing method is triggered
  public selectItem(val: any) {
    this.selectedItem = val > this.totalRecords ? this.totalRecords : val;
    this.itemsShow = false;
    let emitVal: any = val == 'All' ? 0 : val;
    this.selectedItemPerPage.emit(emitVal);
  }
}
