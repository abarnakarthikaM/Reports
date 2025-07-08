import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestHistoryRoutingModule } from './request-history-routing.module';
import { RequestHistoryComponent } from './request-history/request-history.component';


@NgModule({
  declarations: [RequestHistoryComponent],
  imports: [
    CommonModule,
    RequestHistoryRoutingModule
  ]
})
export class RequestHistoryModule { }
