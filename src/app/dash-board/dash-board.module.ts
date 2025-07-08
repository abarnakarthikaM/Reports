import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashBoardRoutingModule } from './dash-board-routing.module';
import { DashBoardIndexComponent } from './components/dash-board-index/dash-board-index.component';
import { DashBoardHomeComponent } from './components/dash-board-home/dash-board-home.component';
import { DashBoardPipelineComponent } from './components/dash-board-pipeline/dash-board-pipeline.component';
import { CoreModuleModule } from '../core-module/core-module.module';
import { RequestTrendComparisionComponent } from './components/request-trend-comparision/request-trend-comparision.component';
import { RequestTrendComparision2Component } from './components/request-trend-comparision2/request-trend-comparision2.component';
import { RequestTrendYearComponent } from './components/request-trend-year/request-trend-year.component';
import { RevenueAnalysisComparisionComponent } from './components/revenue-analysis-comparision/revenue-analysis-comparision.component';
import { RevenueAnalysisTotalRevenueComponent } from './components/revenue-analysis-total-revenue/revenue-analysis-total-revenue.component';
import { RequestAnalysisComponent } from './components/revenue-analysis-total-revenue/request-analysis/request-analysis.component';
import { RequestAnalysisDonutComponent } from './components/revenue-analysis-total-revenue/request-analysis-donut/request-analysis-donut.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PipelineCurrentyearComponent } from './components/pipeline-currentyear/pipeline-currentyear.component';
import { PipelineMonthwiseComponent } from './components/pipeline-monthwise/pipeline-monthwise.component';
import { PipelinePosComponent } from './components/pipeline-pos/pipeline-pos.component';
import { PipelineRegionwiseComponent } from './components/pipeline-regionwise/pipeline-regionwise.component';
import { PipelineSectorComponent } from './components/pipeline-sector/pipeline-sector.component';
import { PipelineStationComponent } from './components/pipeline-station/pipeline-station.component';
import { PipelineTravelagentComponent } from './components/pipeline-travelagent/pipeline-travelagent.component';


@NgModule({
  declarations: [DashBoardIndexComponent, DashBoardHomeComponent, DashBoardPipelineComponent, RequestTrendComparisionComponent, RequestTrendComparision2Component, RequestTrendYearComponent, RevenueAnalysisComparisionComponent, RevenueAnalysisTotalRevenueComponent, RequestAnalysisComponent, RequestAnalysisDonutComponent, PipelineCurrentyearComponent, PipelineMonthwiseComponent, PipelinePosComponent, PipelineRegionwiseComponent, PipelineSectorComponent, PipelineStationComponent, PipelineTravelagentComponent],
  imports: [
    CommonModule,
    DashBoardRoutingModule,
    CoreModuleModule,
    SharedModuleModule,
    NgApexchartsModule,
  ]
})
export class DashBoardModule { }
