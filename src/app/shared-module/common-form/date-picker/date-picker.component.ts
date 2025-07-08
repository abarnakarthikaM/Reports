import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'src/app/core-module/service/app.service';
import { DatepickerService } from 'src/app/core-module/service/datepicker.service';
declare var $: any;
@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
  public form: FormGroup = new FormGroup({});

  @Input() public formData: any = [];

  @Input() public formValues: any = [];

  @Input() public conditionValue: any = {};

  public submitted: boolean = false;
  minDate: string;
  maxDate: any;
  addDate: Date;

  constructor(
    public datepipe: DatePipe,
    public appService: AppService,
    private datepickerService: DatepickerService
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.formData.forEach((data: any) => {
      this.form?.addControl(
        data.keys,
        new FormControl(
          this.conditionValue?.editValue &&
          this.conditionValue.editValue[data.keys]
            ? this.dateFormatter(this.conditionValue?.editValue[data.keys])
            : '',
          Validators.required
        )
      );
    });
    // this.dateFormatter(this.formValues[data.formControl]);
  }

  //Edit page date formating.
  public dateFormatter = (dates: any) => {
    let date = new Date(dates).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    let choosenDate = date.replace(',', '').split(' ');
    let day =
      choosenDate[1].length === 1 ? '0' + choosenDate[1] : choosenDate[1];
    let month = choosenDate[0];
    let year = choosenDate[2];

    return `${day}-${month}-${year}`;
  };

  // Following method is used to render the date picker element.
  public chooseDate(id: string): void {
    setTimeout(() => {
      $('#ui-datepicker-div').attr('role', 'application');
      $('#ui-datepicker-div .ui-datepicker-calendar td a')
        .attr('tabindex', '0')
        .first()
        .focus();
      // 	// event.preventDefault();
    }, 200);

    // Following line is used for finding the difference between from and to date difference.
    let dateDifference =
      sessionStorage.getItem('themeCode') == 'ET'
        ? 365
        : sessionStorage.getItem('themeCode') == 'MH'
        ? 183
        : this.appService.selectedMenu == 'unsubmittedReport'
        ? 30
        : 90;
    switch (id) {
      /**
       * Date range of requests
       * If ==> this.maxDate = ''         ==> date picker with any date range
       * If ==> this.maxDate = new Date() ==> maximum day is current day
       */
      case 'requestedFrom':
      case 'fromDate':
      case 'startDate':
      case 'agentResponseFrom':
      case 'airlineResponseFrom':
      case 'negotiationApprovedFrom':
      case 'negotiationRequestFrom':
      case 'registeredDateFrom':
      case 'actionFrom':
      case 'pendingDepartureDateFrom':
      case 'issueFrom':
      case 'paymentDateRangeFrom':
      case 'registeredFrom':
      case 'transactionFrom':
        this.minDate = '';
        this.maxDate = new Date();
        if (
          this?.form?.controls?.toDate?.value !== null &&
          this?.form?.controls?.toDate?.value
        ) {
          this?.form?.controls.toDate.reset();
        } else if (
          this?.form?.controls?.requestedTo?.value !== null &&
          this?.form?.controls?.requestedTo?.value
        ) {
          this?.form?.controls.requestedTo.reset();
        } else if (
          this?.form?.controls?.endDate?.value !== null &&
          this?.form?.controls?.endDate?.value
        ) {
          this?.form?.controls.endDate.reset();
        } else if (
          this?.form?.controls?.agentResponseTo?.value !== null &&
          this?.form?.controls?.agentResponseTo?.value
        ) {
          this?.form?.controls.agentResponseTo.reset();
        } else if (
          this?.form?.controls?.airlineResponseTo?.value !== null &&
          this?.form?.controls?.airlineResponseTo?.value
        ) {
          this?.form?.controls.airlineResponseTo.reset();
        } else if (
          this?.form?.controls?.negotiationApprovedTo?.value !== null &&
          this?.form?.controls?.negotiationApprovedTo?.value
        ) {
          this?.form?.controls.negotiationApprovedTo.reset();
        } else if (
          this?.form?.controls?.negotiationRequestTo?.value &&
          this?.form?.controls?.negotiationRequestTo?.value !== null
        ) {
          this?.form?.controls.negotiationRequestTo.reset();
        } else if (
          this?.form?.controls?.registeredDateTo?.value &&
          this?.form?.controls?.registeredDateTo?.value !== null
        ) {
          this?.form?.controls.registeredDateTo.reset();
        } else if (
          this?.form?.controls?.actionTo?.value &&
          this?.form?.controls?.actionTo?.value !== null
        ) {
          this?.form?.controls.actionTo.reset();
        } else if (
          this?.form?.controls?.registeredTo?.value !== null &&
          this?.form?.controls?.registeredTo?.value
        ) {
          this?.form?.controls?.registeredTo?.reset();
        } else if (
          this?.form?.controls?.transactionTo?.value !== null &&
          this?.form?.controls?.transactionTo?.value
        ) {
          this.form.controls.transactionTo?.reset();
        } else if (
          this?.form?.controls?.pendingDepartureDateTo?.value &&
          this?.form?.controls?.pendingDepartureDateTo?.value !== null
        ) {
          this?.form?.controls.pendingDepartureDateTo.reset();
        } else if (
          this?.form?.controls?.issueTo?.value &&
          this?.form?.controls?.issueTo?.value !== null
        ) {
          this?.form?.controls.issueTo.reset();
        } else if (
          this?.form?.controls?.paymentDateRangeTo?.value &&
          this?.form?.controls?.paymentDateRangeTo?.value !== null
        ) {
          this?.form?.controls.paymentDateRangeTo.reset();
        }

        break;
      // Only future dates are enabled in this case.
      case 'departureFrom':
      case 'fareExpiryFrom':
      case 'negotiationExpiryFrom':
      case 'paymentFrom':
      case 'pendingDepartureFrom':
      case 'paidFrom':
        this.minDate = '';
        this.maxDate = '';
        if (
          this?.form?.controls?.departureTo?.value !== null &&
          this?.form?.controls?.departureTo?.value
        ) {
          this?.form?.controls.departureTo.reset();
        } else if (
          this?.form?.controls?.fareExpiryTo?.value !== null &&
          this?.form?.controls?.fareExpiryTo?.value
        ) {
          this?.form?.controls.fareExpiryTo.reset();
        } else if (
          this?.form?.controls?.negotiationExpiryTo?.value &&
          this?.form?.controls?.negotiationExpiryTo?.value !== null
        ) {
          this?.form?.controls.negotiationExpiryTo.reset();
        } else if (
          this?.form?.controls?.paymentTo?.value &&
          this?.form?.controls?.paymentTo?.value !== null
        ) {
          this?.form?.controls?.paymentDateRangeTo?.reset();
        } else if (
          this?.form?.controls?.pendingDepartureTo?.value &&
          this?.form?.controls?.pendingDepartureTo?.value !== null
        ) {
          this?.form?.controls.pendingDepartureTo?.reset();
        } else if (
          this?.form?.controls?.paidTo?.value &&
          this?.form?.controls?.paidTo?.value !== null
        ) {
          this?.form?.controls.paidTo?.reset();
        }
        break;
      case 'negotiationExpiryTo':
      case 'fareExpiryTo':
      case 'departureTo':
      case 'paidTo':
      case 'pendingDepartureTo':
      case 'paymentTo':
        this.minDate =
          this?.form?.controls?.negotiationExpiryFrom?.value ||
          this?.form?.controls?.departureFrom?.value ||
          this?.form?.controls?.fareExpiryFrom?.value ||
          this?.form?.controls?.pendingDepartureFrom?.value ||
          this?.form?.controls?.paymentFrom?.value ||
          this?.form?.controls?.paidFrom?.value;
        if (this.minDate) {
          this.minDate = this.appService.changeDateFormat(
            this.minDate,
            '00:00:00'
          );
          let newdate = new Date(this.minDate);
          newdate.setDate(newdate.getDate() + dateDifference);
          this.addDate = new Date(newdate);
        }
        this.maxDate = new Date(this.addDate);
        // this.maxDate = this.datepipe?.transform(this.maxDate, 'dd/MMM/yyyy');
        // this.maxDate = this.changeDateFormat(this.maxDate,'23:59:59');
        break;
      /**
       * Negotiation requested date
       */
      case 'negotiationApprovedTo':
      case 'pendingDepartureDateTo':
      case 'issueTo':
      case 'actionTo':
      case 'registeredDateTo':
      case 'negotiationRequestTo':
      case 'airlineResponseTo':
      case 'agentResponseTo':
      case 'endDate':
      case 'requestedTo':
      case 'toDate':
      case 'paymentDateRangeTo':
      case 'registeredTo':
      case 'transactionTo':
        this.minDate =
          this?.form?.controls?.negotiationApprovedFrom?.value ||
          this?.form?.controls?.paymentDateRangeFrom?.value ||
          this?.form?.controls?.pendingDepartureDateFrom?.value ||
          this?.form?.controls?.issueFrom?.value ||
          this?.form?.controls?.actionFrom?.value ||
          this?.form?.controls?.requestedFrom?.value ||
          this?.form?.controls?.registeredDateFrom?.value ||
          this?.form?.controls?.registeredDateFrom?.value ||
          this?.form?.controls?.negotiationRequestFrom?.value ||
          this?.form?.controls?.airlineResponseFrom?.value ||
          this?.form?.controls?.agentResponseFrom?.value ||
          this?.form?.controls?.fromDate?.value ||
          this?.form?.controls?.startDate?.value ||
          this?.form?.controls?.registeredFrom?.value ||
          this?.form?.controls?.transactionFrom?.value;
        if (this.minDate) {
          this.minDate = this.appService.changeDateFormat(
            this.minDate,
            '00:00:00'
          );
          let newdate = new Date(this.minDate);
          newdate.setDate(newdate.getDate() + dateDifference);
          this.addDate = new Date(newdate);
          this.maxDate = new Date(this.addDate);
          this.maxDate = this.datepipe.transform(this.maxDate, 'dd/MMM/yyyy');
          /**
           * TO DATE MORE THEN FROM DATE
           */
          let compare = new Date();
          let datefromSelcted = new Date(Date.parse(this.maxDate));
          if (datefromSelcted > compare) {
            this.maxDate = new Date();
          }
        }
        break;
    }

    // Code Optimization in future
    //   if(this.conditionValue.futureDate == 'Y'){
    //     this.minDate = '';
    //     this.maxDate = new Date();
    //     this?.form?.controls?.toDate?.value !== null && this?.form?.controls?.toDate?.value) {
    //     this?.form?.controls.toDate.reset();
    //   }
    // }
    if (this.minDate == null) this.minDate = '';

    if (this.maxDate == null) this.maxDate = '';
    //  console.log('this.minDate',this.minDate,'this.maxDate',this.maxDate)
    this.datepickerService.setCalendar(
      id,
      this.form,
      id,
      0,
      this.minDate,
      this.maxDate
    );
  }
}
