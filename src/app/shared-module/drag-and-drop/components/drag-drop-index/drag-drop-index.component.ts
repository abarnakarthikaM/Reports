import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-drag-drop-index',
  templateUrl: './drag-drop-index.component.html',
  styleUrls: ['./drag-drop-index.component.scss']
})
export class DragDropIndexComponent implements OnInit {

  @Input() public dragAndDropField:any;
  @Output() public suffleValues: EventEmitter<any> = new EventEmitter();

  srcIdx: any; 
  targetIdx: any; 
  srcEle: any;
  style: any = {
    height: null,
    width: null,
    top: null,
    left: null,
    offsetX: null,
    offsetY: null,
    mirrorWidth: null,
    mirrorHeight: null
  };

  duplicateArr: any;

  currentArr: number[] = [];

  dragHeaderName: string = '';

  public fieldsName: Array<any> = [];

  public fieldList :any = [];
  suffleFields: string[] = [];

  constructor() { }

  ngOnChanges(){
    this.handelEmptyCondition();
  }

  ngOnInit(): void {
  }

  touchStart(ev: any, i: number) {

    this.srcIdx = i;

    // when touch start, get relevant position of the element to pointer
    const pt = this.getPoint(ev);
    const el = document.elementFromPoint(pt.x, pt.y);
    const src: any = el && el.closest('div.box');

    const srcRect = src.getBoundingClientRect();
    const rect = this.calculateRelevant(srcRect, pt);

    // sizing the mirror
    this.style.offsetX = rect.x;
    this.style.offsetY = rect.y;
    this.style.mirrorHeight = srcRect.height;
    this.style.mirrorWidth = srcRect.width;

    (src as HTMLDivElement).classList.toggle('drag-transition');

  }

  @HostListener('touchmove', ['$event']) onHover(event: TouchEvent) {
    // tslint:disable-next-line:curly triple-equals
    if (!this.srcIdx) return;

    const pt = this.getPoint(event);
    this.style = {
      ...this.style,
      top: pt.y - this.style.offsetY, left: pt.x - this.style.offsetX,
      width: this.style.mirrorWidth, height: this.style.mirrorHeight
    };

    const el = document.elementFromPoint(pt.x, pt.y);
    const tar = el && el.closest('div.box');

    // tslint:disable-next-line:curly triple-equals
    if (!tar) return;

    // tslint:disable-next-line:curly triple-equals
    if (tar.id == this.srcIdx) return;

  }
  
  touchMove(ev: any, i: number, parentIndex: number, head: string) {

    const pt = this.getPoint(ev);
    const el = document.elementsFromPoint(pt.x, pt.y)
      .find(x => !x.className.includes('drag-mirror'));
    const tar = el && el.closest('div.box');

    // tslint:disable-next-line:curly triple-equals
    if (!tar) return;

    // tslint:disable-next-line:curly triple-equals
    if (tar.id == this.srcIdx) return;

    this.targetIdx = tar.id;
    this.reorder(this.srcIdx, this.targetIdx, parentIndex, head);
    this.srcIdx = tar.id;
  }

  touchEnd(ev: any, i: number) {

    document.getElementById(this.srcIdx)?.classList.toggle('drag-transition');
    this.resetIdx();

  }
  dragStart(ev: any, i: number, head: string) {

    this.dragHeaderName = head;
    this.srcIdx = i;
    (ev.target as HTMLDivElement).classList.toggle('drag-transition');
    (ev.dataTransfer as DataTransfer).setData('text/plain', 'div');
  }
  dragEnter(ev: any, i: number, parentIndex: number, head: string) {

    if (i == this.srcIdx) return;
    this.targetIdx = i;
    this.reorder(this.srcIdx, this.targetIdx, parentIndex, head);
    this.srcIdx = i;

  }
  dragEnd(ev: any, i: number) {
    (ev.target as HTMLDivElement).classList.toggle('drag-transition');
  }
  drop(ev: any, i: number) {
    this.resetIdx();
  }
  private calculateRelevant(eleRect: any, hoverpos: any) {
    const x = hoverpos.x - eleRect.left; // x position within the element.
    const y = hoverpos.y - eleRect.top;  // y position within the element.

    return { x, y };
  }

  private resetIdx() {
    this.srcIdx = null;
    this.targetIdx = null;
    Object.keys(this.style).forEach(x => this.style[x] = undefined);
  }


  private reorder(src: any, des: any, index: number, head: string) {
    if (this.dragHeaderName == head) {
      this.currentArr.push(src);
      let arr: any = this.dragAndDropField;

      const temp = arr[index]['field_details'][src];
      if (temp != undefined) {
        arr[index]['field_details'].splice(src, 1);
        arr[index]['field_details'].splice(des, 0, temp);
        this.fieldsName = [];
        arr.map((data) =>
          data.field_details.map((value) => {
            if (value.status == 'Y') this.fieldsName.push(value.keys);
          })
        );
        this.suffleFields = this.fieldsName;
        
        this.suffleValues.emit(this.fieldsName)
      }
    } else {
      this.dragHeaderName = "";
    }
  }

  private getPoint(e: any, page = false) {
    if (e && e.touches) {
      e = e.touches[0];
    }
    return { x: page ? e.pageX : e.clientX, y: page ? e.pageY : e.clientY };
  }

  public handelEmptyCondition(){     
    this.dragAndDropField.forEach((element:any) => {
      var a = element.field_details.filter((data: any) => data.status === 'Y');
      this.fieldList.push(a.length);
    });
  }
}
