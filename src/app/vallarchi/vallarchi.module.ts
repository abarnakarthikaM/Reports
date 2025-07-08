import { NgModule } from '@angular/core';
import { VallarchiPlanComponent } from './vallarchi-plan/vallarchi-plan.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { VallarchiModuleRoutingModule } from './vallarchi-routing.module';
import { FormsModule } from '@angular/forms'; // for ngModel
import { CommonModule } from '@angular/common'; // ⬅️ Required for *ngFor and *ngIf


@NgModule({
  declarations: [
    VallarchiPlanComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    VallarchiModuleRoutingModule
  ]
})
export class VallarchiModule { }
