import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatepickerService } from '../../../../core-module/service/datepicker.service';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AppService } from '../../../../core-module/service/app.service';
import { environment } from '../../../../../environments/environment';
import { LocationService } from '../../../../core-module/service/autocomplete.service';
import { urlConfig } from '../../../../core-module/config/url';
import { TranslatePipe } from '../../../../core-module/pipes/translate.pipe';
import { LogUserActionsService } from 'src/app/core-module/service/log-user-actions.service';
declare var $: any;
declare var toastr: any;
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  providers: [TranslatePipe],
})
export class ScheduleComponent implements OnInit {
  /**
   * Desc: submitted
   */
  public submitted: boolean = false;
  /**
   * days list
   */
  public daysList: Array<any> = [];
  /**
   * email array
   */
  public emailArray: Array<any> = [];
  /**
   * day list array
   */
  public daysListArray: Array<any> = [];
  /**
   *  array for days
   */
  public finalDays: Array<any> = [];
  /**
   * time list
   */
  public timeList: Array<any> = [];
  /**
   * edit data
   */
  public editData: any;
  /**
   * roll for next
   */
  public rollForData: Array<any> = [];
  /**
   * roll for next date array
   */
  public rollForDateArray: Array<any> = [];
  /**
   * roll final date
   */
  public finalRollDate: Array<any> = [];
  /**
   * saved report response data
   */
  public savedReportDataResponse: any = [];
  /**
   * scheduled data
   */
  public scheduleData: any = [];
  /**
   * tab menu
   */
  public menu: Array<any> = [];
  private airlineCode = sessionStorage.getItem('themeCode');

  public addDate: any;
  public minDate: any = '';
  public maxDate: any = '';
  public frequencyCheckbox: boolean = false;

