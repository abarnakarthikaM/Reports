import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VallarchiPlanRoutingModule } from './vallarchi-plan-routing.module';
import { VallarchiSheetComponent } from './vallarchi-sheet/vallarchi-sheet.component';


@NgModule({
  declarations: [
    VallarchiSheetComponent
  ],
  imports: [
    CommonModule,
    VallarchiPlanRoutingModule
  ]
})
export class VallarchiPlanModule { }
