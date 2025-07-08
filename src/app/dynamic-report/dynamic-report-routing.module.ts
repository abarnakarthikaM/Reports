import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicReportIndexComponent } from './components/dynamic-report-index/dynamic-report-index.component';


const routes: Routes = [
  {
    path:"",
    component:DynamicReportIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicReportRoutingModule { }
