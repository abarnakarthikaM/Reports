import { Component, EventEmitter, OnInit, Output, HostListener } from '@angular/core';
import { AppService } from 'src/app/core-module/service/app.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { urlConfig } from '../../../core-module/config/url';
// import { ConnectionService } from 'ng-connection-service';
declare var $:any;
@Component({
  selector: 'app-dynamic-report-index',
  templateUrl: './dynamic-report-index.component.html',
  styleUrls: ['./dynamic-report-index.component.scss'],
})
export class DynamicReportIndexComponent implements OnInit {
  // Layout modifications function call trigger
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkResponsiveLayout();
  }
  public reportData: any;
  public reportKey: string;
  public sideMenuKey: boolean = true;
  public savedReportHide: boolean = true;
  public chartName: string = 'pie';
  public summaryReportData: any;
  @Output() updatedListData = new EventEmitter();
  public networkerror:boolean=false;
  public activeSubMenuData: any;
  public savedQueueList: any;
  public isResponsive: boolean = false;
  public menu: any;

  constructor(public appService: AppService, private router: Router) {
    // private connectionService: ConnectionService
    // this.connectionService.monitor().subscribe(isConnected => {
    //   if (!isConnected) {
    //   this.networkerror = true;
    //   // this.router.navigate(["./" + urlConfig.FRONTEND_ROUTES.nointernet]);
    //   }
    //   });
  }

  ngOnInit(): void {
    // Menu for edit the scheduled report
    this.getReportData();
    this.menu = [
      {
        id: '1',
        name: 'Saved Report',
        key: 'savedReport',
      },
      {
        id: '2',
        name: 'Scheduled Report',
        key: 'scheduledReport',
      },
    ];
    if (window.innerWidth < 1024) {
      this.isResponsive = true;
    }
  }

  // Layout modifications function call
  checkResponsiveLayout(): void {
    if (window.innerWidth < 1024) {
      this.isResponsive = true;
    } else {
      this.isResponsive = false;
    }
  }
  ngOnChange(): void {
    this.appService.showReportData;
  }

  // Following method is used for rendering the summary report chart
  public handleChartElement(chartName: string) {
    this.chartName = chartName;
    if (chartName == 'pie') {
       $('.cls-bar-chart').removeClass('cls-tab-active');
       $('.cls-pie-chart').addClass('cls-tab-active');
    } else if (chartName == 'bar') {
       $('.cls-pie-chart').removeClass('cls-tab-active');
       $('.cls-bar-chart').addClass('cls-tab-active');
    }
  }

  public async getReportData() {
    let reqData = {
      accessToken: sessionStorage.getItem('accessToken'),
    };
    // const reportData= await this.appService.getReportKeyData(reqData).toPromise();
    const _reportData = {
      responseCode: 0,
      responseMessage: 'ok',
      responseData: {
        routing: {
          moduleKey: 'create-report',
          moduleName: 'Create report',
          dafault: true,
        },
      },
    };
    this.reportKey = _reportData.responseData.routing.moduleKey;
    this.reportData = _reportData;
  }

  public handelSubModuleChanges(_activeSubMenuData: any) {
    if (_activeSubMenuData.value == 'userActionReport') {
      this.savedReportHide = false;
    } else {
      this.savedReportHide = true;
    }

    this.activeSubMenuData = _activeSubMenuData;
  }

  // handleRedirect(status: boolean){
  //   console.log(status)
  //   this.appService.createReports = false;
  // }

  // The following method is triggered when changing the flow from create to list or list to create
  public handelFlow(flow: string) {
    this.activeSubMenuData.type=flow;
    this.appService.viewReports=true;
    if(this.appService.isTatReport && flow == 'list')
      this.appService.isTatReport = false;
    if (flow == 'list') {
      this.appService.menuHide = true;
      this.sideMenuKey = false;
    } else {
      this.sideMenuKey = true;
    }
    this.appService.queReportSavedList = flow == 'queue';
    this.savedQueueList = flow == 'queue';
    this.appService.isEditReport = undefined;
    this.appService.showReportData = undefined;
    this.appService.createReports = flow === 'create' ? true : false;
  }

  // Event to get the updated data as output
  public getUpdatedListData(data) {
    this.summaryReportData = data;
    this.updatedListData = data;
    // this.UpdatedListData = data;
  }

 // Method to trigger the selected toggle element.
  public selectTabMenu(type: string, index: number, id: string) {
    $(id + index).addClass('active');
    $(id + index)
      .siblings()
      .removeClass('active');
    // this.appService.isEditReport = undefined;
    if (type === 'savedReport') {
      this.router.navigate(['/' + urlConfig.ROUTES.custom_report], {
        state: {
          editValue: history.state.editValue,
          obj: history.state.obj,
          conditionReportBasedOn: history.state.conditionReportBasedOn,
        },
      });
    } else {
      this.appService.createReports = false;
      this.router.navigate(['/' + urlConfig.ROUTES.report_schedule], {
        state: {
          editValue: history.state.editValue,
          obj: history.state.obj,
          conditionReportBasedOn: history.state.conditionReportBasedOn,
        },
      });
    }
  }
  public menuShowing(){
    this.appService.menuClick = !this.appService.menuClick;
  }
}
