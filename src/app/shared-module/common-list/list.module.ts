import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListRoutingModule } from './list-routing.module';
import { ListIndexComponent } from './list-index/list-index.component';
import { ListComponent } from './list/list.component';
import { PaginationComponent } from './pagination/pagination.component';
import { JumpPageComponent } from './jump-page/jump-page.component';
import { ItemsPerPageComponent } from './items-per-page/items-per-page.component';
import { SharedModuleModule } from '../shared-module.module';
import { SearchFilterPipe } from "./list/search-filter.pipe";
import { PassengerListModalComponent } from '../passenger-list-modal/passenger-list-modal.component';
// import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  declarations: [ListIndexComponent,  PaginationComponent, JumpPageComponent, ItemsPerPageComponent,ListComponent,SearchFilterPipe,PassengerListModalComponent],
  imports: [
    FormsModule,
    CommonModule,
    ListRoutingModule,
    ReactiveFormsModule,
    SharedModuleModule,
    // NgCircleProgressModule.forRoot({
    //   radius: 50,
    //   outerStrokeWidth: 5,
    //   innerStrokeWidth: 5,
    //   outerStrokeColor: "#007bff",
    //   innerStrokeColor: "#C7E596",
    //   animationDuration: 300,
    //   title: ""
    // })
  ],
  providers: [],
  exports: [
    ListIndexComponent,
    PaginationComponent,
    ItemsPerPageComponent,
    JumpPageComponent,
    PassengerListModalComponent,
  ]
})
export class ListModule { }
