import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOpenAllToggleCD]'
})
export class OpenAllToggleDirective {

  public isOpen: boolean = false;
  
  public currentele: any;

  constructor(private el: ElementRef) {
    this.currentele = this.el.nativeElement.parentElement.closest('div.cls-CD-head-content');
  }
  @HostListener('click') click() {
    this.isOpen = !this.isOpen;
    this.isOpen ? this.currentele.classList.add("CD-head-openAll") : this.currentele.classList.remove("CD-head-openAll");
    var parent = this.currentele.parentElement;
    var child = parent.querySelectorAll(":scope > div.cls-CD-body-content");

    child.forEach((element: any) => {
      if (this.isOpen) {
        element.classList.contains('cls-CD-bodyContent-open') ? "" : element.classList.add("cls-CD-bodyContent-open")
      } else {
        element.classList.contains('cls-CD-bodyContent-open') ? element.classList.remove("cls-CD-bodyContent-open") : "";
      }
    });
  }
}
