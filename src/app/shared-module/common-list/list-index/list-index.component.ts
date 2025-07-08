import { Component, Input, OnChanges, Output, EventEmitter, DoCheck } from '@angular/core';
import { AppService } from '../../../core-module/service/app.service';
// declare var $: any;
// import { ListComponent } from 'src/app/common-list/list/list.component';
// interfaces
interface Istatus {
  status: boolean;
  key: Key;
}

interface Key {
  action_id: string;
  acccount_id: string;
  currency_code: string;
  topup: string;
  payment_mode_name: string;
  last_modify: string;
  unique_reference_number: string;
  corporate_name: string;
  status_name: string;
  status_class: string;
  status_code: string;
  topup_status_id: string;
  topup_amount: string;
  current_balance: string;
  current: string;
  s_no: number;
}
@Component({
  selector: 'app-list-index',
  templateUrl: './list-index.component.html',
  styleUrls: ['./list-index.component.scss'],
})
export class ListIndexComponent implements OnChanges, DoCheck {
  public pagination: boolean = true;
  @Input() public list: any;
  @Input() public popupData: any;
  @Input() public tabName: string = '';
  @Input() public flagData: any;
  @Input() public savedReportHide: any;
  @Input() public activeSubMenuData: any;
  @Output() public clickStatus = new EventEmitter<Istatus>();
  @Output() public updatedListData = new EventEmitter();
  @Output() public queueReportUpdatedData = new EventEmitter();
  public listData: any;
  public uploadFile: Array<any> = [];
  public summaryList = {} as any;
  public searchQuery: string = '';
  public download_data: any;
  public startData: any;
  public endData: any;
  public endDataAll: any;
  public downloadHideFlag: any;
  constructor(public appService: AppService) {}

  ngOninit() {}
  ngDoCheck(): void {
    //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
    //Add 'implements DoCheck' to the class.
    if (this.list != undefined && this.list.filter == true) this.loadData();
  }

  ngOnChanges() {
    this.downloadHideFlag = this.savedReportHide;
    this.listData =
      Object.keys(this.list).length > 0 ? this.list : this.listData;
    this.loadData();
    this.startData =
      this.listData?.default_Parms?.itemsPerPage *
        (this.listData?.default_Parms?.page - 1) +
      1;
    this.endDataAll =
      this.startData - 1 + this.listData?.default_Parms?.itemsPerPage;
    this.endData =
      this.endDataAll != 0
        ? this.endDataAll < this.listData?.totalItems
          ? this.endDataAll
          : this.listData?.totalItems
        : this.listData?.totalItems;
  }

  public selectedItem(item: number) {
    let passData: any = this.searchQuery != '' ? this.listData : this.list;
    passData['default_Parms']['itemsPerPage'] = item;
    this.loadData(passData);
    this.ngOnChanges();
  }

  public getCurrentPage(page: number) {
    page = +page;

    this.list['default_Parms']['itemsPerPage'] =
      this.listData['default_Parms']['itemsPerPage'] !=
      this.list['default_Parms']['itemsPerPage']
        ? this.listData['default_Parms']['itemsPerPage']
        : this.list['default_Parms']['itemsPerPage'];

    this.list['default_Parms']['page'] =
      this.listData['default_Parms']['page'] !=
      this.list['default_Parms']['page']
        ? this.listData['default_Parms']['page']
        : this.list['default_Parms']['page'];

    this.list['currentPage'] =
      this.listData['currentPage'] != this.list['currentPage']
        ? this.listData['currentPage']
        : this.list['currentPage'];

    let passData: any = this.searchQuery != '' ? this.listData : this.list;
    if (!this.appService.createReports) {
      this.listData['currentPage'] = page;
      this.listData['default_Parms']['page'] = page;
    }
    passData['currentPage'] = page;
    passData['default_Parms']['page'] = page;
    this.selectedItem(passData['default_Parms']['itemsPerPage']);
    this.ngOnChanges();
  }

  public handleUpdatedData(data: any) {
    this.list = data;
    this.ngOnChanges();
  }

