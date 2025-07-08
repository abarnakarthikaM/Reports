import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from 'src/app/core-module/pipes/translate.pipe';
import { AppService } from 'src/app/core-module/service/app.service';
import { environment } from 'src/environments/environment';
import { LogUserActionsService } from 'src/app/core-module/service/log-user-actions.service';
declare var $: any;
declare var toastr: any;

@Component({
  selector: 'app-save-preview-tab',
  templateUrl: './saveand-preview-tab.component.html',
  styleUrls: ['./saveand-preview-tab.component.scss'],
})
export class SaveandPreviewTabComponent implements OnInit {
  @Input() selectedFields: any;
  @Input() selectedCondition: any;
  @Input() activeModuleData: any;
  @Input() editConditionData: any;
  @Input() savedListFlag: any;

  @Output() redirect = new EventEmitter();

  public conditionDetails: any = {};

  @ViewChildren('form') formDetails: any;

  public fieldsName = [];

  public choosenCondition: any = {};

  public isListShow: boolean = false;

  public isBtnLoader: boolean = false;

  public flagData: boolean = true;

  public hideShowReport: boolean = true;
  public queueShowReportApi: boolean = false;

  public flagSaveReportFlow: boolean = false;
  public inputAlertInfo: any;
  public flagSaveReportModel: boolean = false;
  public listData: any = {};
  public dragAndDrop: boolean = true;
  public queueReportData: any;
  public parentCondtDrpDwn: any;
  public editData: any;
  public editConditionDetails: any = {};

  //Group pace report dropdown val handling variable
  public updatedformData: any;
  //Group pace report initial value set for dropdown
  public dropdownDefaultVal: any = {};
  // public validationValue: boolean = false;
  public allConditionValues: any;
  constructor(
    private translate: TranslatePipe,
    private router: Router,
    public appService: AppService,
    private logUserAction: LogUserActionsService
  ) {}

  ngOnInit(): void {
    this.parentCondtDrpDwn = this.selectedCondition;
    // this.appService.auoCompParentEditVal = this.appService.isEditReport.reportAdditionalInfo.savedReportInfo.chosenConditions;
  }

  ngDoCheck() {
    this.flagSaveReportFlow = this.appService.isEditReport ? true : false;
    if (this.fieldsName.length == 0)
      this.selectedFields.map((data: any) =>
        data.field_details.map((check: any) => {
          if (check.status == 'Y') this.fieldsName.push(check.keys);
        })
      );
    let conditions =
      this.editConditionData && this.editConditionData[0]
        ? this.editConditionData[0]
        : this.selectedCondition;
    this.conditionDetails = conditions.condition_details.filter(
      (data: any) => data.status == 'Y'
    );
    this.editConditionDetails = this.conditionDetails;
    if (
      this.appService.isEditReport &&
      this.appService.groupPaceInfo.reportDrpDwnValSet
    ) {
      switch (this.appService.groupPaceInfo.reportEditVal) {
        case 'bookDate':
          this.editConditionDetails = this.conditionDetails?.filter(
            (item) => item?.name !== 'Departure Year'
          );
          break;
        case 'flightDate':
          this.editConditionDetails = this.conditionDetails?.filter(
            (item) => item?.name !== 'Booked Year'
          );
          break;
        case 'flightReportWithOutBookDate':
          this.editConditionDetails = this.conditionDetails;
          break;
        case 'flightReportWithBookDate':
          this.editConditionDetails = this.conditionDetails;
          break;
      }
      this.editConditionDetails = this.editConditionDetails.filter(
        (data: any) => {
          // Check if all properties in editValue are empty strings
          const editValue = data.editValue;
          if (editValue && typeof editValue === 'object') {
            const allEmpty = Object.values(editValue).every(
              (value) => value === ''
            );
            return !allEmpty;
          }
          return true;
        }
      );
    }
    this.allConditionValues = this.updatedformData
      ? this.updatedformData
      : this.editConditionDetails;
  }

  ngOnChanges() {
    if (!this.appService.viewReports) {
      setTimeout(() => {
        let firstInvalidControl = document.querySelector('#showTableButton');
        if (firstInvalidControl) {
          const rect = firstInvalidControl.getBoundingClientRect();
          window.scrollTo({
            top: rect.top - 130 + window.scrollY, // Use scrollY to get the current scroll position
            behavior: 'smooth', // Add smooth scrolling
          });
        }
      });
    }

    // showTableButton
    // window.scroll({ top: 0, behavior: 'smooth' });
    if (!this.appService.viewReports) {
      setTimeout(() => {
        this.handleShowReport();
      }, 500);
    }

    // this.handleShowReport();
    this.flagSaveReportFlow = this.appService.isEditReport ? true : false;
    if (this.fieldsName.length == 0)
      this.selectedFields.map((data: any) =>
        data.field_details.map((check: any) => {
          if (check.status == 'Y') this.fieldsName.push(check.keys);
        })
      );
    let conditions =
      this.editConditionData && this.editConditionData[0]
        ? this.editConditionData[0]
        : this.selectedCondition;
    this.conditionDetails = conditions.condition_details.filter(
      (data: any) => data.status == 'Y'
    );
    let autoComplete = [];
    this.conditionDetails.map((data: any) => {
      if (data.type == 'autocomplete') {
        data.condition_value.map((conditionData: any) => {
          autoComplete.push({
            name: conditionData.keys,
            status: data.editValue ? 'Y' : 'N',
          });
        });
      }
    });
    this.appService.autoCompletelistName = autoComplete;
    // create report initial val for dropdown and edit page val handling gor gropup pace report
    let groupPaceditVal: any =
      this.appService.isEditReport?.reportAdditionalInfo?.savedReportInfo
        ?.chosenConditions?.reportType;
    if (this.appService.groupPaceInfo.reportDrpDwnValSet) {
      if (!this.appService.isEditReport) {
        this.dropdownDefaultVal = {
          id: 'flightReportWithBookDate',
          value: 'Flight report with book date',
          default: true,
        };
      } else {
        this.appService.groupPaceInfo.reportEditVal = !this.appService
          .groupPaceInfo.reportEditVal
          ? groupPaceditVal
          : this.appService.groupPaceInfo.reportEditVal;
        switch (groupPaceditVal) {
          case 'Book Date':
            this.dropdownDefaultVal = {
              id: 'bookDate',
              value: 'Book Date',
            };
            this.dropdownDefaultVal.default =
              this.appService.groupPaceInfo.reportEditVal == 'Book Date'
                ? true
                : false;
            break;
          case 'Flight Date':
            this.dropdownDefaultVal = {
              id: 'flightDate',
              value: 'Flight Date',
            };
            this.dropdownDefaultVal.default =
              this.appService.groupPaceInfo.reportEditVal == 'Flight Date'
                ? true
                : false;
            break;
          case 'Flight report without book date':
            this.dropdownDefaultVal = {
              id: 'flightReportWithOutBookDate',
              value: 'Flight report without book date',
            };
            this.dropdownDefaultVal.default =
              this.appService.groupPaceInfo.reportEditVal ==
              'Flight report without book date'
                ? true
                : false;
            break;
          case 'Flight report with book date':
            this.dropdownDefaultVal = {
              id: 'flightReportWithBookDate',
              value: 'Flight report with book date',
            };
            this.dropdownDefaultVal.default =
              this.appService.groupPaceInfo.reportEditVal ==
              'Flight report with book date'
                ? true
                : false;
            break;
        }
      }
    }
  }
  // Dropdown value after click we frame the new response for year picker enable and disable.
  public dropdownSelectVal(data: any) {
    if (this.appService.groupPaceInfo.reportDrpDwnValSet) {
      if (data == 'bookDate') {
        this.updatedformData = this.conditionDetails?.filter(
          (item) => item?.name !== 'Departure Year'
        );
        this.dropdownDefaultVal = {
          id: 'bookDate',
          value: 'Book Date',
          default: false,
        };
      } else if (data == 'flightDate') {
        this.updatedformData = this.conditionDetails?.filter(
          (item) => item?.name !== 'Booked Year'
        );
        this.dropdownDefaultVal = {
          id: 'flightDate',
          value: 'Flight Date',
          default: false,
        };
      } else if (data == 'flightReportWithOutBookDate') {
        this.updatedformData = this.conditionDetails;
        this.dropdownDefaultVal = {
          id: 'flightReportWithOutBookDate',
          value: 'Flight report without book date',
          default: false,
        };
      } else if (data == 'flightReportWithBookDate') {
        this.updatedformData = this.conditionDetails;
        this.dropdownDefaultVal = {
          id: 'flightReportWithBookDate',
          value: 'Flight report with book date',
          default: false,
        };
      }
    }
    this.allConditionValues = this.updatedformData
      ? this.updatedformData
      : this.editConditionDetails;
  }
  public suffleValues(data: any) {
    this.fieldsName = data;
  }

