import { Component, OnChanges, Input, DoCheck, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { urlConfig } from 'src/app/core-module/config/url';
import { TranslatePipe } from 'src/app/core-module/pipes/translate.pipe';
import { environment } from 'src/environments/environment';
import { AppService } from '../../../core-module/service/app.service';
import { LogUserActionsService } from 'src/app/core-module/service/log-user-actions.service';

declare var $: any;
declare var toastr: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [TranslatePipe],
})
export class ListComponent implements OnChanges, DoCheck {
  @Input() listData = {} as any;
  @Input() public arrowFlag: any;
  @Input() public downloadHideFlag: any;
  @Input() public activeSubMenuList: any;
  @Output() status = new EventEmitter();
  @Output() updatedListData = new EventEmitter();
  @Output() Sort = new EventEmitter();
  @Output() updatedData = new EventEmitter();
  @Output() queueListData = new EventEmitter();
  @Input() public popupData: any;
  sortingOrder: number = 0;
  mainHeader: Array<any> = [];
  subHeader: Array<any> = [];
  checkAllData: string = 'No';
  checked: boolean = false;
  enableCheckbox: boolean = false;
  enableExpand: boolean = false;
  checkBoxData: Array<any> = [];
  searchText: string;
  // expandAll: boolean[] = [];
  @Output() emitAction = new EventEmitter();
  popupEmpty: boolean = false;
  downloadFileAction: string = '';
  popup: object = {};
  expandAllIcon: boolean = true;
  @Output() public downloadData = new EventEmitter();
  @Output() public emitListAction: EventEmitter<object> = new EventEmitter();
  @Output() public responsedeleteData: EventEmitter<object> =
    new EventEmitter();
  @Output() public reportBase: EventEmitter<string> = new EventEmitter();
  public isCheckBox: boolean = false;
  private currentPageNumber: number = 1;
  public isPopUp: boolean = false;
  public popupDataInfo: any[] = [];
  public userActionReportBasedOn: any;
  public isNameChangeReport: boolean = false;
  public isGroupReportNodata: boolean = false;


  saveReport: string;
  repordeltetId: number;
  public confirmationContent: any = {};
  public deleteRow: any;
  public sorting: boolean = false;
  confirmation: boolean = false;
  downloadfile: boolean = false;
  deleteData: { data: any; index: number };

  constructor(
    private router: Router,
    public appService: AppService,
    private translate: TranslatePipe,
    private logUserAction: LogUserActionsService
  ) { }
  ngOnInit() { }

  ngOnChanges() {
    // Show report tab click based response changes
    if (this.listData?.groupPaceReport?.length == 0 && this.appService.groupPaceInfo.reportDrpDwnValSet)
      this.isGroupReportNodata = true;
    else
      this.isGroupReportNodata = false;
    if (!this.appService?.groupPaceInfo?.reportSaveListEnable && this.appService.groupPaceInfo.reportDrpDwnValSet) {
      if (this.appService.groupPaceInfo.reportTabEnable === 'booked') {
        this.listData = this.appService?.groupPaceInfo?.reportTabValChange[0]
      } else {
        this.listData = this.appService?.groupPaceInfo?.reportTabValChange[1]
      }
    }
    if (!this.appService.viewReports) {
      setTimeout(() => {
        let firstInvalidControl = document.querySelector('#listTable');
        if (firstInvalidControl) {
          const rect = firstInvalidControl.getBoundingClientRect();
          window.scrollTo({
            top: rect.top - 130 + window.scrollY, // Use scrollY to get the current scroll position
            behavior: 'smooth', // Add smooth scrolling
          });
        }
      });
    }
    if (!this.isGroupReportNodata) {
      this.isCheckBox =
        this.listData?.add_on_details &&
        Object.keys(this.listData?.add_on_details).length > 0;
      if (
        this.isCheckBox &&
        this.appService.popupReportName == 'ssr-report' &&
        this.listData.list_header[0].template != 'checkbox'
      )
        this.handlePopUpData();
      if (!this.listData?.orginalData && this.listData?.list_body)
        this.listData['orginalData'] = this.listData['list_body'];
      this.paginationCount(this.listData['list_body']);
      if (!this.appService.createReports) this.handleSaveReportData();
      let emptyObj = this.listData
        ? Object.keys(this.listData).length > 0
        : false;
      if (emptyObj) {
        this.enableCheckbox =
          this?.listData!?.default_Parms!?.checkbox != undefined
            ? this.listData!.default_Parms!.checkbox
            : this.enableCheckbox;
        this.enableExpand = this.listData?.default_Parms?.expand;
        this.mainHeader = this.listData['list_header']?.filter(
          (data: any) => data.status != false
        );
        if (this.enableExpand == true)
          this.subHeader = this.listData['list_header']?.filter(
            (data: any) => data.status == false
          );
        this.checkBoxData = this.listData['checkAllTab'];
      }
    }
  }
  ngDoCheck() {
    let getClassGreen = $('.cls-body-cell').hasClass('cls-rupee-green');
    if (getClassGreen) {
      $('.cls-body-cell.cls-rupee-green')
        .siblings('.cls-rupee')
        .addClass('cls-green');
    }
    let getClassRed = $('.cls-body-cell').hasClass('cls-rupee-red');
    if (getClassRed) {
      $('.cls-body-cell.cls-rupee-red')
        .siblings('.cls-rupee')
        .addClass('cls-red');
    }
  }

