import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TeamActivityComponent } from './team-activity/team-activity.component'

const routes: Routes = [
  {
    path:"vallarchi",
    loadChildren:()=>import('./vallarchi-plan/vallarchi-plan.module').then(m=>m.VallarchiPlanModule)
  },
  {
    path:'todayplan',
    component:TeamActivityComponent
  },
  {
    path:'',
    component:TeamActivityComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
