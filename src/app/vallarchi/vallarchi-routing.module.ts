import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VallarchiPlanComponent } from './vallarchi-plan/vallarchi-plan.component'

const routes: Routes = [
  {
    path:"",
    component:VallarchiPlanComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VallarchiModuleRoutingModule { }