  public loadData(data: any = this.list) {
    if (JSON.stringify(data) != JSON.stringify({}) && data != undefined) {
      let pagination = !this.appService.isTatReport && this.appService.groupPaceInfo.reportSaveListEnable ?
        data['default_Parms']['itemsPerPage'] == 0 ? false : true : false;
      if(!this.appService.isTatReport && this.appService?.groupPaceInfo?.reportSaveListEnable)
        this.listData = this.appService.listService(
          JSON.parse(JSON.stringify(data)),
          pagination
        );
      // summary list data assigned
      if (this.listData.summary_list) {
        this.summaryList = this.listData.summary_list;
        delete this.listData.summary_list;
      }
      // To avoid multiple call from doCheck lifecycle
      if (this.list.filter != undefined && this.list.filter == true)
        this.list.filter = false;
    }
  }

  public search() {
    if (this.searchQuery != '') {
      this.listData.list_body = this.list.list_body;
      var results: any = [];
      this.searchQuery = this.searchQuery.toLowerCase();
      this.listData.list_body.map((data: any, index: number) => {
        for (let key in data) {
          let lowerCaseVal: any =
            typeof data[key] == 'string'
              ? data[key].toLowerCase()
              : (data[key] = '' + data[key]);
          if (lowerCaseVal.indexOf(this.searchQuery) != -1) {
            if (results.indexOf(index) == -1) results.push(index);
          }
        }
      });
      let getData = results.map((data: number) => {
        return this.listData.list_body[data];
      });
      this.listData.list_body = getData;
    } else this.listData.list_body = this.list.list_body;
    this.getCurrentPage(1);
  }

  public getList(data: Array<any>) {
    this.list.list_body = data;
    this.getCurrentPage(1);
  }
  /**
   * Get Invoice download data type
   * @param type
   */
  public downloadData(type: string) {
    this.download_data = type;
  }
  public actionFunction(data: any) {
    // console.log(data)
    //Invoice list download action
    // console.log(this.download_data)
    // if (this.download_data == 'download') {
    //   document.getElementById('loader')?.classList.add('d-block');
    //   this.appService.httpPost(data['moduleName'], data['data'], data['actionName']).subscribe((resdata: any) => {
    //     // let url = 'http://localhost/Wallet/Wallet/Application/application/data/temp/invoice.zip';
    //     document.getElementById('loader')?.classList.remove('d-block');
    //     resdata = resdata.content;
    //     // console.log(resdata, resdata.type, resdata.filePath)
    //     if (resdata.type == 'ZIP') {
    //       let url = resdata.filePath;
    //       window.location.replace(url);
    //       // window.stop();
    //     }
    //     else {
    //       let url = resdata.filePath;
    //       window.open(url);
    //     }
    //   })
    // }
    // let info = (data.name == 'Delete') ? { "type": this.tabName, "deleteKey": data.deleteKey, "deleteKey2a": data.deleteKey2a } : data.key;
    // //Delete action
    // this.appService.httpPost(data.data['moduleName'], info, data.data['actionName']).subscribe((resData: any) => {
    //   if (data.name == 'Delete') {
    //     document.getElementById('loader')?.classList.remove('d-block');
    //     this.loadData(resData.content);
    //   }
    //   else {
    //     document.getElementById('loader')?.classList.remove('d-block');
    //     let downloadFileAction = resData.content.downloadAction;
    //     let url = resData['content']['url'];
    //     if (downloadFileAction !== undefined) {
    //       // window.location.assign = 'https://dev-wallet.infinitisoftware.net/application/data/uploadFile/bankStatement/bank_upload_statement.csv';
    //       window.location.assign(url);
    //     }
    //   }
    // })
  }
  public getStatus(status: any) {
    this.clickStatus.emit(status);
  }
  public getUpdatedListData(data: any) {
    this.updatedListData.emit(data);
  }
  // Queue report response emit to parent
  public getqueueListData(data: any) {
    this.queueReportUpdatedData.emit(data)
  }
}
