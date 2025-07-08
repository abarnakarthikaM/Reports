import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/core-module/service/app.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-show-report-list',
  templateUrl: './show-report-list.component.html',
  styleUrls: ['./show-report-list.component.scss'],
})
export class ShowReportListComponent implements OnInit {
  @Input() activeModuleData: any;
  @Input() savedQueueList: any;

  public listData: any;
  public reportType: any;

  ngOnInit(): void {
    this.appService.savedReportListData = undefined;
  }

  constructor(public appService: AppService) {}

  ngOnChanges(): void {
    this.appService.groupPaceInfo.reportSaveListEnable = true;
    this.reportType=this.activeModuleData?.type;
    let reportName:any;
    reportName = this.appService.queReportSavedList ? 'get-queued-reports':'get-saved-reports'
    let requestData = {
      reportName: reportName,
      reportBasedOn: this.appService.currentBasedOn,
    };
    this.apiCall(reportName,requestData);
  }
  // Common api call for saved reports and queued reports
  public apiCall(reportName: any, requestData: any) {
    this.appService
      .httpPost(
        requestData,
        '',
        environment.CUSTOME_BACKEND_URL + reportName
      )
      .subscribe((data) => {
        if (data?.responseCode == 0) {
          this.appService.savedReportListData = data?.response?.data;
        }
      });
  }
  // Queue report after download response 
  public updatedQueueReport(data: any) {
    console.log(data);
    let reportName = 'get-queued-reports'
    let requestData = {
      reportName: reportName,
      reportBasedOn: this.appService.currentBasedOn,
    };
    this.apiCall(reportName, requestData);
  }
}