  // Following method is triggered when user try to save or update an report
  public createReport(type: string) {
    setTimeout(() => {
      $('.cls-custom-input.cls-defaultIP input').focus();
    }, 800);
    // Following handleSubmit() method is called to validate the choosen condition.
    let valid = this.handleSubmit();

    if (valid) {
      const requestData = {
        chosenConditions: this.choosenCondition,
      };
      this.choosenCondition = this.handleRequestFormat(requestData);
      if (type == 'save') {
        this.queueShowReportApi = false;
        let reportName: string = '';
        if (this.appService.currentBasedOn == 'time-limit-override-report')
          reportName = 'fare-override-report';
        else reportName = this.appService.currentBasedOn;
        this.inputAlertInfo = {
          alertHeader: 'Save report',
          inputLabel: 'Report name',
          buttonData: 'Save',
          apiName: this.queueShowReportApi,
          requestData: {
            reportName: 'save-report',
            reportBasedOn: this.appService.currentBasedOn,
            chosenFields: this.fieldsName,
            chosenConditions: this.choosenCondition,
            cronFormData: {
              reportName: 'get-data-for-fields-conditions-' + reportName,
              reportBasedOn: this.appService.currentBasedOn,
            },
          },
        };
        if (this.appService.autoCompleteValueClick) {
          this.flagSaveReportModel = true;
        } else {
          let errorMsg = this.translate.transform('Enter all mandatory fields');
          toastr.error(errorMsg);
        }
      } else if (type == 'Queued') {
        let reportName: string = '';
        if (this.appService.currentBasedOn == 'time-limit-override-report')
          reportName = 'fare-override-report';
        else reportName = this.appService.currentBasedOn;
        this.inputAlertInfo = {
          alertHeader: 'Queued report',
          inputLabel: 'Queued report name',
          buttonData: 'Save',
          content:
            'Report is too large, Your request will be added in queue report.',
          queueReportName: this.queueReportData.reportSavedAs,
          apiName: this.queueShowReportApi,
          requestData: {
            reportName: 'queued-save-report',
            reportBasedOn: this.appService.currentBasedOn,
            chosenFields: this.fieldsName,
            chosenConditions: this.choosenCondition,
            rowCount: this.queueReportData.rowCount,
            reqMasIdFilePath: this.queueReportData.reqMasIdFilePath,
            cronFormData: {
              reportName: 'get-data-for-fields-conditions-' + reportName,
              reportBasedOn: this.appService.currentBasedOn,
            },
          },
        };
        if (this.appService.autoCompleteValueClick) {
          this.flagSaveReportModel = true;
        } else {
          let errorMsg = this.translate.transform('Enter all mandatory fields');
          toastr.error(errorMsg);
        }
      } else {
        this.appService.menuHide = true;
        let requestData: any = {
          reportName: 'update-saved-report',
          savedReportId: this.appService.isEditReport.savedReportId,
          reportBasedOn: this.appService.currentBasedOn,
          chosenFields: this.fieldsName,
          chosenConditions: this.choosenCondition,
          cronFormData: {
            reportName:
              'get-data-for-fields-conditions-' +
              this.appService.currentBasedOn,
            reportBasedOn: this.appService.currentBasedOn,
          },
        };
        this.appService
          .httpPost(
            requestData,
            '',
            environment.CUSTOME_BACKEND_URL + 'save-reports'
          )
          .subscribe((data) => {
            if (data?.responseCode == 0) {
              setTimeout(() => {
                let successMsg = this.translate.transform(
                  'Report successfully updated'
                );
                toastr.success(successMsg);
                this.appService.isTatReport = false;
                this.appService.createReports = false;
                this.appService.isEditReport = undefined;
                this.appService.showReportData = undefined;
              }, 500);
              //input validation
              // this.inputAlertInfo.emit(alertDetail);
              // $('.cls-err').addClass('d-none');
            }
          });
        // Following set of code is used to update the user action detail when user update the report.
        this.logUserAction.logUserAction(
          requestData,
          environment.CUSTOME_BACKEND_URL + 'add-user-action-log',
          'Custom Report',
          this.activeModuleData.activeMenu,
          'UPDATE',
          'UPDATE_REPORTS',
          'User update the ' + this.activeModuleData.activeMenu + ' report'
        );
      }
    } else {
      // let successMsg = this.translate.transform(
      //   this.validationValue
      //     ? 'Enter All Mandatory Fields'
      //     : 'Enter proper value for ' +
      //         this.appService.childCondition +
      //         ' condition'
      // );
      let successMsg = this.translate.transform('Enter all mandatory fields');
      toastr.error(successMsg);
    }
    // $('.modal-dialog.cls-form').focus();
  }

  public validateConditions() {
    return true;
  }

  // Following method is triggered when user saved an report.
  public handelReportName(responceData: any) {
    // Following handleSubmit() method is called to validate the choosen condition.
    let valid = this.handleSubmit();

    this.flagSaveReportModel = false;

    let requestData = {
      accessToken: sessionStorage.getItem('accessToken'),
      moduleKey: this.activeModuleData.key,
      reportName: responceData.userInput,
      fields: this.fieldsName,
      conditions: this.choosenCondition,
    };

    if (valid && responceData.userAction) {
      this.appService.isTatReport = false;
      let errorMsg = this.appService.queReportSavedList
        ? 'Report successfully Queued'
        : 'Report successfully created';
      toastr.success(errorMsg);
      this.redirect.emit(true);
      this.appService.createReports = false;
    }
    // Following set of code is used to update the user action detail when user save the report.
    this.logUserAction.logUserAction(
      requestData,
      environment.CUSTOME_BACKEND_URL + 'add-user-action-log',
      'Custom Report',
      this.activeModuleData.activeMenu,
      'SAVE',
      'SAVE_REPORTS',
      'User save the ' + this.activeModuleData.activeMenu + ' report'
    );
  }

  // Handle radio button for summary report.
  handleSummaryReport(isValid?: boolean) {
    if (this.choosenCondition.summaryType)
      this.choosenCondition['summaryType'] =
        this.appService.summaryReportInfo.summaryType;
    let count = 0;
    if (!isValid) {
      let conditionKey = Object.keys(this.choosenCondition);
      conditionKey.map((value: any) => {
        if (
          typeof this.choosenCondition[value] == 'string' &&
          this.choosenCondition[value]
        )
          count++;
        else {
          let subCount = 0;
          let subCondition = Object.keys(this.choosenCondition[value]);
          subCondition.map((val: any) => {
            if (this.choosenCondition[value][val]) subCount++;
          });
          if (subCount == subCondition.length) count++;
        }
      });
    }
    console.log(Object.keys(this.choosenCondition));
    return count == Object.keys(this.choosenCondition).length ? true : false;
  }

  // Following method is used get the show report table data from api response and also assign their
  // value to appService variable for further operation.
  handleShowReport() {
    if (this.fieldsName.length == 0)
      this.selectedFields.map((data: any) =>
        data.field_details.map((check: any) => {
          if (check.status == 'Y') this.fieldsName.push(check.keys);
        })
      );
    let requestData = {
      reportName:
        'get-data-for-fields-conditions-' + this.appService.currentBasedOn,
      reportBasedOn: this.appService.currentBasedOn,
      chosenFields: this.fieldsName,
      chosenConditions: this.choosenCondition,
    };

    this.isBtnLoader = true;
    // Following handleSubmit() method is called to validate the choosen condition.
    let valid = this.handleSubmit();
    if (valid && this.appService.autoCompleteValueClick) {
      this.appService.passengerInfo['chosenFields'] = this.fieldsName;
      let formatedRequestData = this.handleRequestFormat(requestData);
      let reportName: string = '';
      if (this.appService.currentBasedOn == 'time-limit-override-report')
        reportName = 'fare-override-report';
      else reportName = this.appService.currentBasedOn;
      let finalRequestData = {
        reportName: 'get-data-for-fields-conditions-' + reportName,
        reportBasedOn: this.appService.currentBasedOn,
        chosenFields: this.fieldsName,
        chosenConditions: formatedRequestData,
      };
      if (
        reportName == 'payment-pending-report' ||
        reportName == 'fare-acceptance-pending-report' ||
        reportName == 'guest-pending-report'
      ) {
        Object.keys(formatedRequestData).map((value) => {
          if (
            typeof formatedRequestData[value] == 'string' &&
            formatedRequestData[value].split(',').length > 1
          ) {
            formatedRequestData[value] = formatedRequestData[value].split(',');
          }
        });
      }
      this.isListShow = true;
      // Following code is used to update the user action for show report action.
      this.logUserAction.logUserAction(
        finalRequestData,
        environment.CUSTOME_BACKEND_URL + 'add-user-action-log',
        'Custom Report',
        this.activeModuleData.activeMenu,
        'VIEW',
        'SHOW_REPORTS',
        'User viewed the ' + this.activeModuleData.activeMenu + ' report'
      );
      this.appService.fileName = undefined;
      // Following api call is made to get the show report table data.
      this.appService
        .httpPost(
          finalRequestData,
          '',
          environment.CUSTOME_BACKEND_URL +
            'get-data-for-fields-conditions-' +
            reportName
        )
        .subscribe((data) => {
          if (data?.response?.data?.queued_details) {
            if (
              data?.response?.data?.queued_details?.length > 0 &&
              data?.response?.data?.queued_details[0]?.status === 'Success'
            ) {
              this.queueReportData = data.response.data.queued_details[0];
              this.queueShowReportApi = true;
              this.isBtnLoader = false;
              this.hideShowReport = false;
              this.createReport('Queued');
            } else if (
              data.response.data.queued_details[0].status === 'Error'
            ) {
              this.isBtnLoader = false;
              toastr.error(
                'Your queued report limit reached please wait for your previous queued report to complete'
              );
            }
          } else {
            this.queueShowReportApi = false;
            if (
              !data?.response?.data?.tatReport &&
              data?.response?.data?.list_body?.length >= 500
            ) {
              data.response.data.list_body = data.response.data.list_body.slice(
                0,
                500
              );
              toastr.error(
                "Only view 500 data's otherwise download CSV or XLSV "
              );
            }
            this.isBtnLoader = false;
            if (data?.responseCode == 0) {
              // Checking whether the response is TAT report or not.
              if (
                this.appService.summaryReportInfo.isSummaryReport &&
                data?.response?.data?.list_body?.length > 0
              )
                this.handleSummaryChart(data?.response?.data?.list_body);
              if (data.response.data?.tatReport) {
                this.appService.isTatReport = true;
              } else {
                this.appService.isTatReport = false;
              }
              if (
                data?.response?.data?.list_body?.length > 0 ||
                data?.response?.data?.tatReport?.length > 0
              ) {
                this.listData = data.response.data;
                this.listData.downloadFilePath =
                  data?.response?.data?.downloadFilePath;
                this.listData.csvDownloadFilePath =
                  data?.response?.data?.csvDownloadFilePath;
                this.appService.showReportData = {};
                this.appService.showReportData['data'] = this.listData;
                this.appService.showReportData['flagData'] = this.flagData;
                this.appService.fileName = data?.response?.data?.file_name;
                this.appService.showReportData['isListShow'] = this.isListShow;
                this.appService.popupReportName =
                  this.listData?.add_on_details?.reportBasedOn;
              }
              // Response handling for the GroupPace Report Show Report
              else if (data?.response?.data?.groupPaceReport) {
                this.appService.groupPaceInfo.reportSaveListEnable = false;
                let position: number = 0;
                this.listData = data?.response?.data;
                if (this.listData?.groupPaceReport.length > 0) {
                  this.listData?.groupPaceReport?.map((tabdata: any) => {
                    if (tabdata?.list_body?.length == 0) {
                      this.appService.groupPaceInfo.reportTabEnableAll = false;
                      if (
                        tabdata?.list_body?.length == 0 &&
                        tabdata?.subTable_header == 'Booked base'
                      ) {
                        this.appService.groupPaceInfo.reportTabEnable =
                          'depature';
                        position = 1;
                      } else {
                        this.appService.groupPaceInfo.reportTabEnable =
                          'booked';
                        position = 0;
                      }
                    }
                  });
                  if (
                    this.listData?.groupPaceReport[0]?.list_body?.length > 0 &&
                    this.listData?.groupPaceReport[1]?.list_body?.length > 0
                  ) {
                    position = 0;
                    this.appService.groupPaceInfo.reportTabEnable = 'booked';
                    this.appService.groupPaceInfo.reportTabEnableAll = true;
                  }
                }
                this.appService.groupPaceInfo.reportTabValChange =
                  this.listData.groupPaceReport;
                this.listData.downloadFilePath =
                  data?.response?.data?.downloadFilePath;
                this.listData.csvDownloadFilePath =
                  data?.response?.data?.csvDownloadFilePath;
                this.appService.showReportData = {};
                this.appService.showReportData['data'] =
                  this.listData?.groupPaceReport.length > 0
                    ? this.listData?.groupPaceReport[position]
                    : this.listData;
                this.appService.groupPaceInfo.reportDownload =
                  this.listData?.downloadFilePath;
                this.appService.showReportData['flagData'] = this.flagData;
                this.appService.fileName = data?.response?.data?.file_name;
                this.appService.showReportData['isListShow'] = this.isListShow;
              } else {
                this.listData = data.response.data;
                this.listData.downloadFilePath =
                  data?.response?.data?.downloadFilePath;
                this.listData.csvDownloadFilePath =
                  data?.response?.data?.csvDownloadFilePath;
                this.appService.showReportData = {};
                this.appService.showReportData['data'] = this.listData;
                this.appService.showReportData['flagData'] = this.flagData;
                this.appService.showReportData['isListShow'] = this.isListShow;
              }
            } else if (data?.responseCode == 0) {
              this.appService.showReportData = undefined;
            }
          }
        });
    } else {
      // let successMsg = this.translate.transform(
      //   this.validationValue
      //     ? 'Enter All Mandatory Fields'
      //     : 'Enter proper value for ' +
      //         this.appService.childCondition +
      //         ' condition'
      // );
      // If choosen condition validation fails means the following warning message is displayed.
      let successMsg = this.translate.transform('Enter all mandatory fields');
      toastr.error(successMsg);
      this.isBtnLoader = false;
    }
  }
  handleSummaryChart(chartData) {
    let chartCount = 0;
    chartData.map((data) => {
      if (Number(data.conversionPercentage.split('%')[0]) > 0) chartCount++;
    });
    this.appService.summaryReportInfo.isChart = chartCount > 0 ? true : false;
  }

  // Following code is used for format the request or payload value for show report request
  handleRequestFormat(requestData: any) {
    console.log(requestData);
    let handleRequestData = requestData.chosenConditions;
    let finalFormat = {};
    for (const key in handleRequestData) {
      if (handleRequestData[key][key]) {
        finalFormat[key] = handleRequestData[key][key];
      } else {
        finalFormat[key] = handleRequestData[key];
      }
    }
    // Radio type default value request framing
    const result = this.selectedCondition?.condition_details?.find(
      (obj) =>
        obj?.name === 'AARP' &&
        obj?.type === 'radiobutton' &&
        obj?.status === 'Y'
    );
    if (result != undefined) finalFormat[result.name] = true;
    //radio button dynamic request framing
    if (
      this.appService.radiobuttonType &&
      this.appService.radiobuttonType.value != 'AARP'
    )
      finalFormat[this.appService.radiobuttonType.keys] =
        this.appService.radiobuttonType.value;
    if (this.appService.summaryReportInfo.isSummaryReport)
      finalFormat['summaryType'] =
        this.appService.summaryReportInfo.summaryType;
    if (finalFormat.hasOwnProperty('tripType'))
      finalFormat['tripType'] = Array.isArray(finalFormat['tripType'])
        ? finalFormat['tripType']
        : finalFormat['tripType'].split(',');
    return finalFormat;
  }

