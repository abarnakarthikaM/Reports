import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestHistoryComponent } from './request-history/request-history.component';


const routes: Routes = [
  {
    path: '',
    component: RequestHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestHistoryRoutingModule { }
