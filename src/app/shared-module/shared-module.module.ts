import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SharedModuleRoutingModule } from './shared-module-routing.module';
import { AlertComponent } from './alert/alert.component';
import { LanguageComponent } from './language/language.component';
import { CoreModuleModule } from '../core-module/core-module.module';
import { AlertInputComponent } from './alert-input/alert-input.component';
import { ThemeComponent } from './theme/theme.component';
import { CommonLoaderComponent } from './common-loader/common-loader.component';
import { NetworkErrorComponent } from './network-error/network-error.component';
import { CustomDirectiveModule } from '../custom-directive/custom-directive.module';



@NgModule({
  declarations: [AlertComponent, LanguageComponent, AlertInputComponent, ThemeComponent, CommonLoaderComponent, NetworkErrorComponent],
  imports: [
    CommonModule,
    SharedModuleRoutingModule,
    CoreModuleModule,
    CustomDirectiveModule
  ],
  providers:[DatePipe],
  exports: [
    AlertComponent,
    LanguageComponent,
    AlertInputComponent,
    ThemeComponent,
    CommonLoaderComponent,
    NetworkErrorComponent,
  ]
})
export class SharedModuleModule { }
