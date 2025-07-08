import { Component, OnInit, HostListener } from '@angular/core';
import { AppService } from 'src/app/core-module/service/app.service';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';

@Component({
  selector: 'app-pipeline-travelagent',
  templateUrl: './pipeline-travelagent.component.html',
  styleUrls: ['./pipeline-travelagent.component.scss']
})
export class PipelineTravelagentComponent implements OnInit {

  selectbox: boolean = false;
  options: { id: number; info: string; val: string; }[];
  selectedVal: string;
  showVal: string = 'Select';
  downloadbox: boolean = false;
  nameAsc: boolean = false;
  paymentCompAsc: boolean = false;
  paymentPartialCompAsc: boolean = false;
  yettomakepaymentCompAsc: boolean = false;

  @HostListener('document:click', ['$event']) onDocumentClick() {
    this.selectbox = false;
    // this.selectboxbaseddon = false;
  }

  constructor(private dashboardService: DashBoardService, private appService: AppService) { }
  loader: boolean = true;
  reload: boolean = false;
  responseTravelAgent: any;
  ngOnInit(): void {
    this.options = [
      {
        "id": 1,
        "info": "",
        "val": "Revenue in USD"
      },
      {
        "id": 2,
        "info": "No of Departure",
        "val": "No of Departure"
      },
      {
        "id": 3,
        "info": "No of Passenger",
        "val": "No of Passenger"
      }
    ];
    this.selectedVal = this.options[0].val;
    this.serrviceData();
  }

  openSelectBox() {
    this.selectbox = true;
  }
  openDownloadBox() {
    this.downloadbox = true;
    let csvTempData = JSON.parse(JSON.stringify(this.responseTravelAgent));
    csvTempData.responseData.map((data: any) => {
      Object.keys(data).forEach((key: any) => {
        if (data[key] === undefined || data[key] === 'undefined undefined') {
          delete data[key];
        }
      });
    });
    let header = ['Travel Agents Name', 'Payment Completed', 'Payment Partially Completed', 'Yet to Make Payment'];
    let responseData = csvTempData.responseData.map(data => {
      const datas = { "Travel Agents Name": data.agent_name, "Payment Completed": data.pay_completed, "Payment Partially Completed": data.pay_partially_completed, "Yet to Make Payment": data.yet_2_pay }
      return datas;
    })
    this.dashboardService.downloadFile(responseData, header, 'Pipeline Revenue - Travel agent wise', 'csv', 'travelAgentDiv');
  }
  select(val: string) {
    this.serrviceData();
    this.selectedVal = val;
    this.selectbox = false;
  }

  reloadItem() {
    this.reload = false;
    this.loader = true;
    this.serrviceData();
  }
  serrviceData() {
    // current Date
    let currdate = new Date();

    let newDate = this.dashboardService.dateFormat(currdate);


    // getting six month from now in time stamp
    let sixMonths = currdate.setMonth(currdate.getMonth() + 6);

    let newSixDate = this.dashboardService.dateFormat(new Date(sixMonths));
    let requestTravelAgent = {
      "reportName": "pipeline-departure",
      "reportBasedOn": "travel-agent",
      "startDate": newDate + ' 00:00:00',
      "endDate": newSixDate + ' 23:59:59'
    }
    this.serviceCall(requestTravelAgent);
  }

  async serviceCall(request: any) {
    this.loader = true;
    var data = await this.appService.pipelineDepartureRequest(request).toPromise();
    let currcyFormat = data?.response?.data?.responseAdditionalData?.curreny !== undefined ? data.response.data.responseAdditionalData.curreny : 'USD';
    this.options[0].info = "Revenue in " + currcyFormat;
    this.options.map((data: any) => {
      if (data.val === this.selectedVal) {
        this.showVal = data.info;
      }
    });
    this.loader = false;
    if (data.response.Message !== 'Success') {
      this.reload = true;
      this.loader = false;
    } else {
      let reportData: any = this.dashboardService.convertRequestType(data.response.data, this.selectedVal);
      this.responseTravelAgent = reportData;
      if (this.selectedVal.includes("Revenue in") || this.selectedVal === this.options[1].info || this.selectedVal === this.options[2].info) {
        this.responseTravelAgent.responseData.map((data: any) => {
          // data['pay_completed'] = this.dashboardService.kFormatter(data['pay_completed']);
          // data['pay_partially_completed'] = this.dashboardService.kFormatter(data['pay_partially_completed']);
          // data['yet_2_pay'] = this.dashboardService.kFormatter(data['yet_2_pay']);
          data['payCompl'] = data['pay_completed']
          data['pay_completed'] = this.formatter(data['pay_completed']);

          data['partialPayComp'] = data['pay_partially_completed']
          data['pay_partially_completed'] = this.formatter(data['pay_partially_completed']);

          data['yet2PayVal'] = data['yet_2_pay']
          data['yet_2_pay'] = this.formatter(data['yet_2_pay']);
          // data['pay_completed'] = data['pay_completed'];
          // data['pay_partially_completed'] = data['pay_partially_completed'];
          // data['yet_2_pay'] = data['yet_2_pay'];
        });
      } else {
        this.responseTravelAgent.responseData.map((data: any) => {
          data['pay_completed'] = data['pay_completed'];
          data['pay_partially_completed'] = data['pay_partially_completed'];
          data['yet_2_pay'] = data['yet_2_pay'];
        });
      }
    }
  }
  public comaSeparator(val: any) {
    return Number(parseFloat(val)).toLocaleString('en');
  }
  formatter(val: any) {
    function intlFormat(val) {
      return new Intl.NumberFormat().format(Math.round(val * 10) / 10);
    }
    if (val >= 1000000000) return intlFormat(val / 1000000000) + 'B';
    if (val >= 1000000) return intlFormat(val / 1000000) + 'M';
    if (val >= 1000) return intlFormat(val / 1000) + 'k';
    return intlFormat(val);
  }
  public sort(sortby: string, targetList: any) {

    // Revised comparison functions
    function compareAsc(a, b, key) {
      return a[key] > b[key] ? -1 : a[key] < b[key] ? 1 : 0;
    }

    function compareDesc(a, b, key) {
      return a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0;
    }
    {
      // Adding actual float values
      this.responseTravelAgent.responseData.forEach(data => {
        data['pay_completed'] = data['payCompl'];
        data['pay_partially_completed'] = data['partialPayComp'];
        data['yet_2_pay'] = data['yet2PayVal'];
      });

      // Sorting
      if (sortby === 'asc') {
        this.responseTravelAgent.responseData.sort((a, b) => compareAsc(a, b, targetList));
      } else if (sortby === 'desc') {
        this.responseTravelAgent.responseData.sort((a, b) => compareDesc(a, b, targetList));
      }

      // Formatting values after sorting
      this.responseTravelAgent.responseData.forEach(data => {
        data['pay_completed'] = this.formatter(data['pay_completed']);
        data['pay_partially_completed'] = this.formatter(data['pay_partially_completed']);
        data['yet_2_pay'] = this.formatter(data['yet_2_pay']);
      });
    }
  }
}
