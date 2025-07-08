import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ConfigService } from './config.service';
declare let CryptoJS: any;
declare let $: any;
@Injectable({
  providedIn: 'root',
})
export class AppService {
  public createReports: boolean = true;
  public viewReports: boolean = true;
  public isEditReport: any = undefined;
  public showReportData: any = undefined;
  public selectedMenu: any = '';
  public currentBasedOn: any = '';
  public passengerInfo: any = {};
  public isFieldData: boolean;
  public mandatoryField: string[] = [];
  public mandatoryCondition: string[] = [];
  public dataForUserType: any;
  public isUserTypeCondition: boolean = false;
  public isTatNoReport: boolean = false;
  public groupDataValue: number | string = '';
  public parentCondition: string | undefined = '';
  public childCondition: string | undefined = undefined;
  public totalSavedRecords: any | undefined = undefined;
  public displayData: any | undefined = undefined;
  public isTatReport: boolean = false;
  public fileName: string | undefined = undefined;
  public menuClick: boolean = false;
  public menuHide: boolean = true;
  public autoCompleteSearch: boolean = true;
  public selectedMenuId: number | string = undefined;
  public selectedMenuName: string = undefined;
  public queueReportEnable: boolean = false;
  public queReportSavedList: boolean = false;
  public listDisplayHide: boolean = false;
  public queReportSideMenuList: boolean = false;
  public autoCompleteValueClick: boolean = true;
  public autoCompletelistName: any = [];
  public radiobuttonType: any;
  public responseErrorMsg: any;
  public queueReportData: any;
  public autoCompleteReqVal: boolean = true;
  public auoCompParentEditVal: any;
  public auoCompParentEditEnable: boolean = true;
  public auoCompSubCategory: any;
  public autoCompSummaryDrpDwn: boolean = false;
  public isDateFieldMandatory: boolean = false;
  // Gropup Pace Report service variables
  public groupPaceInfo: any = {
    reportDrpDwnValSet: false,
    reportEditVal: undefined,
    reportTabEnable: undefined,
    reportTabValChange: undefined,
    reportTabEnableAll: undefined,
    reportDownload: undefined,
    reportSaveListEnable: true,
  };
  // Dashboard Mobile Header
  public chartHeaderTittleMb: any = {
    color: 'var(--TXTBLACK)',
    fontSize: '9px',
    fontWeight: 600,
    fontFamily: 'var(--PRIMARYREGULARFONT)',
  };
  public chartHeaderTittleDf: any = {
    color: 'var(--TXTBLACK)',
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: 'var(--PRIMARYREGULARFONT)',
  };

  public summaryReportInfo: any = {
    isSummaryReport: false,
    summaryType: undefined,
    isChart: false,
    isdropDown: false,
    isValidChildCondition: false,
    isChildReportEnable: false,
  };

  //Custom report dashboard and pipeline chart download
  public chartDownloadOption = [
    {
      id: 'svg',
      value: 'Download SVG',
    },
    {
      id: 'png',
      value: 'Download PNG',
    },
    {
      id: 'csv',
      value: 'Download CSV',
    },
  ];
  public popupReportName: string | undefined = undefined;
  public savedReportListData: any | undefined = undefined;
  public parentQuery: string | undefined = undefined;
  public childConditionInfo: any = {
    selectedInfo: undefined,
    count: 0,
    type: false,
  };
  public dayList = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  public timeList = [
    '01:00',
    '01:30',
    '02:00',
    '02:30',
    '03:00',
    '03:30',
    '04:00',
    '04:30',
    '05:00',
    '05:30',
    '06:00',
    '06:30',
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
    '23:30',
    '00:00',
    '00:30',
  ];

  public updateValue: any;
  public primaryColor: any;
  public secondaryColor: any;

