import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashBoardIndexComponent } from './components/dash-board-index/dash-board-index.component';


const routes: Routes = [
  {
    path:"",
    component:DashBoardIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashBoardRoutingModule { }
