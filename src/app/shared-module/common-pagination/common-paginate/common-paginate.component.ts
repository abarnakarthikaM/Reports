import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-common-paginate',
  templateUrl: './common-paginate.component.html',
  styleUrls: ['./common-paginate.component.scss']
})
export class CommonPaginateComponent implements OnInit {
  /**
     * Desc : Items per page
     */
  public itemsPerPage: number = 5;
  /**
   * Desc : Paginantion list data
   */
  public paginationList: number[] = [];
  /**
   * Desc : Paginantion list data
   */
  public activePage: number = 1;
  /**
   * Desc : Items per page
   */
  public pageList: number[] = []
  /**
   * Desc : Page source
   */
  @Input() source: any[] = [];
  /**
   * Desc : Page data
  */
  @Output() paginate: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    for (let i = 1; i <= Math.ceil(this.source.length / this.itemsPerPage); i++) {
      this.pageList.push(i * this.itemsPerPage);
    }
    this.loadData();
  }
  ngOnChanges() {
    this.loadData();
  }
  /**
   * Desc : Load page data
   */
  public loadData(): void {

    this.paginationList = [];
    const result: any[] = [];
    for (let i = 1; i <= Math.ceil(this.source.length / this.itemsPerPage); i++) {
      this.paginationList.push(i);
    }
    if ((this.itemsPerPage * this.activePage) - this.itemsPerPage > this.source.length || this.paginationList.indexOf(this.activePage) === -1) {
      this.activePage = this.paginationList.slice(-1)[0];
      this.loadData();
    }

    this.source.map((data: any, i: number) => {
      if (i < this.itemsPerPage * this.activePage && i >= (this.itemsPerPage * this.activePage) - this.itemsPerPage) {
        result.push(data)
      }
    });
    this.paginate.emit(result);
  }

  /**
   * Desc : Load page data
   */
  public setItemsPerPage(page: number): void {
    this.itemsPerPage = page;
    this.loadData();
  }
  /**
   * Desc : Go to page
   */
  public goToPage(page: number): void {

    this.activePage = (page !== 0) ? page : 1;

    this.loadData();
  }

  public trackBypaginationList(index: number, listData: any) {
    // console.log(listData, index);

  }


}
