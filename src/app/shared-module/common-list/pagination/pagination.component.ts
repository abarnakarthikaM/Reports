import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {

  constructor() { }
  @Input() pages: any;
  @Input() currentPage: any;
  @Output() currentPageVal = new EventEmitter();
  items: Array<any> = [];
  selectedPage: number = 1;
  ngOnChanges() {
    this.selectedPage = this.currentPage;
    this.items = [];
    for (let i = 0; i < this.pages; i++) { this.items.push((i + 1)) }
    this.loadPage();
  }
  ngOnInit() { }
  moveToPage(item: number , event:any) {
    if(item == 0){
      return false;
    }
    this.selectedPage = item;
    this.loadPage();
    return this.currentPageVal.emit(item);
  }

  loadPage() {
    var thisVar = this;
    var beforeElement = '<li class="cls-pagination-item ellipsis" id="pagePrev"><a class="page-link" style="border-radius:20px;" href="javascript:;" title="pageprev">... </a></li>';
    var afterElement = '<li class="cls-pagination-item ellipsis" id="pageNext"><a class="page-link" style="border-radius:20px;" href="javascript:;" title="pagenext"> ...</a></li>';
    setTimeout(function () {
      var totalCount = thisVar.pages;
      var currentValue = thisVar.selectedPage;
      $('.ellipsis').remove();
      $('.cls-pagination-item').css('display', 'none');
      $('.cls-pagination-item.active').css('display', 'block');
      $('.cls-pagination-item.active').prev('li').css('display', 'block');
      $('.cls-pagination-item.active').next('li').css('display', 'block');
      if (currentValue != 1 && currentValue != 2 && currentValue != 3) {
        $('.cls-pagination-item.active').prev('li').before(beforeElement).css('display', 'block');
      }
      if (currentValue != (totalCount) && currentValue != (totalCount - 1) && currentValue != (totalCount - 2)) {
        $('.cls-pagination-item.active').next('li').after(afterElement).css('display', 'block');
      }
    }, 50);
  }

}