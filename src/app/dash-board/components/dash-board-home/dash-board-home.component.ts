import { Component, OnInit } from '@angular/core';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';

@Component({
  selector: 'app-dash-board-home',
  templateUrl: './dash-board-home.component.html',
  styleUrls: ['./dash-board-home.component.scss']
})
export class DashBoardHomeComponent implements OnInit {
  public comparisondata:any;
  public revenuecomparisondata:any;
  public currentYearRevenuedata:any;
  public curYear:any = new Date().getFullYear();
  public prevYear:any = this.curYear - 1;

  constructor(private dashboardService: DashBoardService) {}
  ngOnInit(): void {
    this.curYear = this.curYear.toString();
    this.prevYear = this.prevYear.toString();

    this.reqTrendData();
    this.reqAnalysisData();

  }
  public getReload(data:any) {
    if(data === 'reloadSerevice')
    this.reqTrendData();
  }

  public getReloadRevenue(data:any){
    if(data === 'reloadSerevice')
    this.reqAnalysisData();
  }
  public getReloadRevenueComp(data:any){
    if (data === 'reloadSerevice') {
      const reqAnalysislastyear = {
        "reportName": "revenue-analysis",
        "reportBasedOn": "monthly",
        "startDate": this.prevYear+"-01-01 00:00:00",
        "endDate": this.prevYear+"-12-31 23:59:59"
      };
      this.reqAnalysisDatacomp(reqAnalysislastyear);
    }
  }
  reqTrendData(){
    const reqTrendCmp = {
      "reportName": "request-trend-comparison",
      "startDate":  this.prevYear+"-01-01 00:00:00",
      "endDate": this.curYear+"-12-31 23:59:59",
      "reportBasedOn": "monthly"
    };
    this.serviceCall(reqTrendCmp);
  }
  reqAnalysisData(){
    const reqAnalysisCurrentYear = {
      "reportName": "revenue-analysis",
      "reportBasedOn": "monthly",
      "startDate": this.curYear+"-01-01 00:00:00",
      "endDate": this.curYear+"-12-31 23:59:59"
    };
    const reqAnalysislastyear = {
      "reportName": "revenue-analysis",
      "reportBasedOn": "monthly",
      "startDate": this.prevYear+"-01-01 00:00:00",
      "endDate": this.prevYear+"-12-31 23:59:59"
    };
    this.analysisserviceCallcurrentYear(reqAnalysisCurrentYear, reqAnalysislastyear);
  }
  serviceCall(request: any) {
    this.dashboardService.httpPost('request_trend_comparision', request, '').subscribe(data => {
      if (data.response.Message !== 'Success') {
        this.comparisondata = {
          responseMessage : data.response.Message
        };
      } else {
      let _data2017:any = {};
      let _data2018:any = {};
    

      let splitArray = this.chunk(data.response.data, data.response.data.length / 2);
      if(splitArray !== undefined) {
        this.comparisondata = {
          _data2017 : splitArray[0],
          _data2018 : splitArray[1]
        }
      }
      }
    });
  }
  chunk(array, size) {
    const chunked_arr = [];
    let copied = [...array]; // ES6 destructuring
    const numOfChild = Math.ceil(copied.length / size); // Round up to the nearest integer
    for (let i = 0; i < numOfChild; i++) {
      chunked_arr.push(copied.splice(0, size));
    }
    return chunked_arr;
  }
  analysisserviceCallcurrentYear(requestCurrentYear: any, requestLastYear:any) {
    this.dashboardService.httpPost('revenue_analysis', requestCurrentYear, '').subscribe(data => {
      if (data.response.Message !== 'Success' ) {
        this.currentYearRevenuedata = {
          responseMessage : data.responseMessage,
          status : data.status
        };
      } else  {
       
        this.currentYearRevenuedata = data.response.data
        this.reqAnalysisDatacomp(requestLastYear);
      }
    });
  }

  reqAnalysisDatacomp(requestLastYear:any){
    this.dashboardService.httpPost('revenue_analysis', requestLastYear, '').subscribe(data => {
      if (data.response.Message !== 'Success' ) {
        this.revenuecomparisondata = {
          responseMessage : data.responseMessage,
        };
      }
      else {

        // data.responseData.map(data=> data.year_index = data.year_index-1); // temp to check
        if (data !== undefined && this.currentYearRevenuedata !== undefined) {
          this.revenuecomparisondata = {
            _DataYr2019 : data.response.data.responseData,
            _DataYr2020 : this.currentYearRevenuedata.responseData,
            currency : data.response.data?.responseAdditionalData.curreny
          };
        }
      }
    });
  }
}


