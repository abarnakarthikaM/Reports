
import { Component, OnInit, ViewChild, Input, HostListener, ElementRef } from '@angular/core';
import { response } from 'src/app/dash-board/response.Interface';
import { AppService } from 'src/app/core-module/service/app.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexTheme,
  ApexTooltip
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  theme: ApexTheme;
  tooltip: ApexTooltip;
  colors: string[];
};
import { async } from 'rxjs/internal/scheduler/async';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';
import { TranslatePipe } from 'src/app/core-module/pipes/translate.pipe';
import { DashboardDownloadService } from 'src/app/core-module/service/dashboard-download.service';
@Component({
  selector: 'app-pipeline-monthwise',
  templateUrl: './pipeline-monthwise.component.html',
  styleUrls: ['./pipeline-monthwise.component.scss'],
  providers: [TranslatePipe]
})
export class PipelineMonthwiseComponent implements OnInit {

  @Input() public datatocomparison: any;
  options: { id: number; info: string; val: string; }[];
  selectedVal: string;
  showVal: any = "Select";
  random: number = 20;
  activeTab: any;
  // @Output() public reloadService : EventEmitter<any> = new EventEmitter();
  constructor(private dashboardService: DashBoardService, private translate: TranslatePipe, private appService: AppService, private dashboardDownload: DashboardDownloadService, private elementRef: ElementRef) { }
  @HostListener('document:click', ['$event']) onDocumentClick() {
    this.selectbox = false;
    // this.selectboxbaseddon = false;
  }
  loader: boolean = true;
  reload: boolean = false;
  responseMonthWise: response = {};
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartValue: any;
  public downloadOption: any;
  public downloadData;
  public downloadHeader: any;
  selectbox: boolean = false;
  ngOnInit(): void {
    this.ngOnChanges();
  }
  reloadItem() {
    this.loader = true;
    this.reload = false;
    this.serviceData();
    // this.reloadService.emit('reloadSerevice');
  }
  ngOnChanges(): void {
    this.downloadOption = this.appService.chartDownloadOption;
    this.options = [
      {
        "id": 1,
        "info": " ",
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


    this.serviceData();
  }

  serviceData() {
    // current Date
    let currdate = new Date();

    let newDate = this.dashboardService.dateFormat(currdate);

    // getting six month from now in time stamp
    let sixMonths = currdate.setMonth(currdate.getMonth() + 6);
    let lastyear = currdate.setMonth(currdate.getMonth() - 12);
    let lastyearfirstmonth = currdate.setMonth(currdate.getMonth() - 6);
    let newSixDate = this.dashboardService.dateFormat(new Date(sixMonths));
    let lastYearfirstSixmonths = this.dashboardService.dateFormat(new Date(lastyearfirstmonth));
    let lastYearSixmonths = this.dashboardService.dateFormat(new Date(lastyear));
    // let requestMonthWise = {
    let requestMonthWise = {
      "reportName": "pipeline-departure",
      "reportBasedOn": "monthly",
      "startDate": lastYearfirstSixmonths + ' 00:00:00',
      "endDate": lastYearSixmonths + ' 23:59:59'
    }
    if (this.datatocomparison !== undefined) {
      this.options[0].info = "Revenue in " + (this.datatocomparison?.responseAdditionalData?.curreny !== undefined ? this.datatocomparison.responseAdditionalData.curreny : 'USD');
      this.options[0].val = "Revenue in " + (this.datatocomparison?.responseAdditionalData?.curreny !== undefined ? this.datatocomparison.responseAdditionalData.curreny : 'USD');

      if (this.downloadHeader == undefined) {
        this.downloadHeader = this.options[0].info;
      }
      this.selectedVal = this.options[0].val;
      this.serviceCall(requestMonthWise);

    }
  }
  openSelectBox() {
    this.selectbox = true;
  }
  select(val: string) {
    this.downloadHeader = val;
    this.serviceData();
    this.activeTab = val;
    this.selectedVal = val;
    this.selectbox = false;
  }

  async serviceCall(request: any) {
    this.loader = true;
    var data = await this.appService.pipelineDepartureRequest(request).toPromise();
    this.options.map((data: any) => {
      if (data.val === this.selectedVal) {
        this.showVal = data.info;
      }
    });
    if (data.response.Message !== 'Success') {
      this.reload = true;
      this.loader = false;
    } else {

      let _data2020: any = this.datatocomparison;
      let _data2019: any = data.response.data;
      // this.selectedVal = request.reportBasedOn;
      this.loader = false;
      let cmpData = [];
      if (_data2020.responseData !== undefined) {
        _data2020.responseData.map((data: any, index: number) => {
          cmpData.push(data);
          cmpData.push(_data2019.responseData[index]);
        });
      }
      let temptest = {
        responseData: cmpData
      };
      let reportData: any = this.dashboardService.convertRequestType(temptest, this.selectedVal);
      this.chartValue = reportData;
      this.responseMonthWise = { "responseData": temptest.responseData, "responseMessage": "ok" };
      this.initChart(this.responseMonthWise);
    }
  }

  initChart(data: any) {
    this.downloadData = data;
    if (this.chartValue.responseData != '') {
      data = this.chartValue;
    } else {
      data = data;
    }
    let monthIndex = data.responseData.map(data => data['month_index']);
    let yearIndex = data.responseData.map(data => data['year_index']);
    let paymentCompleted;
    let paymentpartialyCompleted;
    let paymentYetToComplete;
    let titleText = this.translate.transform("Pipeline Revenue – For next 6 Months Comparison");

    data.responseData.map(data => data['label'] = `${data['month_index']} ${data['year_index']}`);
    let label = data.responseData.map(data => data['label']);
    if (this.selectedVal === "Revenue in " + this.datatocomparison?.responseAdditionalData?.curreny ? this.datatocomparison.responseAdditionalData.curreny : 'USD') {
      paymentCompleted = data.responseData.map((data) => this.dashboardService.kFormatter(data['pay_completed']));
      paymentpartialyCompleted = data.responseData.map(data => this.dashboardService.kFormatter(data['pay_partially_completed']));
      paymentYetToComplete = data.responseData.map(data => this.dashboardService.kFormatter(data['yet_2_pay']));
    } else {
      paymentCompleted = data.responseData.map(data => (data['pay_completed']) ? data['pay_completed'] : 0);
      paymentpartialyCompleted = data.responseData.map(data => (data['pay_partially_completed']) ? data['pay_partially_completed'] : 0);
      paymentYetToComplete = data.responseData.map(data => (data['yet_2_pay']) ? data['yet_2_pay'] : 0);
    }
    this.chartOptions = {
      series: [
        {
          name: "Payment Completed",
          data: paymentCompleted
        },
        {
          name: "Payment Partially Completed",
          data: paymentpartialyCompleted
        },
        {
          name: "Yet to Make Payment",
          data: paymentYetToComplete
        }
      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: false,
          offsetX: 0,
          offsetY: 30,
          tools: {
            download: '<em class="icon-28-chart-download" title="Download" aria-hidden="true"></em>',
          },
          export: {
            png: {
              filename: 'Pipeline Revenue - For next  6 Months Comparison',
            },
            svg: {
              filename: 'Pipeline Revenue - For next  6 Months Comparison',
            },
            csv: {
              headerCategory: this.activeTab ? this.activeTab : this.options[0]['val'],
              filename: 'Pipeline Revenue - For next  6 Months Comparison',
            }
          }
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [
        {
          breakpoint: undefined,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      title: {
        "text": titleText,
        align: 'left',
        floating: false,
        style: {
          color: 'var(--TXTBLACK)',
          fontSize: '14px',
          fontWeight: 600,
          fontFamily: 'var(--PRIMARYREGULARFONT)',
        }
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: "category",
        categories: label,
        labels: {
          style: {
            colors: 'var(--TXTBLACK)',
            fontFamily: 'var(--PRIMARYREGULARFONT)',
            fontWeight: 500,
            fontSize: '10px'
          },
        }
      },
      yaxis: {
        show: true,
        axisBorder: {
          show: true,
          color: '#78909C',
          offsetX: 0,
          offsetY: 0
        },
        title: {
          text: "Amount",
          offsetX: 0,
          style: {
            color: 'var(--TXTBLACK)',
            fontFamily: 'var(--PRIMARYREGULARFONT)',
            fontWeight: 600,
            fontSize: '14'
          }
        },
        tooltip: {
          enabled: true,
          offsetX: 0,
        },
      },
      tooltip: {
        style: {
          fontFamily: 'var(--PRIMARYREGULARFONT)'
        }
      },
      colors: ['#1d5cac', '#f1a917', '#f73b3c'],
      legend: {
        position: "bottom",
        offsetY: 0,
        show: true,
      },
      fill: {
        opacity: 1
      }
    };
    if (
      this.selectedVal.includes("Revenue in") ||
      this.selectedVal === 'No of Departure' ||
      this.selectedVal === 'No of Passenger'
    ) {
      this.chartOptions.yaxis.labels = {
        formatter(val: any) {
          function intlFormat(val) {
            return new Intl.NumberFormat().format(Math.round(val * 10) / 10);
          }
          if (val >= 1000000000) return intlFormat(val / 1000000000) + 'B';
          if (val >= 1000000) return intlFormat(val / 1000000) + 'M';
          if (val >= 1000) return intlFormat(val / 1000) + 'k';
          return intlFormat(val);
        },
        style: {
          colors: 'var(--TXTBLACK)',
          fontFamily: 'var(--PRIMARYREGULARFONT)',
          fontWeight: 500,
          fontSize: '10px'
        },
      };
    } else {
      this.chartOptions.yaxis.labels = {
        style: {
          colors: 'var(--TXTBLACK)',
          fontFamily: 'var(--PRIMARYREGULARFONT)',
          fontWeight: 500,
          fontSize: '10px'
        },
      };
    }
  }

  // Download png,svg and csv data passing and function calling
  public downloadChart(type: any) {
    const legendItems = this.elementRef.nativeElement.querySelectorAll('.apexcharts-legend-series');
    this.dashboardDownload.chartDownload(this.downloadData.responseData, type, legendItems, 'Pipeline revenue - for next  6 months comparison', 'piplelineMonthwiseDiv', this.downloadHeader)
  }

  randomNumber(event: any) {
    // this.random = Math.floor((Math.random() * 1000) + 1);
    // this.chartOptions.chart.toolbar.export.csv.filename = 'Pipeline Revenue - For next 6 Months Comparison';
    // if(event.target.classList.value == 'apexcharts-menu-item exportCSV')
    //   this.initChart(this.responseMonthWise);
  }

}
