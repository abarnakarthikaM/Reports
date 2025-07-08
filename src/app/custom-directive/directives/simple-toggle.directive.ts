import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSimpleToggleCD]'
})
export class SimpleToggleDirective {
  public currentele: any;
  public isOpen: boolean = false;
  constructor(private el: ElementRef) {

    this.currentele = this.el.nativeElement.parentElement.closest('div.cls-CD-body-content');
  }
  @HostListener('click') click() {
    this.isOpen = this.currentele.classList.contains('cls-CD-bodyContent-open') ? false : true;
    this.isOpen ? this.currentele.classList.add("cls-CD-bodyContent-open") : this.currentele.classList.remove("cls-CD-bodyContent-open");
  }

}
