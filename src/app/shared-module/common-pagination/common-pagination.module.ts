import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonPaginateComponent } from './common-paginate/common-paginate.component';



@NgModule({
  declarations: [CommonPaginateComponent],
  imports: [
    CommonModule
  ],
  exports:[
    CommonPaginateComponent
  ]
})
export class CommonPaginationModule { }