  // Following method is used for validating the choosen condition when user try to save or show the report
  handleSubmit() {
    let arr = [
      'datePickerDetails',
      'dropdownDetails',
      'multiSelectDetails',
      'autoCompleteDetails',
      'autocompleteDropdownDetails',
      'yearPickerDetails',
    ];
    let isValid: boolean = true;
    this.formDetails.toArray().forEach((data: any) => {
      arr.forEach((str) => {
        if (data[str].toArray()[0]) {
          data[str].toArray()[0].submitted = true;
          // validation
          if (data[str].toArray()[0].form.invalid) isValid = false;
          // date format changes
          let result = data[str].toArray()[0]['form']['value'];
          if (str == 'datePickerDetails') {
            let dateFormat = {};
            Object.keys(result).map((data) =>
              Object.assign(dateFormat, {
                [data]: new Date(result[data])
                  .toLocaleString('en-us', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                  .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2'),
              })
            );
            let timeArr = Object.keys(dateFormat);
            let userActionData = !timeArr[1]
              ? dateFormat[timeArr[0]] + ' 23:59:59'
              : undefined;
            dateFormat[timeArr[0]] = dateFormat[timeArr[0]] + ' 00:00:00';
            // dateFormat[timeArr[1]] = dateFormat[timeArr[1]] + ' 23:59:59';
            if (timeArr[1]) {
              dateFormat[timeArr[1]] = dateFormat[timeArr[1]] + ' 23:59:59';
            } else if (
              !this.appService.isFieldData &&
              !timeArr[1] &&
              timeArr[0] == 'actionFrom'
            ) {
              dateFormat['actionTo'] = userActionData;
            }
            result = dateFormat;
          }
          if (
            this.appService.childCondition == data['items']['keys'] &&
            data['items']['keys'] == 'groupType'
          ) {
            let resultData = {
              [data['items']['keys']]: this.appService.groupDataValue,
            };
            Object.assign(this.choosenCondition, {
              [data['items']['keys']]: resultData,
            });
          } else
            Object.assign(this.choosenCondition, {
              [data['items']['keys']]: result,
            });
        }
      });
    });
    if (
      this.appService.summaryReportInfo.isSummaryReport &&
      this.appService.summaryReportInfo.isChildReportEnable
    ) {
      isValid = this.appService.summaryReportInfo.isValidChildCondition
        ? true
        : false;
    }
    if (
      isValid &&
      this.appService.childConditionInfo.type &&
      this.choosenCondition[this.appService.childCondition]
    ) {
      this.choosenCondition[this.appService.childCondition][
        this.appService.childCondition
      ] = this.appService.childConditionInfo.selectedInfo;
      // Parent child dropdown subCategory value set.
      if (this.appService.auoCompParentEditEnable) {
        this.parentCondtDrpDwn = this.parentCondtDrpDwn?.condition_details
          ? this.parentCondtDrpDwn?.condition_details
          : this.parentCondtDrpDwn[0]?.condition_details;
        this.parentCondtDrpDwn?.map((condt: any) => {
          if (condt.status == 'Y' && condt.type == 'dropdown') {
            if (condt.editValue) {
              if (this.appService.auoCompSubCategory) {
                if (condt.keys == 'subCategory')
                  this.choosenCondition.subCategory = Number(condt.editValue);
              }
              if (condt.keys == 'groupType')
                this.choosenCondition.groupType = Number(condt.editValue);
            }
          }
        });
      }
      let condition = Object.keys(this.choosenCondition);
      let count = 0;
      condition.map((value: any) => {
        let subCondition = Object.keys(this.choosenCondition[value]);
        if (subCondition.length == 1)
          if (
            this.choosenCondition[value][value] == undefined ||
            this.choosenCondition[value][value] == ''
          )
            count++;
          else {
            let countSubCond = 0;
            subCondition.map((subCond) => {
              if (
                this.choosenCondition[value][subCond] == undefined ||
                this.choosenCondition[value][subCond] == '' ||
                this.choosenCondition[value][subCond] ==
                  'Invalid Date 00:00:00' ||
                this.choosenCondition[value][subCond] == 'Invalid Date 23:59:59'
              )
                countSubCond++;
            });
            if (countSubCond > 0) count++;
          }
      });
      isValid = count > 0 ? false : true;
    }

    // this.validationValue =
    //   this.appService.childCondition == undefined
    //     ? true
    //     : this.appService.groupDataValue != undefined
    //     ? true
    //     : false;
    // return this.validationValue ? isValid : false;
    return isValid;
  }
  public toggleFields() {
    this.dragAndDrop = !this.dragAndDrop;
  }
}