  // Handle the filter for show report table
  applyFilter(filterValue: string) {
    const filtetData = this.listData.orginalData.filter(function (item) {
      return JSON.stringify(item)
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    });
    this.listData.default_data = [];
    this.listData.list_body = filtetData;
    let currentPageStartValue =
      ((this.listData.currentPage
        ? this.listData.currentPage
        : this.currentPageNumber) -
        1) *
      this.listData?.default_Parms?.itemsPerPage;
    let lengthOfData: number =
      this.listData?.default_Parms?.itemsPerPage == 0
        ? filtetData.length
        : currentPageStartValue + this.listData?.default_Parms?.itemsPerPage;
    for (let i = currentPageStartValue; i < lengthOfData; i++)
      if (filtetData[i]) this.listData.default_data.push(filtetData[i]);
    this.updatedData.emit(this.listData);
  }

  public checkAll() {
    let status = this.checkAllData == 'No' ? 'Yes' : 'No';
    for (let i = 0; i < this.listData['default_data'].length; i++) {
      this.checkItem(i, status);
    }
    this.listData['list_body'].map((data: any) => (data.checkbox = status));
  }

  // Handle date format for save report list data
  public handleDateFormat(dates) {
    return new Date(dates)
      .toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
      .toString()
      .replace(',', '')
      .replace(' ', '-')
      .replace(' ', '-');
  }

  // Handle over all check for the name change report and any other popup table data.
  public handleOverAllCheck(status?: any) {
    if (!status) {
      this.listData.list_header[0].status =
        this.listData.list_header[0].status == 'N' ? 'Y' : 'N';
      this.checkItem(undefined, this.listData.list_header[0].status);
    } else if (status) {
      this.listData.list_header[0].status = status;
    }
  }

  // Following method is used for handling the popup data for SSR report.
  public handlePopUpData() {
    let checkBoxHeaderInfo = {
      template: 'checkbox',
      status: 'N',
    };
    (this.listData.list_header as any[]).unshift(checkBoxHeaderInfo);
    this.appService.passengerInfo['reportName'] =
      this.listData?.add_on_details?.reportName;
    this.appService.passengerInfo['reportBasedOn'] =
      this.listData?.add_on_details?.reportBasedOn;
    // this.appService.passengerInfo[this.listData?.addOnDetails?.refererId] = [];
  }

  // Handle the saved report data and also frame an saved report table data from the get table data response.
  public handleSaveReportData() {
    let customizeData: any = [];
    this.listData['list_body'].map((value: any) => {
      let data: any = {};
      this.listData['list_header'].map((item: any) => {
        if (item?.template == 'reportStatus' || item?.template == 'queuedReportName' || item?.template == 'queuedDate') {
          data[item.template] = value[item.template];
          data['queuedReportId'] = value.queuedReportId;
          data['completedPercentage'] = value.completedPercentage;
        } else if (item?.template == 'scheduleStatus') {
          data[item.template] =
            value[item.template] == 'N' ? 'Not scheduled' : 'Scheduled';
          data['status_class'] =
            value[item.template] == 'N' ? 'cls-Not-schedule' : 'cls-schedule';
          data['savedReportId'] = value.savedReportId;
        } else if (item?.template == 'savedReportName') {
          data[item.template] = value[item.template];
        } else if (
          item?.template ==
          'reportAdditionalInfo.scheduleInfo.frequencyStartDate'
        ) {
          let startData = this.handleDateFormat(
            value.reportAdditionalInfo.scheduleInfo.frequencyStartDate
          );
          let endDate = this.handleDateFormat(
            value.reportAdditionalInfo.scheduleInfo.frequencyEndDate
          );
          data[item.template] =
            startData == 'Invalid-Date' ? 'N/A' : startData + ' to ' + endDate;
        } else if (
          item?.template ==
          'reportAdditionalInfo.scheduleInfo.frequencyDaysOfWeek'
        ) {
          let weakArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          // let dayInfo: string[] = [];
          let handleData =
            value?.reportAdditionalInfo?.scheduleInfo?.frequencyDaysOfWeek;
          if (handleData) {
            data[item.template] = [];
            for (let i = 0; i < handleData.length; i++) {
              data[item.template].push(weakArray[Number(handleData[i])]);
            }
          } else {
            data[item.template] = 'N/A';
          }
        }
      });
      customizeData.push(data);
    });
    // Page count calculation and showing filete function call
    this.paginationCount(customizeData);
  }

  // Handle data for name change report
  public checkItem(index: number, status?: any) {
    if (!status) {
      if (!this.listData['default_data'][index]['checkbox']) {
        this.popupDataInfo.push(
          this.listData['default_data'][index][
          this.listData?.add_on_details?.refererId
          ]
        );
        this.listData['default_data'][index]['checkbox'] = 'Yes';
      } else {
        let unCheckdata = [];
        this.popupDataInfo.map((val) => {
          if (
            val !=
            this.listData['default_data'][index][
            this.listData?.add_on_details?.refererId
            ]
          )
            unCheckdata.push(val);
        });
        this.popupDataInfo = unCheckdata;
        delete this.listData['default_data'][index]['checkbox'];
      }
    } else {
      this.popupDataInfo = status == 'Y' ? [] : this.popupDataInfo;
      this.listData.default_data.map((dataInfo) => {
        if (status == 'Y') {
          this.popupDataInfo.push(
            dataInfo[this.listData?.add_on_details?.refererId]
          );
          dataInfo['checkbox'] = 'Yes';
        } else if (status == 'N') {
          this.popupDataInfo = [];
          dataInfo = dataInfo.checkbox ? delete dataInfo.checkbox : dataInfo;
        }
      });
    }
    let count: number = 100;
    this.listData.default_data.map((dataInfo) => {
      count = dataInfo.checkbox ? count + 1 : count - 1;
    });
    if (this.listData.default_data.length < this.listData?.default_Parms?.itemsPerPage) {
      if (count == 100 + this.listData.default_data.length)
        this.handleOverAllCheck('Y');
      else this.handleOverAllCheck('N');
    } else {
      if (count == 100 + this.listData?.default_Parms?.itemsPerPage)
        this.handleOverAllCheck('Y');
      else this.handleOverAllCheck('N');
    }
    this.appService.passengerInfo[this.listData?.add_on_details?.refererId] =
      this.popupDataInfo;
    // this.handleOverAllCheck();
  }

  public handleNameChangeReport(data: any) {
    // Handle name change report info to the appService variable
    this.appService.passengerInfo['reportBasedOn'] =
      this.listData.add_on_details.reportBasedOn;
    this.appService.passengerInfo['reportName'] =
      this.listData.add_on_details.reportName;
    this.appService.passengerInfo[this.listData?.add_on_details?.refererId] =
      data[this.listData?.add_on_details?.refererId];
    this.isNameChangeReport = true;
  }
  /**
   * Expand all list row
   */
  public expandAll() {
    this.expandAllIcon = !this.expandAllIcon;
    this.appService.expandContainerAll(this.listData);
  }

  /**
   * Expand each list row
   * @param id
   */
  public expandContainer(id: number) {
    this.appService.expandList(id, this.listData);
  }
  public invoiceiddata(data: any) {
    this.router.navigate(
      ['./' + urlConfig.ROUTES.home + '/' + urlConfig.ROUTES['invoiceDetails']],
      { state: { invoiceData: data, menuname: 'ledger' } }
    );
  }
  public view(routerName: any, key: any) {
    let data: Array<any> = [];
    if (this.listData.uploadFile != undefined) {
      if (this.listData['uploadFile'].length > 0)
        data = this.listData['uploadFile'];
    }
    let status = { status: true, key: key };
    routerName == 'editInvoiceRestriction' &&
      'editCreditLimt' &&
      'editTransactionFee'
      ? this.status.emit(status)
      : this.status.emit(status);
    if (data.length >= 0) {
      if (
        key['billAction'] != undefined &&
        key['bill_pending_amount'] == '0.00'
      ) {
        this.status.emit(key['billingInvoice']);
      } else if (
        key['billAction'] != undefined &&
        key['bill_pending_amount'] != '0.00'
      ) {
        routerName = key['billAction'];
        this.router.navigate(
          ['./' + urlConfig.ROUTES.home + '/' + urlConfig.ROUTES[routerName]],
          {
            state: {
              key: key,
              moduleName: '',
              actionName: '',
              uploadFile: data,
            },
          }
        );
      } else
        this.router.navigate(
          ['./' + urlConfig.ROUTES.home + '/' + urlConfig.ROUTES[routerName]],
          {
            state: {
              key: key,
              moduleName: '',
              actionName: '',
              uploadFile: data,
            },
          }
        );
    } else {
      alert('No PDF File Data Found!');
    }
  }
  public action(data: any, listData: any) {
    if (data.name == 'view') {
      listData.list_header.map((header: any) => {
        if (header['template'] == 'view') {
          let routerName = header['action_name'];
          let actionArray: Array<any> = [];
          let uploadData: Array<any> = [];
          listData.list_body.map((key: any) => {
            if (key.checkbox == 'Yes') {
              actionArray.push(key.action_id);
              if (this.listData.uploadFile != undefined) {
                if (this.listData['uploadFile'].length > 0)
                  uploadData = this.listData['uploadFile'];
              }
            }
          });
          if (uploadData.length >= 0) {
            this.router.navigate(
              [
                './' +
                urlConfig.ROUTES.home +
                '/' +
                urlConfig.ROUTES[routerName],
              ],
              {
                state: {
                  key: actionArray,
                  moduleName: '',
                  actionName: '',
                  uploadFile: uploadData,
                },
              }
            );
          } else {
            alert('No PDF File Data Found!');
          }
        }
      });
    }
    if (data.name == 'Download') {
      let actionArray: Array<any> = [];
      listData.list_body.map((key: any) => {
        if (key.checkbox == 'Yes') {
          actionArray.push(key.action_id);
        }
      });
      let downloadList = {
        data: {
          moduleName: 'cumulativeInvoice',
          actionName: 'pnrInvoiceZipDownload',
        },
        key: {
          key: actionArray,
        },
      };
      this.popup = {
        value: downloadList,
        type: 'success',
        statusText: '',
        messageContent: 'Are you sure want to download this record ?',
        actions: ['No', 'Yes'],
      };
      this.popupEmpty = true;
    }

    if (data.name == 'View') {
      let router = listData.list_header.filter((data: any) => data.action_name);
      router = router[0].action_name;
      let invoiceId = listData.list_body.filter(
        (data: any) => data['checkbox'] == 'Yes'
      );
      // invoiceId = invoiceId.map((data: any) => data.invoice_id);
      if (invoiceId.length < 10 && invoiceId.length > 1)
        this.router.navigate(
          ['./' + urlConfig.ROUTES.home + '/' + urlConfig.ROUTES[router]],
          { state: { invoice: invoiceId } }
        );
      else
        this.popup = {
          value: '',
          type: 'alert',
          statusText: 'Information!',
          messageContent: 'You are select 2 to 10 range',
          actions: ['Ok'],
        };
      this.popupEmpty = true;
    }
    //Invoice list download
    if (data.type == 'download') {
      let type = data.type;
      let actionArray: Array<any> = [];
      listData.list_body.map((key: any) => {
        if (key.checkbox == 'Yes') {
          actionArray.push(key.list_id);
        }
      });
      this.downloadData.emit(type);
      let downloadList = {
        data: {
          moduleName: this.popupData.moduleName,
          actionName: this.popupData.actionName,
        },
        key: {
          key: actionArray,
        },
      };
      let invoiceId = listData.list_body.filter(
        (data: any) => data['checkbox'] == 'Yes'
      );
      if (invoiceId.length < 5 && invoiceId.length >= 1) {
        this.popup = {
          value: downloadList,
          type: 'alert',
          statusText: 'Information!',
          messageContent: this.popupData.messageContent,
          actions: this.popupData.actions,
        };
      } else {
        this.popup = {
          value: downloadList,
          type: 'alert',
          statusText: 'Information!',
          messageContent: 'Please Select 2 to 5 range',
          actions: ['Ok'],
        };
      }
      this.popupEmpty = true;
    }
    if (data.name == 'Delete') {
      let newData: string[] = [];
      let updateData: string[] = [];
      listData.list_body.map((data: any) => {
        if (data.checkbox == 'Yes') {
          data.deleteKey2a != undefined
            ? updateData.push(data.deleteKey2a)
            : newData.push(data.deleteKey);
        }
      });
      let emitActionInfo = {
        data: data,
        deleteKey: newData,
        deleteKey2a: updateData,
      };
      let msgContent =
        data.name.toLowerCase() == 'delete'
          ? 'Are you sure want to delete this record ?'
          : 'Are you sure want to download this record ?';
      this.popup = {
        value: emitActionInfo,
        type: 'alert',
        statusText: 'Information!',
        messageContent: msgContent,
        actions: ['No', 'Yes'],
      };
      this.popupEmpty = true;
    }
  }

  /**
   * Modal
   */
  public modalStatus(data: any) {
    this.popupEmpty = false;
    if (data['data'].toLowerCase() == 'yes') {
      this.emitAction.emit(data.value);
    }
    if (
      data['data'].toLowerCase() == 'no' ||
      data['data'].toLowerCase() == 'ok' ||
      data['data'].toLowerCase() == 'yes'
    ) {
      this.popupEmpty = false;
      this.popup = {};
    }
    if (
      data['data'].toLowerCase() == 'download as zip' ||
      data['data'].toLowerCase() == 'download as pdf'
    ) {
      let download_key = {
        data: {
          action_id: data.value.key.key,
          download_key: data['data'],
        },
        moduleName: this.popupData.moduleName,
        actionName: this.popupData.actionName,
      };
      this.emitAction.emit(download_key);
      // this.popup = {};
      // this.popupEmpty = false;
    }
  }

  download(actionId: string) {
    this.appService
      .httpPost('billingDetails', actionId, 'downloadBilling')
      .subscribe((data) => {
        let downloadBillInvoice = data['content'];
        if (downloadBillInvoice['url'] != undefined) {
          window.location.assign(downloadBillInvoice['url']);
        }
      });
  }

  public navigateUrl(action: string, key: any) {
    this.router.navigate(
      ['./' + urlConfig.ROUTES.home + '/' + urlConfig.ROUTES[action]],
      { state: { key: key } }
    );
  }

  /**
   * open schedule
   */
  public async openSchedule(type: string, index: number, rowData: any, rowId: any) {
    index = rowData?.currentPage === 1 ? index : ((rowData?.currentPage - 1) * rowData?.default_Parms?.itemsPerPage) + index;
    if (this.listData.reportFor !== 'conversionReport') {
      let editVal: any;
      this.listData.orginalData.map((data: any, i: number) => {
        if (i === index) {
          editVal = data;
        }
      });
      this.userActionReportBasedOn =
        editVal.reportAdditionalInfo?.savedReportInfo?.reportBasedOn;
      editVal.scheduleStatus = 'scheduled';
      if (type === 'schedule') {
        this.appService.queReportSideMenuList = false;
        this.router.navigate(['/' + urlConfig.ROUTES.report_schedule], {
          state: {
            editValue: editVal,
            obj: this.listData.val,
            conditionReportBasedOn: this.listData.ReportBasedOn,
            submenuData: this.activeSubMenuList.activeMenu,
          },
        });
        this.logUserAction.logUserAction(
          editVal,
          environment.CUSTOME_BACKEND_URL + 'add-user-action-log',
          'Custom Report',
          this.activeSubMenuList.activeMenu,
          'SCHEDULE',
          'SCHEDULE_REPORTS',
          'User viewed the ' +
          this.activeSubMenuList.activeMenu +
          ' schedule page'
        );
      } else if (type === 'edit') {
        this.appService.menuHide = false;
        this.appService.queReportSideMenuList = false;
        this.appService.createReports = true;
        this.appService.updateValue = {
          editValue: editVal,
          obj: this.listData.val,
          conditionReportBasedOn: this.listData.ReportBasedOn,
        };
        this.logUserAction.logUserAction(
          editVal,
          environment.CUSTOME_BACKEND_URL + 'add-user-action-log',
          'Custom Report',
          this.activeSubMenuList.activeMenu,
          'EDIT',
          'EDIT_REPORTS',
          'User viewed the ' + this.activeSubMenuList.activeMenu + ' edit page'
        );
      } else if (type === 'View') {
        this.appService.queReportSideMenuList = false;
        this.appService.viewReports = false;
        this.appService.createReports = true;
      } else if (type === 'download') {
        this.appService.queReportSideMenuList = true;
        const formData = {
          reportName: 'download-file',
          downloadFilePath: rowData.orginalData[index].downloadLink,
        };
        let fileName = rowData.orginalData[index].fileName;
        this.appService.downloadExcel(
          formData,
          'xlsx',
          environment.COMMON_URL + 'download-file',
          fileName
        );
        const requestData = {
          reportName: "update-queued-save-report",
          reportBasedOn: this.appService.currentBasedOn,
          referenceId: rowId
        }
        this.appService
          .httpPost(
            requestData,
            '',
            environment.CUSTOME_BACKEND_URL + 'queued-save-reports'
          )
          .subscribe((data) => {
            console.log(data);
            this.queueListData.emit(data);
          })
        toastr.error('Caution: The report will be deleted after it is downloaded.')
      }
      if (this.appService.groupPaceInfo.reportDrpDwnValSet) {
        let grpEditval = editVal.reportAdditionalInfo.savedReportInfo.chosenConditions
        let departureYear = {
          departureYearFrom: "",
          departureYearTo: ""
        }
        let bookedYear = {
          bookedYearFrom: "",
          bookedYearTo: ""
        }
        let editValAdd: any = []
        Object.entries(grpEditval).forEach(([key, value]) => {
          editValAdd.push(key)
        })
        if (!editValAdd.includes('departureYear'))
          editVal.reportAdditionalInfo.savedReportInfo.chosenConditions.departureYear = departureYear;
        else if (!editValAdd.includes('bookedYear'))
          editVal.reportAdditionalInfo.savedReportInfo.chosenConditions.bookedYear = bookedYear;
      }
      this.appService.isEditReport = editVal;
      // this.router.navigate(['/' + urlConfig.ROUTES.reports], { state: { 'editValue': editVal, 'obj': this.listData.val, 'conditionReportBasedOn': this.listData.ReportBasedOn } });
    } else {
      this.listActions(rowData, index, type);
    }
  }
  /**
   * actionPerform
   */
  public actionPerform(
    reportName: string,
    reportId: number,
    rowData: any,
    index: number,
    event: Event
  ): void {
    this.saveReport = reportName;
    this.repordeltetId = reportId;
    this.confirmationContent = {
      title: this.translate.transform('Are you sure want to delete ?'),
      button: [
        {
          label: this.translate.transform('No'),
          status: false,
        },
        {
          label: this.translate.transform('Yes'),
          status: true,
        },
      ],
    };
    this.confirmation = true;
    this.deleteData = { data: rowData, index: index };
    this.deleteRow = $(event.target).closest('tr');
    setTimeout(function () {
      $('#alert-heading').attr('tabindex', '0').focus();
    }, 1000);
  }

  public DeleteTab(event: Event, index: number) {
    console.log('deleteevenet', event, 'number-index', index);
  }

  // Action list for the saved report page
  public async confirmAction(val: any): Promise<void> {
    if (val.flag === true) {
      if (this.listData.reportFor !== 'conversionReport') {
        var _deleteData: any = {
          reportName: 'delete-report',
          savedReportId: this.repordeltetId,
          reportBasedOn: this.appService.currentBasedOn,
        };
        this.userActionReportBasedOn = this.appService.currentBasedOn;
        this.logUserAction.logUserAction(
          _deleteData,
          environment.CUSTOME_BACKEND_URL + 'add-user-action-log',
          'Custom Report',
          this.activeSubMenuList.activeMenu,
          'DELETE',
          'DELETE_REPORTS',
          'User viewd the ' + this.activeSubMenuList.activeMenu + ' delete page'
        );
        this.reportBase.emit(this.saveReport);
        let deleteReport = this.translate.transform(
          'Report deleted successfully!'
        );
        var data = await this.appService
          .getDeleteReports(_deleteData)
          .toPromise();
        if (data?.responseCode === 0) {
          setTimeout(() => {
            this.currentPageNumber = this.listData.currentPage;
            this.responsedeleteData.emit(data);
            let requestData = {
              reportName: 'get-saved-reports',
              reportBasedOn: this.appService.currentBasedOn,
            };
            this.appService
              .httpPost(
                requestData,
                '',
                environment.CUSTOME_BACKEND_URL + 'get-saved-reports'
              )
              .subscribe((data) => {
                if (data?.responseCode == 0) {
                  this.listData = data?.response?.data;
                  this.appService.savedReportListData = data?.response?.data;
                  this.appService.totalSavedRecords =
                    this.listData.list_body.length;
                  // if (!this.appService.createReports) this.handleSaveReportData();
                }
              });
            toastr.success(deleteReport);
          }, 500);
        }
      } else {
        this.listActions(this.deleteData.data, this.deleteData.index, 'delete');
      }
      this.confirmationContent = {};
    }
    this.confirmation = false;
  }

  // Handle sorting for show report table
  public handleSorting(sortInfo: any) {
    this.listData.list_header.map((value) => {
      if (value.template == sortInfo.template)
        value.sorting = value.sorting == 'Y' ? 'N' : 'Y';
    });
    let sortField = sortInfo.template;
    if (
      sortInfo?.template?.toLowerCase()?.includes('date') &&
      !isNaN(new Date(this.listData.default_data[0][sortField]).getTime())
    ) {
      this.listData.default_data.sort((a, b) => {
        // Extracting numerical values from the string "confirmedPax/sector"
        const dateA: any = new Date(a[sortField]);
        const dateB: any = new Date(b[sortField]);

        // Comparing confirmed pax values
        return this.sorting ? dateA - dateB : dateB - dateA;
      });
    } else if (
      this.listData.default_data[0][sortField].toString().includes('/') &&
      !isNaN(Number(this.listData.default_data[0][sortField].split('/')[0]))
    ) {
      if (this.sorting)
        this.listData.default_data.sort((a, b) => {
          // Extracting numerical values from the string "confirmedPax/sector"
          let [aConfirmedPax, aSector] = a[sortField].split('/');
          let [bConfirmedPax, bSector] = b[sortField].split('/');

          // Comparing confirmed pax values
          return parseInt(aConfirmedPax) - parseInt(bConfirmedPax);
        });
      else {
        this.listData.default_data.sort((a, b) => {
          // Extracting numerical values from the string "confirmedPax/sector"
          let [aConfirmedPax, aSector] = a[sortField].split('/');
          let [bConfirmedPax, bSector] = b[sortField].split('/');

          // Comparing confirmed pax values
          return parseInt(bConfirmedPax) - parseInt(aConfirmedPax);
        });
      }
    } else if (
      this.listData.default_data[0][sortField].toString().includes('%') &&
      !isNaN(Number(this.listData.default_data[0][sortField].split('%')[0]))
    ) {
      if (this.sorting)
        this.listData.default_data.sort((a, b) => {
          let aValue = parseInt(a[sortField]);
          let bValue = parseInt(b[sortField]);
          return aValue - bValue;
        });
      else
        this.listData.default_data.sort((a, b) => {
          let aValue = parseInt(a[sortField]);
          let bValue = parseInt(b[sortField]);
          return bValue - aValue;
        });
    } else if (!isNaN(Number(this.listData.default_data[0][sortField]))) {
      if (this.sorting)
        this.listData.default_data.sort((a, b) => {
          return Number(a[sortField]) - Number(b[sortField]);
        });
      else
        this.listData.default_data.sort((a, b) => {
          return Number(b[sortField]) - Number(a[sortField]);
        });
    } else if (typeof this.listData.default_data[0][sortField] == 'string') {
      !this.sorting
        ? this.listData.default_data.sort((a, b) =>
          a[sortField] > b[sortField] ? -1 : 1
        )
        : this.listData.default_data.sort((a, b) =>
          a[sortField] < b[sortField] ? -1 : 1
        );
    }
    this.updatedListData.emit(this.listData);
    this.sorting = !this.sorting;
  }

  public async listActions(rowData: any, index: number, action: string) {
    if (action === 'delete') {
      var Reqdata = {
        reportName: 'delete-report',
        reportBasedOn:
          rowData[index].reportAdditionalInfo?.savedReportInfo?.reportBasedOn,
        savedReportId: rowData[index].savedReportId,
      };
      var data = await this.appService
        .getSavedReportDelete(Reqdata)
        .toPromise();
      if (data.responseMessage === 'ok') {
        this.emitListAction.emit({ action: 'delete' });

        let deleteReport = this.translate.transform(
          'Report deleted successfully!'
        );
        toastr.success(deleteReport);
      }
    } else {
      this.emitListAction.emit({
        rowData: rowData[index],
        index: index,
        action: action,
      });
    }
  }
  public dowloadPath(): void {
    this.downloadfile = !this.downloadfile;
    setTimeout(function () {
      $('.cls-moreOption').focus();
    }, 200);
    // $('.cls-moreOption').addClass('d-block');
    // $('.cls-moreOption').removeClass('d-none');
    //   const formData = {
    //     reportName:'download-file',
    //     downloadFilePath: this.listData.downloadFilePath
    // };
    // let fileName = this.listData.downloadFilePath.split('/').pop().split('.')[0];
    // this.appService.downloadExcel(formData, '', environment.COMMON_URL + 'download-file',fileName);
    // const formData = {
    //   reportName: 'download-file',
    //   downloadFilePath: this.listData.downloadFilePath,
    // };
    // let fileName = this.listData.downloadFilePath
    //   .split('/')
    //   .pop()
    //   .split('.')[0];
    // // this.appService.downloadExcel(formData, '', environment.COMMON_URL + 'download-file',fileName);
    // this.appService.downloadExcel(
    //   formData,
    //   '',
    //   'http://dev-rm.grouprm.net/reports/common/download-file',
    //   fileName
    // );
  }

