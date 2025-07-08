import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { urlConfig } from './core-module/config/url'


const routes: Routes = [
  
  
  // {
  //   path: urlConfig.ROUTES.custom_report,
  //   loadChildren: () => import('./custom-report/custom-report.module').then(m => m.CustomReportModule),
  // },
  // {
  //   path: urlConfig.ROUTES.saved_report_list,
  //   loadChildren: () => import('./saved-reports/saved-reports.module').then(m => m.SavedReportsModule),
  // },
  {
    path: urlConfig.ROUTES.report_schedule,
    loadChildren: () => import('./dynamic-report/components/schedule-report/schedule-report.module').then(m => m.ScheduleReportModule),
  },
  {
    path: urlConfig.ROUTES.requestHistory,
    loadChildren: () => import('./request-history/request-history.module').then(m=> m.RequestHistoryModule)  
  },
  // {
  //   path: urlConfig.ROUTES.conversion_report,
  //   loadChildren: () => import('./conversion-report/conversion-report.module').then(m=> m.ConversionReportModule)
  // },

  
  {
    path:urlConfig.ROUTES.dashboard,
    loadChildren: () => import('./dash-board/dash-board.module').then(m => m.DashBoardModule),
  },
  // {
  //   path: urlConfig.ROUTES.user_actions,
  //   loadChildren: () => import('./user-action/user-action.module').then(m=>m.UserActionModule)
  // },
  {
    path: urlConfig.ROUTES.error,
    loadChildren: () => import('./shared-module/error/error.module').then(m=>m.ErrorModule)
  },
  {
    path:urlConfig.ROUTES.reports,
    loadChildren:()=> import('./dynamic-report/dynamic-report.module').then(m=>m.DynamicReportModule)
  },
  {
    path:urlConfig.ROUTES.summary_report,
    loadChildren:()=> import('./dynamic-report/dynamic-report.module').then(m=>m.DynamicReportModule)
  },
  {
    path: '',
    redirectTo: urlConfig.ROUTES.reports,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: urlConfig.ROUTES.reports,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, initialNavigation: "disabled" })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
