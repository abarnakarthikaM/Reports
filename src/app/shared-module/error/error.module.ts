import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error.component';
import { CoreModuleModule } from 'src/app/core-module/core-module.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [ErrorComponent],
  imports: [
    CommonModule,
    CoreModuleModule,
    RouterModule.forChild([
      {
        path: '',
        component: ErrorComponent
      }
    ])
  ]
})
export class ErrorModule { }