  // Download the csv data
  public dowloadcsvPath() {
    this.downloadfile = !this.downloadfile;
    const formData = {
      reportName: 'download-file',
      downloadFilePath: this.listData.csvDownloadFilePath,
    };
    let fileName = this.appService.fileName
      ? this.appService.fileName
      : this.listData.csvDownloadFilePath.split('/').pop().split('.')[0];
    this.appService.downloadExcel(
      formData,
      'csv',
      environment.COMMON_URL + 'download-file',
      fileName
    );
  }
  public dowloadxlsxPath() {
    this.downloadfile = !this.downloadfile;
    const formData = {
      reportName: 'download-file',
      downloadFilePath: !this.appService?.groupPaceInfo?.reportDrpDwnValSet ? this.listData.downloadFilePath : this.appService?.groupPaceInfo?.reportDownload,
    };
    let fileName = this.appService.fileName
      ? this.appService.fileName
      : this.listData.downloadFilePath.split('/').pop().split('.')[0];
    // this.appService.downloadExcel(formData, '', environment.COMMON_URL + 'download-file',fileName);
    console.log(formData);
    console.log(fileName);
    this.appService.downloadExcel(
      formData,
      'xlsx',
      environment.COMMON_URL + 'download-file',
      fileName
    );
  }
  public cancelFocus() {
    // $('.cls-moreOption').blur();
    $('.cls-moreOption').removeAttr('tabindex');
    this.downloadfile = !this.downloadfile;
    setTimeout(function () {
      this.downloadfile = !this.downloadfile;
      $('.cls-searchData input').focus();
    }, 200);
  }

  // When the pop-up table closes, an event to modify the name change report's output data.
  public nameChangeReportEvent(data: any) {
    this.isNameChangeReport = false;
  }
  public reporttypefocus(event: any) {
    $(event.target).parents('.cls-moreOption').focus();
  }

  /**
   * Description  : Pagination count showing in filter based on pages list count
   * Created Date : 18/09/2023
   * Updated Date : 18/09/2023
   **/
  public paginationCount(customizeData) {
    if (this.appService.groupPaceInfo.reportDrpDwnValSet && !this.appService.groupPaceInfo.reportSaveListEnable) {
      this.listData.default_data = customizeData;
    } else {
      this.listData.list_body = customizeData;
      this.listData.default_data = [];
      let currentPageStartValue: number =
        ((this.listData.currentPage
          ? this.listData.currentPage
          : this.currentPageNumber) -
          1) *
        this.listData?.default_Parms?.itemsPerPage;
      currentPageStartValue =
        this.listData.currentPage || this.currentPageNumber
          ? currentPageStartValue
          : 0;
      let lengthOfData: number =
        this.listData?.default_Parms?.itemsPerPage == 0
          ? customizeData.length
          : currentPageStartValue + this.listData?.default_Parms?.itemsPerPage;
      for (let i = currentPageStartValue; i < lengthOfData; i++)
        if (customizeData[i]) this.listData.default_data.push(customizeData[i]);
      this.appService.displayData = this.listData.default_data.length;
    }
  }

  public onMouseOver(lenght: any, index: any, listIndex: any) {
    if (lenght > 15 && index && listIndex == 0) {
      this.appService.listDisplayHide = true;
    }
  }
  public onMouseOut() {
    this.appService.listDisplayHide = false;
  }

  // Handle tab click for group pace report
  public groupTabClick(tabData: any) {
    this.appService.groupPaceInfo.reportTabEnable = tabData;
    this.ngOnChanges();
    if (tabData == 'booked') {
      $('.cls-depature-tab').removeClass('cls-active');
      $('.cls-booked-tab').addClass('cls-active');
    } else {
      $('.cls-booked-tab').removeClass('cls-active');
      $('.cls-depature-tab').addClass('cls-active');
    }

  }
}
