import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { CoreModuleModule } from '../../core-module/core-module.module';



@NgModule({
  declarations: [SideMenuComponent],
  imports: [
    CommonModule,
    CoreModuleModule
  ],
  exports:[SideMenuComponent]
})
export class SideMenuModule { }
