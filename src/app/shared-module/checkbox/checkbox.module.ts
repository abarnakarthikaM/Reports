import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { CoreModuleModule } from '../../core-module/core-module.module';



@NgModule({
  declarations: [CheckboxComponent],
  imports: [
    CommonModule,
    CoreModuleModule
  ],
  exports: [CheckboxComponent]
})
export class CheckboxModule { }
