import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VallarchiSheetComponent } from './vallarchi-sheet/vallarchi-sheet.component'
const routes: Routes = [
  {
    path:'',
    component:VallarchiSheetComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VallarchiPlanRoutingModule { }
