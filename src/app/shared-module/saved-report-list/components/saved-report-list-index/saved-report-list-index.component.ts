import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { urlConfig } from 'src/app/core-module/config/url';
import { TranslatePipe } from 'src/app/core-module/pipes/translate.pipe';
import { AppService } from 'src/app/core-module/service/app.service';
import { environment } from 'src/environments/environment';
declare var $: any;
declare var toastr: any;
@Component({
  selector: 'app-saved-report-list-index',
  templateUrl: './saved-report-list-index.component.html',
  styleUrls: ['./saved-report-list-index.component.scss']
})
export class SavedReportListIndexComponent implements OnInit {
  /**
   * list data variable
   */
  @Input() listData: any = [];
  /**
   * header data
   */
  public headerList: Array<any> = [];
  /**
   * day list
   */
  public daysList: Array<any> = [];
  /**
   * confirmation
   */
  public confirmation: boolean = false;
  /**
   * delete data
   */
  public saveReport: string = '';
  /**
 * delete data
 */
  public repordeltetId: number = 0;


  public ListDataPage: any;

  public deleteData: any;
  /**
 * delete data
 */
  @Output() public responsedeleteData: EventEmitter<object> = new EventEmitter();
  /**
 * delete data
 */
  @Output() public reportBase: EventEmitter<string> = new EventEmitter();
  @Output() public emitListAction: EventEmitter<object> = new EventEmitter();
  /**
  * confirmationContent
  */
  public confirmationContent: any = {};
  constructor(private router: Router, private appService: AppService, private translate: TranslatePipe) { }

  public ngOnInit(): void {

    this.daysList = [
      {
        name: 'Sun',
        id: '0',
        status: 'N'
      },
      {
        name: 'Mon',
        id: '1',
        status: 'N'
      },
      {
        name: 'Tue',
        id: '2',
        status: 'N'
      },
      {
        name: 'Wed',
        id: '3',
        status: 'N'
      }, {
        name: 'Thu',
        id: '4',
        status: 'N'
      }
      , {
        name: 'Fri',
        id: '5',
        status: 'N'
      }
      , {
        name: 'Sat',
        id: '6',
        status: 'N'
      }
    ];
    this.headerList = [
      {
        "headerName": "Report Name"
      },
      {
        "headerName": "Status"
      },
      {
        "headerName": "Scheduled Frequency"
      },
      {
        "headerName": "Scheduled Date Range"
      }
    ]
  }
  publicngOnChanges(): void {
  }
  ngonChanges() {

  }
  /**
   * open schedule
   */
  public openSchedule(type: string, index: number, rowData: any) {
    if (this.listData.reportFor !== 'conversionReport') {
      let editVal: any;
      this.listData.value.map((data: any, i: number) => {
        if (i === index) {
          editVal = data;
        }
      });
      editVal.scheduleStatus = 'Y';
      if (type === 'schedule') {
        this.router.navigate(['/' + urlConfig.ROUTES.report_schedule], { state: { 'editValue': editVal, 'obj': this.listData.val, 'conditionReportBasedOn': this.listData.ReportBasedOn } });
      }
      else if (type === 'edit') {

        this.router.navigate(['/' + urlConfig.ROUTES.custom_report], { state: { 'editValue': editVal, 'obj': this.listData.val, 'conditionReportBasedOn': this.listData.ReportBasedOn } });
      }
    } else {
      this.listActions(rowData, index, type)
    }
  }
  /**
   * actionPerform
   */
  public actionPerform(reportName: string, reportId: number, rowData: any, index: number): void {
    this.saveReport = reportName;
    this.repordeltetId = reportId;
    this.confirmationContent = {
      title: this.translate.transform('Are you sure want to delete ?'),
      button: [
        {
          label: this.translate.transform('No'),
          status: false
        },
        {
          label: this.translate.transform('Yes'),
          status: true
        }
      ]
    };
    this.confirmation = true;
    this.deleteData = { data: rowData, index: index }

  }
  /**
   * confirm action
   */
  public async confirmAction(val: any): Promise<void> {

    if (val.flag === true) {
      if (this.listData.reportFor !== 'conversionReport') {
        var _deleteData: any = {
          reportName: 'delete-report',
          savedReportId: this.repordeltetId,
          reportBasedOn: this.saveReport
        }
        this.reportBase.emit(this.saveReport);
        let deleteReport = this.translate.transform('Report deleted successfully!');
         var data= await this.appService.savedReportDelete(_deleteData).toPromise();
          if (data.responseMessage === 'ok') {
            this.responsedeleteData.emit(data);
            toastr.success(deleteReport);
          }
      } else {
        this.listActions(this.deleteData.data, this.deleteData.index, 'delete');
      }
    }
    this.confirmation = false;
    this.confirmationContent = {};
  }


  public pageReport(event: any) {

    this.ListDataPage = event;
  }

  public async listActions(rowData: any, index: number, action: string) {


    if (action === 'delete') {
      var Reqdata = {
        "reportName": "delete-report",
        "reportBasedOn": rowData[index].reportAdditionalInfo.savedReportInfo.reportBasedOn,
        "savedReportId": rowData[index].savedReportId
      }


      var data = await this.appService.savedReportDeleteReqData(Reqdata).toPromise()

        if (data.responseMessage === 'ok') {
          this.emitListAction.emit({ "action": 'delete' })

          let deleteReport = this.translate.transform('Report deleted successfully!');
          toastr.success(deleteReport);
        }
    }
    else {
      this.emitListAction.emit({
        "rowData": rowData[index],
        "index": index,
        "action": action
      })
    }
  }

}
