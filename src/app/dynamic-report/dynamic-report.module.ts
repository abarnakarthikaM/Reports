import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { DynamicReportRoutingModule } from './dynamic-report-routing.module';
import { DynamicReportIndexComponent } from './components/dynamic-report-index/dynamic-report-index.component';
import { SideMenuModule } from '../shared-module/side-menu/side-menu.module';
import { CreateReportTabComponent } from './components/create-report-tab/create-report-tab.component';
import { ShowReportListComponent } from './components/show-report-list/show-report-list.component';
import { CheckboxModule } from '../shared-module/checkbox/checkbox.module';
import { SaveandPreviewTabComponent } from './components/saveand-preview-tab/saveand-preview-tab.component';
import { DragAndDropModule } from '../shared-module/drag-and-drop/drag-and-drop.module';
import { CoreModuleModule } from '../core-module/core-module.module';
import { CommonFormModule } from '../shared-module/common-form/common-form.module';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { ListModule } from '../shared-module/common-list/list.module';
import { TranslatePipe } from '../core-module/pipes/translate.pipe';
import { RadioModule } from '../shared-module/radio/radio.module';
import { ShowReportBarChartComponent } from './components/show-report-bar-chart/show-report-bar-chart.component';
import { ShowReportPieChartComponent } from './components/show-report-pie-chart/show-report-pie-chart.component';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [
    DynamicReportIndexComponent,
    CreateReportTabComponent,
    ShowReportListComponent,
    SaveandPreviewTabComponent,
    ShowReportBarChartComponent,
    ShowReportPieChartComponent,
  ],
  providers: [DatePipe, TranslatePipe],
  imports: [
    CommonModule,
    DynamicReportRoutingModule,
    SideMenuModule,
    CheckboxModule,
    DragAndDropModule,
    CoreModuleModule,
    CommonFormModule,
    SharedModuleModule,
    ListModule,
    RadioModule,
    NgApexchartsModule,
  ],
})
export class DynamicReportModule {}