  constructor(
    private router: Router,
    private datepickerService: DatepickerService,
    private fb: FormBuilder,
    public datepipe: DatePipe,
    public appService: AppService,
    private autocompleteCity: LocationService,
    private translate: TranslatePipe,
    private logUserAction: LogUserActionsService
  ) {}
  /**
   * sehedule Form
   */
  public scheduleForm: FormGroup = this.fb.group({
    time: new FormControl('', Validators.required),
    fromDate: new FormControl('', Validators.required),
    toDate: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/),
    ]),
  });
  async ngOnInit(): Promise<void> {
    this.daysList = [
      {
        name: 'Sunday',
        id: '0',
        status: 'N',
      },
      {
        name: 'Monday',
        id: '1',
        status: 'N',
      },
      {
        name: 'Tuesday',
        id: '2',
        status: 'N',
      },
      {
        name: 'Wednesday',
        id: '3',
        status: 'N',
      },
      {
        name: 'Thursday',
        id: '4',
        status: 'N',
      },
      {
        name: 'Friday',
        id: '5',
        status: 'N',
      },
      {
        name: 'Saturday',
        id: '6',
        status: 'N',
      },
    ];
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
    this.timeList = [
      {
        name: '01:00',
      },
      {
        name: '01:30',
      },
      {
        name: '02:00',
      },
      {
        name: '02:30',
      },
      {
        name: '03:00',
      },
      {
        name: '03:30',
      },
      {
        name: '04:00',
      },
      {
        name: '04:30',
      },
      {
        name: '05:00',
      },
      {
        name: '05:30',
      },
      {
        name: '06:00',
      },
      {
        name: '06:30',
      },
      {
        name: '07:00',
      },
      {
        name: '07:30',
      },
      {
        name: '08:00',
      },
      {
        name: '08:30',
      },
      {
        name: '09:00',
      },
      {
        name: '09:30',
      },
      {
        name: '10:00',
      },
      {
        name: '10:30',
      },
      {
        name: '11:00',
      },
      {
        name: '11:30',
      },
      {
        name: '12:00',
      },
      {
        name: '12:30',
      },
      {
        name: '13:00',
      },
      {
        name: '13:30',
      },
      {
        name: '14:00',
      },
      {
        name: '14:30',
      },
      {
        name: '15:00',
      },
      {
        name: '15:30',
      },
      {
        name: '16:00',
      },
      {
        name: '16:30',
      },
      {
        name: '17:00',
      },
      {
        name: '17:30',
      },
      {
        name: '18:00',
      },
      {
        name: '18:30',
      },
      {
        name: '19:00',
      },
      {
        name: '19:30',
      },
      {
        name: '20:00',
      },
      {
        name: '20:30',
      },
      {
        name: '21:00',
      },
      {
        name: '21:30',
      },
      {
        name: '22:00',
      },
      {
        name: '22:30',
      },
      {
        name: '23:00',
      },
      {
        name: '23:30',
      },
      {
        name: '00:00',
      },
      {
        name: '00:30',
      },
    ];
    $(document).ready(function () {
      $('select').formSelect();
    });
    this.editData = history.state;
    this.scheduleData =
      this.appService.isEditReport.reportAdditionalInfo.savedReportInfo.chosenConditions;
    // Group pace report schedule page empty year picker removing
    Object.entries(this.scheduleData).forEach(([key, value]: any) => {
      if (
        (key == 'bookedYear' &&
          value.bookedYearFrom == '' &&
          value.bookedYearTo == '') ||
        (key == 'departureYear' &&
          value.departureYearFrom == '' &&
          value.departureYearTo == '')
      ) {
        delete this.scheduleData[key];
      }
    });
    if (this.scheduleData.reportType) {
      this.scheduleData.reportType =
        this.scheduleData.reportType == 'flightReportWithBookDate'
          ? 'Flight report with book date'
          : this.scheduleData.reportType == 'bookDate'
          ? 'Book Date'
          : this.scheduleData.reportType == 'flightDate'
          ? 'Flight Date'
          : this.scheduleData.reportType == 'flightReportWithOutBookDate'
          ? 'Flight report without book date'
          : this.scheduleData.reportType;
    }
    for (const [key, value] of Object.entries(this.scheduleData)) {
      this.rollForData.push({ key, value, status: 'N' });
    }
    this.rollForData.map(async (data: any) => {
      switch (data.key) {
        case 'customerType':
        case 'flightNumber':
        case 'tcCount':
          data.value = data.value;
          break;
        case 'flightStatus':
          const flightStatusValue: any = {
            flightStatusId: 'HK',
            reportBasedOn: this.appService.selectedMenu + '-flightStatus',
            reportName: 'get-flight-status-values',
          };
          var resData = await this.appService
            .getCountryVal(flightStatusValue)
            .toPromise();
          resData.response.data.listData.map((val: any) => {
            if (data.value == val.id) {
              data.value = val.value;
            }
          });
          break;
        case 'userType':
          const userTypeValue: any = {
            userTypeId: data.value,
            reportBasedOn: this.appService.selectedMenu + '-userType',
            reportName: 'get-user-type-values',
          };
          var resData = await this.appService
            .getCountryVal(userTypeValue)
            .toPromise();
          resData.response.data.listData.map((val: any) => {
            if (data.value == val.id) {
              data.value = val.value;
            }
          });
          break;
        case 'emailVerificationStatus':
          const emailVerificationStatus: any = {
            userTypeId: data.value,
            reportBasedOn:
              this.appService.selectedMenu + '-emailVerificationStatus',
            reportName: 'get-access-status-values',
          };
          var resData = await this.appService
            .getCountryVal(emailVerificationStatus)
            .toPromise();
          resData.response.data.listData.map((val: any) => {
            if (data.value == val.id) {
              data.value = val.value;
            }
          });
          break;
        case 'agencyAccessStatus':
          const agencyAccessStatus: any = {
            userTypeId: data.value,
            reportBasedOn: this.appService.selectedMenu + '-agencyAccessStatus',
            reportName: 'get-access-status-values',
          };
          var resData = await this.appService
            .getCountryVal(agencyAccessStatus)
            .toPromise();
          resData.response.data.listData.map((val: any) => {
            if (data.value == val.id) {
              data.value = val.value;
            }
          });
          break;
        case 'userAccessStatus':
          const userAccessStatus: any = {
            userTypeId: data.value,
            reportBasedOn: this.appService.selectedMenu + '-userAccessStatus',
            reportName: 'get-access-status-values',
          };
          var resData = await this.appService
            .getCountryVal(userAccessStatus)
            .toPromise();
          resData.response.data.listData.map((val: any) => {
            if (data.value == val.id) {
              data.value = val.value;
            }
          });
          break;
        case 'groupType':
          const groupType: any = {
            userTypeId: data.value,
            reportBasedOn: this.appService.selectedMenu + '-groupType',
            reportName: 'get-group-type-values',
          };
          var resData = await this.appService
            .getCountryVal(groupType)
            .toPromise();
          resData.response.data.listData.map((val: any) => {
            if (data.value == val.id) {
              data.value = val.value;
            }
          });
          break;
        case 'resolvedBy':
        case 'agencyEmailId':
        case 'issueId':
          data.value = data.value;
          break;
        case 'agentEmailId':
          data.value = data.value;
          break;
        case 'requestProcessedBy':
          data.value = data.value;
          break;
        case 'travelAgency':
          const travelAgencyVal: any = {
            agencyNameExact: data.value,
            reportBasedOn: this.appService.selectedMenu + '-travelAgency',
            reportName: 'get-travel-agency-possible-values',
          };

          var resData = await this.appService
            .getTravelAgency(travelAgencyVal)
            .toPromise();
          resData.response.data.listData.map((val: any) => {
            if (data.value === val.id) {
              data.value = val.id;
            }
          });

          break;
        case 'userType':
          const userTypeVal: any = {
            userTypeId: data.value,
            reportBasedOn: this.appService.selectedMenu + '-userType',
            reportName: 'get-user-type-values',
          };
          var resData = await this.appService
            .getUserType(userTypeVal)
            .toPromise();
          resData.responseData.userTypeList.map((val: any) => {
            if (data.value == val.userTypeId) {
              data.value = val.userType;
            }
          });
          break;
        case 'subCategory':
          const subCategoryVal: any = {
            subCategory: data.value,
            reportBasedOn: this.appService.selectedMenu + '-subCategory',
            reportName: 'get-issue-sub-category-values',
          };
          var resData = await this.appService
            .getCountryVal(subCategoryVal)
            .toPromise();
          resData.response.data.listData.map((val: any) => {
            if (data.value == val.id) {
              data.value = val.value;
            }
          });
          break;
        case 'category':
          const categoryVal: any = {
            category: data.value,
            reportBasedOn: this.appService.selectedMenu + '-category',
            reportName: 'get-issue-category-values',
          };
          var resData = await this.appService
            .getCountryVal(categoryVal)
            .toPromise();
          resData.response.data.listData.map((val: any) => {
            if (data.value == val.id) {
              data.value = val.value;
            }
          });
          break;
        case 'severity':
          const severityVal: any = {
            severity: data.value,
            reportBasedOn: this.appService.selectedMenu + '-severity',
            reportName: 'get-issue-severity-values',
          };
          var resData = await this.appService
            .getCountryVal(severityVal)
            .toPromise();
          resData.response.data.listData.map((val: any) => {
            if (data.value == val.id) {
              data.value = val.value;
            }
          });
          break;
        case 'status':
          const statusVal: any = {
            status: data.value,
            reportBasedOn: this.appService.selectedMenu + '-status',
            reportName: 'get-issue-status-values',
          };
          var resData = await this.appService
            .getCountryVal(statusVal)
            .toPromise();
          resData.response.data.listData.map((val: any) => {
            if (data.value == val.id) {
              data.value = val.value;
            }
          });
          break;
        case 'tripType':
          const tripTypeVal: any = {
            tripTypeExact: data.value,
            reportBasedOn: this.appService.selectedMenu + '-tripType',
            reportName: 'get-trip-type-values',
          };
          var resData = await this.appService
            .getCountryVal(tripTypeVal)
            .toPromise();
          if (
            resData.response.data.listData.id[0] == data.value[0] &&
            resData.response.data.listData.id[1] == data.value[1]
          )
            data.value = resData.response.data.listData.value;
          // resData.response.data.listData.map((val: any) => {
          //   if (data.value == val.id) {
          //     data.value = val.value;
          //   }
          // });
          break;
        case 'booking':
          const bookingVal: any = {
            requestTypeExact: data.value,
            reportBasedOn: this.appService.selectedMenu + '-booking',
            reportName: 'get-requestType-values',
          };
          var resData = await this.appService
            .getCountryVal(bookingVal)
            .toPromise();
          resData.response.data.listData.map((val: any) => {
            if (data.value == val.id) {
              data.value = val.value;
            }
          });
          break;
        case 'country':
          const countryVal: any = {
            countryCodeExact: data.value,
            reportBasedOn: this.appService.selectedMenu + '-country',
            reportName: 'get-country-possible-values',
          };
          var resData = await this.appService
            .getCountryVal(countryVal)
            .toPromise();
          resData.response.data.listData.map((val: any) => {
            if (data.value == val.id) {
              data.value = val.value;
            }
          });
          break;
        case 'reservation':
          const reservationVal: any = {
            reservationCodeExact: data.value,
            reportBasedOn: this.appService.selectedMenu + '-reservation',
            reportName: 'get-reservation-values',
          };
          var resData = await this.appService
            .getCountryVal(reservationVal)
            .toPromise();
          resData.response.data.listData.map((val: any) => {
            if (data.value == val.id) {
              data.value = val.value;
            }
          });
          break;
        case 'pos':
          const formData: any = {
            posCodeExact: data.value,
            reportBasedOn: this.appService.selectedMenu + '-pos',
            reportName: 'get-pos-possible-values',
          };
          var resData = await this.appService.getposVal(formData).toPromise();
          resData.response.data.listData.map((val: any) => {
            if (data.value === val.id) {
              data.value = val.value;
            }
          });
          break;
        case 'sector':
          if (data.value.originCode) {
            const originData: any = {
              sectorCodeExact: data.value.originCode,
              reportBasedOn: this.appService.selectedMenu + '-sector',
              reportName: 'get-sector-possible-values',
            };
            var resData = await this.appService
              .getSectorVal(originData)
              .toPromise();
            resData.response.data.listData.map((val: any) => {
              if (data.value.originCode === val.id) {
                data.value.originCode = val.value;
              }
            });
          }
          if (data.value.destinationCode) {
            const destinationData: any = {
              sectorCodeExact: data.value.destinationCode,
              reportBasedOn: this.appService.selectedMenu + '-sector',
              reportName: 'get-sector-possible-values',
            };

            var resData = await this.appService
              .getSectorPosVal(destinationData)
              .toPromise();
            resData.response.data.listData.map((val: any) => {
              if (data.value.destinationCode === val.id) {
                data.value.destinationCode = val.value;
              }
            });
          }
          break;
        case 'statusOfRequest':
          const statusOfRequestData: any = {
            reportBasedOn: this.appService.selectedMenu + '-statusOfRequest',
            reportName: 'get-status-of-request-values',
          };
          let array = [];
          for (let i = 0; i < data.value.length; i++) {
            array.push(Number(data.value[i]));
          }
          statusOfRequestData['statusOfRequestId'] = array;
          // if (data.value.length > 1) {
          //   statusOfRequestData.statusOfRequestId = data.value;
          // } else {
          //   statusOfRequestData.statusOfRequestId = parseInt(data.value);
          // }
          var resData = await this.appService
            .getStatusRequest(statusOfRequestData)
            .toPromise();
          if (resData?.response?.data?.listData?.length > 0) {
            let tempArray: any[] = [];
            resData?.response?.data?.listData.map((listVal: any) => {
              data.value.map((val: any) => {
                if (val == listVal.id) {
                  tempArray.push(listVal.value);
                }
              });
            });
            data.value = tempArray;
          }

          break;
        case 'negotiationRequestStatus':
          data.value = data.value;
          break;
        case 'currency':
          const currencyData: any = {
            reportBasedOn: this.appService.selectedMenu + '-currency',
            reportName: 'get-currency-possible-values',
            // currencyCode: data.value,
          };
          let currencyArr = [];
          for (let i = 0; i < data.value.length; i++) {
            currencyArr.push(data.value[i]);
          }
          currencyData['currencyCode'] = currencyArr;
          var resData = await this.appService
            .getCurrencyValues(currencyData)
            .toPromise();
          if (resData?.response?.data?.listData?.length > 0) {
            let tempVal: any[] = [];
            resData?.response?.data?.listData?.map((listVal: any) => {
              data.value.map((val: any) => {
                if (val == listVal.id) {
                  tempVal.push(listVal.id);
                }
              });
            });
            data.value = tempVal;
          }
          break;
        case 'groupCategory':
          const categoryData: any = {
            reportBasedOn: this.appService.selectedMenu + '-groupCategory',
            reportName: 'get-group-category-values',
            // groupCategoryId: data.value,
          };
          let arr = [];
          for (let i = 0; i < data.value.length; i++) {
            arr.push(Number(data.value[i]));
          }
          categoryData['groupCategoryId'] = arr;
          var resData = await this.appService
            .getGroupCategoryVal(categoryData)
            .toPromise();

          if (resData?.response?.data?.listData?.length > 0) {
            let tempVal: any[] = [];
            resData?.response?.data?.listData?.map((listVal: any) => {
              data.value.map((val: any) => {
                if (val == listVal.id) {
                  tempVal.push(listVal.value);
                }
              });
            });
            data.value = tempVal;
          }
          break;
        case 'requestType':
          const requestTypeVal: any = {
            countryCodeExact: data.value,
            reportBasedOn: this.appService.selectedMenu + '-requestType',
            reportName: 'get-requestType-values',
          };
          var resData = await this.appService
            .getCountryVal(requestTypeVal)
            .toPromise();
          resData.response.data.listData.map((val: any) => {
            if (data.value == val.id) {
              data.value = val.value;
            }
          });

          break;
        case 'staffEmailId':
          const staffEmailIdVal: any = {
            countryCodeExact: data.value,
            reportBasedOn: this.appService.selectedMenu + '-staffEmailId',
            reportName: 'get-reservation-values',
          };
          var resData = await this.appService
            .getCountryVal(staffEmailIdVal)
            .toPromise();
          resData.response.data.listData.map((val: any) => {
            if (data.value == val.id) {
              data.value = val.value;
            }
          });
          break;
        case 'pointOfSale':
          const pointOfSaleVal: any = {
            countryCodeExact: data.value,
            reportBasedOn: this.appService.selectedMenu + '-pointOfSale',
            reportName: 'get-pos-possible-values',
          };
          var resData = await this.appService
            .getCountryVal(pointOfSaleVal)
            .toPromise();
          resData.response.data.listData.map((val: any) => {
            if (data.value == val.id) {
              data.value = val.value;
            }
          });
          break;
      }
    });
    if (
      this.appService.isEditReport.reportAdditionalInfo.scheduleInfo?.cronInfo
    ) {
      this.scheduleForm.controls.time.setValue(
        this.appService.isEditReport.reportAdditionalInfo.scheduleInfo
          .frequencyTime
      );
      this.scheduleForm.controls.fromDate.setValue(
        this.datepipe.transform(
          this.appService.isEditReport.reportAdditionalInfo.scheduleInfo
            .frequencyStartDate,
          'dd-MMM-yy'
        )
      );
      this.scheduleForm.controls.toDate.setValue(
        this.datepipe.transform(
          this.appService.isEditReport.reportAdditionalInfo.scheduleInfo
            .frequencyEndDate,
          'dd-MMM-yy'
        )
      );
      this.appService.isEditReport.reportAdditionalInfo.scheduleInfo.recipients.map(
        (data: any) => {
          this.emailArray.push(data);
        }
      );
      this.appService.isEditReport.reportAdditionalInfo.scheduleInfo.frequencyDaysOfWeek.map(
        (data: any) => {
          this.daysList.map((val: any, index: number) => {
            if (data === val.id) {
              // val.status = 'Y';
              this.selectCheckbox(val.status, index);
            }
          });
        }
      );
      this.appService.isEditReport.reportAdditionalInfo.scheduleInfo.rollOverInfo.rollForNextDay.map(
        (val: any) => {
          this.rollForData.map((data: any, index: number) => {
            if (val.rollFor === data.key) {
              this.clickRollForNext(data.status, index);
            }
          });
        }
      );
    }
  }

  /**
   * Desc : chooseDate
   */
  public chooseDate(id: string): void {
    setTimeout(() => {
      $('#ui-datepicker-div').attr('role', 'application');
      $('#ui-datepicker-div .ui-datepicker-calendar td a')
        .attr('tabindex', '0')
        .first()
        .focus();
      // 	// event.preventDefault();
    }, 200);
    switch (id) {
      case 'fromDate':
        this.minDate = new Date();
        if (this.scheduleForm.controls['toDate'].value !== null) {
          this.scheduleForm.controls.toDate.reset();
        }
        this.maxDate = '';
        break;
      case 'toDate':
        this.minDate = this.scheduleForm.controls['fromDate']?.value
          ? this.scheduleForm.controls['fromDate'].value
          : new Date();
        this.minDate = this.changeDateFormat(this.minDate, '00:00:00');
        // Calculate maxDate as 30 days from 'fromDate'
        this.maxDate = new Date(this.minDate);
        let dateRange: number = this.airlineCode === '6E' ? 1095 : 30
        this.maxDate.setDate(
          this.maxDate.getDate() + dateRange
        );
        break;
    }
    if (this.minDate == null) this.minDate = '';
    if (this.maxDate == null) this.maxDate = '';
    this.datepickerService.setCalendar(
      id,
      this.scheduleForm,
      id,
      0,
      this.minDate,
      this.maxDate
    );
  }
  /**
   * back
   */
  public back() {
    this.appService.isEditReport = undefined;
    this.router.navigate(['/' + urlConfig.ROUTES.saved_report_list]);
  }
  /**
   * status change
   */
  public actionPerform() {
    if (this.appService?.isEditReport?.scheduleStatus == 'scheduled')
      this.appService.isEditReport.scheduleStatus = 'notScheduled';
    else this.appService.isEditReport.scheduleStatus = 'scheduled';
  }
  /**
   * add email
   */
  public addEmail() {
    setTimeout(function () {
      $('.cls-email-container').focus();
    }, 200);
    let scheduleResponseEmail: any = [];
    let scheduleFormEmail = this.scheduleForm.controls.email.value;
    this.autocompleteCity?.scheduleEmail.map((val: any) => {
      scheduleResponseEmail.push(val.id);
    });
    if (
      this.scheduleForm.controls.email.valid &&
      scheduleResponseEmail.includes(scheduleFormEmail)
    ) {
      if (!this.emailArray.includes(scheduleFormEmail)) {
        if (scheduleFormEmail !== null) {
          if (this.emailArray.length < 10) {
            this.emailArray.push(scheduleFormEmail);
          }
          if (this.emailArray.length == 10) {
            toastr.success('Added Limit reached your emails');
          }
        }
      } else {
        toastr.error('Duplicate email not allowed');
      }
      this.scheduleForm.controls.email.reset();
      this.submitted = false;
    } else {
      this.submitted = true;
      toastr.error('Enter valid email');
    }
  }
  /**
   * select checkbox
   */
  public selectCheckbox(status: any, index: number) {
    this.daysList[index]['status'] = status === 'N' ? 'Y' : 'N';
    this.daysListArray = this.daysList.filter(
      (data: any) => data.status === 'Y'
    );
  }
  /**
   * remove email
   */
  public removeEmail(index: number) {
    this.emailArray.splice(index, 1);
  }
  /**
   * create schedule
   */
  public async createSchedule() {
    if (this.emailArray.length > 0) {
      this.scheduleForm.controls['email'].clearValidators();
      this.scheduleForm.controls['email'].updateValueAndValidity();
    }
    this.finalDays = [];
    this.daysListArray.map((val: any) => {
      if (val.status === 'Y') {
        this.finalDays.push(val.id);
      }
    });
    if (this.finalDays.length === 0) {
      this.frequencyCheckbox = true;
    }

    if (
      this.scheduleForm.status === 'VALID' &&
      this.emailArray.length > 0 &&
      this.finalDays.length > 0
    ) {
      this.finalDays = [];
      this.finalRollDate = [];
      this.daysListArray.map((val: any) => {
        if (val.status === 'Y') {
          this.finalDays.push(val.id);
        }
      });
      this.rollForDateArray.map((data: any) => {
        if (data.status === 'Y') {
          this.finalRollDate.push(data.key);
        }
      });
      let formData: any = {
        reportName: 'schedule-saved-reports',
        reportBasedOn: this.appService.currentBasedOn,
        savedReportId: this.appService.isEditReport.savedReportId,
        recipients: this.emailArray,
        frequencyStartDate: this.changeDateFormat(
          this.scheduleForm.controls.fromDate.value,
          ''
        ),
        frequencyEndDate: this.changeDateFormat(
          this.scheduleForm.controls.toDate.value,
          ''
        ),
        frequencyDaysOfWeek: this.finalDays,
        frequencyTime: this.scheduleForm.controls.time.value,
        rollOverConditions: this.finalRollDate,
        scheduleStatus:
          this.appService.isEditReport.scheduleStatus == 'scheduled'
            ? 'Y'
            : 'N',
      };
      this.logUserAction.logUserAction(
        formData,
        environment.CUSTOME_BACKEND_URL + 'add-user-action-log',
        'Schedule Report',
        this.editData.submenuData,
        'CREATE',
        'SCHEDULE_SAVED_REPORTS',
        'user schedule the ' + this.editData.submenuData + ' report'
      );

      var data = await this.appService
        .getScheduleSavedReportMessage(formData)
        .toPromise();

      if (data.responseCode == 0) {
        setTimeout(() => {
          this.appService.isEditReport = undefined;
          toastr.success('Report successfully scheduled');
          this.router.navigate(['/' + urlConfig.ROUTES.saved_report_list]);
        }, 500);
      } else {
        console.log(data);
      }
    } else {
      this.submitted = true;
      toastr.error('Enter all mandatory fields');
    }
  }
  /**
   * roll for next day
   */
  public clickRollForNext(status: any, index: number) {
    this.rollForData[index].status = status === 'N' ? 'Y' : 'N';
    this.rollForDateArray = this.rollForData.filter(
      (data: any) => data.status === 'Y'
    );
  }
  /**
   * edit report ad schedule
   */
  public selectTabMenu(type: string) {
    if (type === 'savedReport') {
      this.appService.createReports = true;
      this.router.navigate(['/' + urlConfig.ROUTES.custom_report], {
        state: {
          editValue: history.state.editValue,
          obj: history.state.obj,
          conditionReportBasedOn: history.state.conditionReportBasedOn,
        },
      });
    } else {
      this.router.navigate(['/' + urlConfig.ROUTES.report_schedule], {
        state: {
          editValue: history.state.editValue,
          obj: history.state.obj,
          conditionReportBasedOn: history.state.conditionReportBasedOn,
        },
      });
    }
  }
  /**
   * Autocomplete method for agentEmailId
   */
  public citySearch(
    id: string,
    reportName: string,
    basedOn: string,
    event: Event
  ): void {
    if (this.emailArray.length == 10) {
      toastr.error('Only 10 emails can be added.');
      event.preventDefault();
    }
    const searchLength = (this.scheduleForm as FormGroup).controls[id].value;
    basedOn = this.appService.selectedMenu + '-scheduleRecipients';
    this.autocompleteCity.autoComplete(
      id,
      this.scheduleForm as FormGroup,
      id,
      searchLength,
      'placesApi',
      reportName,
      basedOn
    );
  }

  private changeDateFormat(date: string, time: string) {
    let months = [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
    ];
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

    // return navigator.userAgent.indexOf('Firefox') > -1
    //   ? final.replace('-', '')
    //   : final;
    return final;
  }
}
