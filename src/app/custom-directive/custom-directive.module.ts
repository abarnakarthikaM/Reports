import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleToggleDirective } from './directives/simple-toggle.directive';
import { OpenAllToggleDirective } from './directives/open-all-toggle.directive';
import { CustomToolTipDirective } from './directives/custom-tool-tip.directive';
import { ToolTipDirectiveComponent } from './components/tool-tip-directive/tool-tip-directive.component';
import { BlockCopyPasteDirective } from './block-copy-paste.directive';



@NgModule({
  declarations: [
    SimpleToggleDirective,
    OpenAllToggleDirective,
    CustomToolTipDirective,
    ToolTipDirectiveComponent,
    BlockCopyPasteDirective],
  imports: [
    CommonModule
  ],
  exports: [
    SimpleToggleDirective,
    OpenAllToggleDirective,
    CustomToolTipDirective,
    BlockCopyPasteDirective
  ]
})
export class CustomDirectiveModule { }