  expandList(id: number, listData: any) {
    throw new Error('Method not implemented.');
  }
  // To modify a displaying option, such as 5, 50, 100 and full data in list component, use the following method.
  public listService(list: any, pagination: boolean = true) {
    list['currentPage'] =
      list['currentPage'] == undefined ? 1 : list['currentPage'];

    list['list_body'] = list['list_body'] != null ? list['list_body'] : [];

    list['totalItems'] = list['list_body'].length;

    list['default_Parms']['page'] =
      list['default_Parms']['page'] == 0 ? 1 : list['default_Parms']['page'];

    list['noofPages'] = Math.ceil(
      list['list_body'].length / list['default_Parms']['itemsPerPage']
    );

    list['currentPage'] =
      list['currentPage'] > list['noofPages']
        ? list['noofPages']
        : list['currentPage'];

    list['default_Parms']['page'] =
      list['default_Parms']['page'] > list['noofPages']
        ? list['noofPages']
        : list['default_Parms']['page'];

    if (
      pagination == true &&
      list['list_body'].length > list['default_Parms']['itemsPerPage']
    )
      list['default_data'] = list['list_body'].slice(
        (list['default_Parms']['page'] - 1) *
        list['default_Parms']['itemsPerPage'],
        list['default_Parms']['page'] * list['default_Parms']['itemsPerPage']
      );
    else list['default_data'] = list['list_body'];
    return list;
  }
  chartModules: object = {
    request_trend_year: 'request-trend',
    request_trend_comparision: 'request-trend-comparison',
    revenue_analysis: 'revenue-analysis',
    pipeline_departure: 'pipeline-departure',
  };
  /**
   * Author: Mohanraj K
   * Des:Type Validation
   * Paramters(event, type )
   * type = strVal, numberVal
   */
  public inpVal(event: any, type: string) {
    const numbersonly = /[0-9\-\ ]/;
    const strOnly = /^[A-Za-z ]+$/;
    const string = /^[A-Za-z]+$/;
    const inputs = /^[a-zA-Z0-9,. ]*$/;
    const idproof = /^[a-zA-Z0-9]*$/;
    const alphaNumeric = /^[A-Za-z0-9 ]*$/;
    const specialChar = /^[A-Za-z0-9-_ ]+$/;
    const sector = /^[a-zA-Z-,]+$/;
    const decimal = /[0-9\-\ .]/;
    if (event.code == 'Space' && event.target.value.length < 1) {
      event.preventDefault();
    }
    /**String Validation */
    switch (type) {
      case 'strVal':
        let inputChar1 = String.fromCharCode(event.charCode);
        if (!strOnly.test(inputChar1)) {
          event.preventDefault();
        }
        break;
      case 'numbersonly':
        let inputChar2 = String.fromCharCode(event.charCode);
        if (!numbersonly.test(inputChar2)) {
          event.preventDefault();
        } else {
          if (inputChar2 == '-' || inputChar2 == ' ') {
            event.preventDefault();
          } else {
            return;
          }
        }
        break;
      case 'decimal':
        let decimalChar = String.fromCharCode(event.charCode);
        if (!decimal.test(decimalChar)) {
          event.preventDefault();
        } else {
          if (decimalChar == '-' || decimalChar == ' ') {
            event.preventDefault();
          } else {
            return;
          }
        }
        break;

      case 'inputs':
        let inputChar3 = String.fromCharCode(event.charCode);
        if (!inputs.test(inputChar3)) {
          event.preventDefault();
        }
        break;
      case 'idproof':
        let inputChar4 = String.fromCharCode(event.charCode);
        if (!idproof.test(inputChar4)) {
          event.preventDefault();
        }
        break;
      case 'alphaNumeric':
        let inputChar5 = String.fromCharCode(event.charCode);
        if (!alphaNumeric.test(inputChar5)) {
          event.preventDefault();
        }
        break;
      case 'string':
        let inputChar6 = String.fromCharCode(event.charCode);
        if (!string.test(inputChar6)) {
          event.preventDefault();
        }
        break;
      case 'emailValidation':
        /** email doesn't want space so prevent it */
        if (event.code == 'Space') {
          event.preventDefault();
        }
        break;
      case 'specialChar':
        let inputChar7 = String.fromCharCode(event.charCode);
        if (!specialChar.test(inputChar7)) {
          event.preventDefault();
        }
        break;
      case 'sector':
        let inputChar8 = String.fromCharCode(event.charCode);
        if (!sector.test(inputChar8)) {
          event.preventDefault();
        }
        break;
      case 'strValue':
        event.target.value = event.target.value.replace(
          /[0-9@_=!^`&\/\\#,+()$%.'":*?<>{};[\]\|\-]/g,
          ''
        );
        break;
      case 'numbers':
        //let inputChar10 = String.fromCharCode(event.key.charCodeAt(0));
        //if (event.keyCode != 8 && !numbersonly.test(inputChar10)) {
        //event.preventDefault();
        //} else {
        //if (inputChar2 == '-' || inputChar2 == ' ') {
        //event.preventDefault();
        //} else {
        //return;
        //}
        //}
        event.target.value = event.target.value.replace(/[^0-9]+/, '');
        break;
      default:
        return;
    }
  }

  expandAll: any;

  constructor(private http: HttpClient, private configService: ConfigService) { }
  // tslint:disable-next-line: no-any
  public httpPost(
    inputData: any,
    actionName: string,
    url: any
  ): Observable<any> {
    // AES encryption
    // tslint:disable-next-line:max-line-length
    const data: string = CryptoJS.AES.encrypt(
      JSON.stringify(inputData),
      CryptoJS.enc.Base64.parse(this?.configService?.get('en')),
      { mode: CryptoJS.mode.ECB }
    ).toString();
    const formData = new FormData();
    formData.append('data', data);
    const backEndURL = url;
    if (actionName == 'get' || actionName == 'GET') {
      return this.http.get(backEndURL).pipe((data) => {
        let responseData: any = {};
        responseData = data;
        return responseData;
      });
    } else {
      return this.http
        .post(backEndURL, formData, {
          observe: 'response',
          responseType: 'text',
          // tslint:disable-next-line:no-shadowed-variable
        })
        .pipe(
          map((data) => {
            let responseData: any = {};
            let response: any;
            if (typeof data.body == 'string') {
              response = JSON.parse(
                CryptoJS.AES.decrypt(
                  data.body.replace(/^"(.*)"$/, '$1'),
                  CryptoJS.enc.Base64.parse(this?.configService?.get('de')),
                  { mode: CryptoJS.mode.ECB }
                ).toString(CryptoJS.enc.Utf8)
              );
            } else {
              response = data.body;
            }
            responseData = response;
            responseData.status = data.status;
            return responseData;
          })
        );
    }
  }
  /**
   * Expand all list row
   * @param listData
   */
  public expandContainerAll(listData: any) {
    if (this.expandAll.length == 0) {
      for (let i = 0; i < listData['default_data'].length; i++) {
        let flag: boolean = $('#expandContainer' + i).hasClass('d-none')
          ? true
          : false;
        this.expandAll.push(flag);
      }
    }
    if (this.expandAll.indexOf(false) == -1) {
      for (let i = 0; i < listData['default_data'].length; i++) {
        this.expandAll[i] = false;
        $('#expandclose' + i)
          .removeClass('icon-71-infoup')
          .addClass('icon-72-infodown');
      }
      $('.cls-sublist').removeClass('d-none').addClass('d-flex');

      listData.default_Parms.expand = true;
    } else {
      $('.cls-sublist').removeClass('d-flex').addClass('d-none');
      for (let i = 0; i < listData['default_data'].length; i++) {
        this.expandAll[i] = true;
        listData.default_Parms.expand = false;
        $('#expandclose' + i)
          .removeClass('icon-72-infodown')
          .addClass('icon-71-infoup');
      }
    }
  }

  public dashboardService(
    moduleName: string,
    inputData: any,
    actionName: string
  ): Observable<any> {
    // AES encryption
    const data: string = CryptoJS.AES.encrypt(
      JSON.stringify(inputData),
      CryptoJS.enc.Base64.parse(this?.configService?.get('en')),
      { mode: CryptoJS.mode.ECB }
    ).toString();
    const formData = new FormData();
    formData.append('data', data);
    let backEndURL =
      environment.BACKEND_URL + '' + this.chartModules[moduleName];
    return this.http
      .post(backEndURL, formData, {
        observe: 'response',
        responseType: 'text',
      })
      .pipe(
        map((data) => {
          let responseData: any = {};
          let response: any;
          if (typeof data.body == 'string') {
            response = JSON.parse(
              CryptoJS.AES.decrypt(
                data.body.replace(/^"(.*)"$/, '$1'),
                CryptoJS.enc.Base64.parse(this?.configService?.get('de')),
                { mode: CryptoJS.mode.ECB }
              ).toString(CryptoJS.enc.Utf8)
            );
          } else {
            response = data.body;
          }
          responseData = response;
          responseData.status = data.status;
          return responseData;
        })
      );
  }

  // download service
  public downloadExcel(
    inputData: any,
    actionName: string,
    url: any,
    fileName: string
  ): any {
    // AES encryption
    // tslint:disable-next-line:max-line-length
    const data: string = CryptoJS.AES.encrypt(
      JSON.stringify(inputData),
      CryptoJS.enc.Base64.parse(this?.configService?.get('en')),
      { mode: CryptoJS.mode.ECB }
    ).toString();
    const formData = new FormData();
    formData.append('data', data);
    this.http
      .post(url, formData, { responseType: 'blob' })
      .subscribe((response: Blob) => {
        saveAs(response, fileName + '.' + actionName);
      });
  }
  public summaryReport() {
    this.summaryReportInfo.isSummaryReport = sessionStorage.summaryRoute
      ? true
      : false;
    this.summaryReportInfo.isValidChildCondition = this.summaryReportInfo
      .isSummaryReport
      ? true
      : false;
  }
  public initAuth() {
    // Request history page iframe url getting
    this.parentQuery = window.location.href;
    return this.httpPost(
      {
        reportName: 'init-auth',
        // requestUrl: window.location.href,
        requestUrl:
          'https://report-dev6e.infinitisoftware.net/59b4ba060b7339b26b7589c2c37ae49e/#udspMyA+BSzlCPD6A0UWCxPYdUcYa6aR5QT8LW3h9ibx7Ym9pi4KaqcGbxdNSRZ7kMfH0vcgIepuQwV5QhubuGQm/USWDvTIip8NLewkbklDSq6MfpXg6SJ+mzcBdgRE3eH7Ro56y6jO/avgDNi64g==',
      },
      '',
      environment.COMMON_URL + 'init-auth'
    ).toPromise();
  }

  public getSubModules(requestData: any) {
    return this.httpPost(
      requestData,
      'POST',
      environment.ROOT_BACKEND_URL + 'conversion-report/get-all-report-types'
    );
  }

  public getDropDownData(requestData: any, url: string) {
    return this.httpPost(requestData, 'POST', environment.COMMON_URL + url);
  }

  public handelShowReport(requestData: any, url: string) {
    return this.httpPost(
      requestData,
      'POST',
      environment.ROOT_BACKEND_URL + 'conversion-report/' + url
    );
  }
  // user Action Log
  public viewUserActionLog(requestData: any) {
    return this.httpPost(
      requestData,
      'POST',
      'https://report-development.infinitisoftware.net/reports/custom-report/add-user-action-log'
    );
  }
  // Conversion Report
  public getAllFieldsConversion(requestData: any) {
    return this.httpPost(
      requestData,
      'POST',
      environment.ROOT_BACKEND_URL +
      'conversion-report/get-all-fields-conditions'
    );
  }
  public handelSaveReportConversion(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.ROOT_BACKEND_URL + 'conversion-report/save-reports'
    );
  }
  public getSavedReports(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.ROOT_BACKEND_URL + 'custom-report/get-saved-reports'
    );
  }
  // Schedule Report
  public scheduleSavedReports(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.ROOT_BACKEND_URL + 'conversion-report/schedule-saved-reports'
    );
  }

  public getScheduleDropdownData(requestData: any, url: string) {
    return this.httpPost(requestData, 'POST', environment.COMMON_URL + url);
  }
  public getTravelAgency(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.COMMON_URL + 'get-travel-agency-possible-values'
    );
  }
  public getUserType(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.COMMON_URL + 'get-user-type-values'
    );
  }
  public getCountryVal(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.COMMON_URL + requestData.reportName
    );
  }
  public getSectorVal(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.COMMON_URL + 'get-sector-possible-values'
    );
  }
  public getSectorPosVal(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.COMMON_URL + 'get-sector-possible-values'
    );
  }
  public getposVal(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.COMMON_URL + 'get-pos-possible-values'
    );
  }
  public getStatusRequest(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.COMMON_URL + 'get-status-of-request-values'
    );
  }
  public getStatusRequestVal(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.COMMON_URL + 'get-status-of-request-values'
    );
  }
  public getCurrencyValues(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.COMMON_URL + 'get-currency-possible-values'
    );
  }
  public getGroupCategoryVal(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.COMMON_URL + 'get-group-category-values'
    );
  }
  public getScheduleSavedReportMessage(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.CUSTOME_BACKEND_URL + 'schedule-saved-reports'
    );
  }
  public getDataHistoryDetails(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.REQUEST_URL + 'getDataforhistorydetails'
    );
  }
  public getDeleteReports(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.CUSTOME_BACKEND_URL + 'save-reports'
    );
  }
  public getSavedReportDelete(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.ROOT_BACKEND_URL + 'custom-report/save-reports'
    );
  }
  public handleAllReporttype(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.CUSTOME_BACKEND_URL + 'get-all-report-types'
    );
  }
  public getSavedReportDetails(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.CUSTOME_BACKEND_URL + 'get-saved-reports'
    );
  }
  // CustomReport
  public getAllReportsType(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.CUSTOME_BACKEND_URL + 'get-all-report-types'
    );
  }
  public dummyResponse(requestData: any) {
    var data = this.http.get(requestData);
    return data;
  }
  public getAllFieldConditions(requestData: any, selectMenu) {
    return this.httpPost(
      requestData,
      'get',
      environment.CUSTOME_BACKEND_URL +
      'get-all-fields-conditions/' +
      selectMenu
    );
  }
  public getMenuResponse(requestData: any) {
    let requestUrl: string = sessionStorage.menu
      ? 'menu?menu=' + sessionStorage.menu
      : 'menu';
    return this.httpPost(
      requestData,
      'get',
      environment.CUSTOME_BACKEND_URL + requestUrl
    );
  }
  public savedReportCreation(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.CUSTOME_BACKEND_URL + 'save-reports'
    );
  }
  public savedReportupdate(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.CUSTOME_BACKEND_URL + 'save-reports'
    );
  }
  public savedReportDelete(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.CUSTOME_BACKEND_URL + 'save-reports'
    );
  }
  public savedReportDeleteReqData(requestData: any) {
    return this.httpPost(
      requestData,
      '',
      environment.ROOT_BACKEND_URL + 'custom-report/save-reports'
    );
  }
  public reportUserNameType(requestData: any, reportName: any) {
    return this.httpPost(requestData, '', environment.COMMON_URL + reportName);
  }
  public statusRequestService(requestData: any, reportName: any) {
    return this.httpPost(requestData, '', environment.COMMON_URL + reportName);
  }
  public getDataFieldCondition(requestData: any, reportName: any) {
    return this.httpPost(
      requestData,
      '',
      environment.CUSTOME_BACKEND_URL +
      'get-data-for-fields-conditions' +
      '-' +
      reportName
    );
  }

  // Auto Complete
  public autoCompleteData(requestData: any, reportName: any) {
    // return this.httpPost(requestData, '', environment.COMMON_URL + reportName);
    let url = environment.COMMON_URL + reportName;
    return this.httpPost(requestData, '', url);
  }
  // UserAction
  // public userActionDropDown(requestData: any) {
  //   return this.httpPost(
  //     requestData,
  //     'POST',
  //     'https://dev-b2bwallet.infinitisoftware.net/user-action/' +
  //       'drop-down-user-action-log'
  //   );
  // }
  public userActionLog(requestData: any, url: string) {
    return this.httpPost(requestData, '', url);
  }

  // Dashboard
  public revenueAnalysisRequest(requestData: any) {
    return this.dashboardService('revenue_analysis', requestData, '');
  }
  public trendYearRequest(requestData: any) {
    return this.dashboardService('request_trend_year', requestData, '');
  }
  public trendYearRequestComparision(requestData: any) {
    return this.dashboardService('request_trend_comparision', requestData, '');
  }
  // pipeline
  public pipelineDepartureRequest(requestData: any) {
    return this.dashboardService('pipeline_departure', requestData, '');
  }

  // Dynamic Report
  public authenticationAndAuthorization(requestData: any) {
    return this.httpPost(
      requestData,
      'POST',
      environment.ROOT_BACKEND_URL + 'common/authenticate'
    );
  }

  public getReportKeyData(requestData: any) {
    return this.httpPost(
      requestData,
      'GET',
      environment.ROOT_BACKEND_URL + 'common/routing'
    );
  }
  public getSubModuleData(requestData: any) {
    return this.httpPost(
      requestData,
      'GET',
      environment.ROOT_BACKEND_URL + 'common/menu'
    );
  }
  public getSavedReportData() {
    return this.dummyResponse('/assets/listJSON/savedReport.json');
  }
  public getAllFieldsConditions(requestData: any) {
    return this.httpPost(
      requestData,
      'GET',
      environment.ROOT_BACKEND_URL + 'common/get-all-fields-conditions'
    );
  }
  public getMultiSelectOption(requestData: any, responseDetail: string) {
    // return this.httpPost(
    //   requestData,
    //   'GET',
    //   environment.ROOT_BACKEND_URL + responseDetail
    // );
    return this.httpPost(
      requestData,
      '',
      environment.COMMON_URL + responseDetail
    );
  }

  // Method to apply the date format
  public changeDateFormat(date: string, time: string) {
    let months = [];
    for (let i = 1; i < 13; i++)
      months.push(i < 10 ? '0' + JSON.stringify(i) : JSON.stringify(i));
    let d = new Date(date);
    let final =
      d.getFullYear() +
      '-' +
      months[d.getMonth()] +
      '-' +
      d.getDate().toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      ' ' +
      time;

    return final;
  }
}
