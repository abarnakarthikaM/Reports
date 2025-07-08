import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ScheduleReportRoutingModule } from './schedule-report-routing.module';
import { ScheduleComponent } from './schedule/schedule.component';
import { DatePipe } from '@angular/common';
import { CoreModuleModule } from '../../../core-module/core-module.module';
@NgModule({
  declarations: [ScheduleComponent],
  providers: [DatePipe],
  imports: [
    CommonModule,
    ScheduleReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModuleModule
  ]
})
export class ScheduleReportModule { }
