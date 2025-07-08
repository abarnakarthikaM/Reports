import { ApplicationRef, ComponentFactoryResolver, Directive, ElementRef, EmbeddedViewRef, HostListener, Injector, Input } from '@angular/core';
import { ToolTipDirectiveComponent } from '../components/tool-tip-directive/tool-tip-directive.component';

@Directive({
  selector: '[appTooltip]'
})
export class CustomToolTipDirective {

  @Input() appTooltip: any;
  @Input() toolTipList: any;
  private componentRef: any = null;

  constructor(
    private elementRef: ElementRef,
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector) {
  }
  ngOnInit() { }
  @HostListener('mouseover')
  onMouseEnter(): void {
    if (this.componentRef === null) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ToolTipDirectiveComponent);
      this.componentRef = componentFactory.create(this.injector);
      this.setTooltipComponentProperties();
      this.appRef.attachView(this.componentRef.hostView);
      const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
      document.body.appendChild(domElem);
    }
  }
  private setTooltipComponentProperties() {
    if (this.componentRef !== null) {
      this.componentRef.instance.data = this.appTooltip;
      this.componentRef.instance.data2 = this.toolTipList;
      const data = this.elementRef.nativeElement.getBoundingClientRect();
      const windowData = document.body.getBoundingClientRect();
      this.componentRef.instance.left = (data.right - data.left) / 2 + data.left;
      this.componentRef.instance.top = windowData.bottom - data.top < 40 ? data.top - 30 : data.top + 40;
      this.componentRef.instance.position = windowData.bottom - data.top < 40 ? 'top' : 'bottom';
    }
  }

  @HostListener('mouseout')
  onMouseLeave(): void {
    this.destroy();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy(): void {
    if (this.componentRef !== null) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}

