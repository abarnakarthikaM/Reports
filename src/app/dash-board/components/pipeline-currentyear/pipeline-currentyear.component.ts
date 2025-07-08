import { Component, OnInit, Input, ViewChild, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';

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
import { response } from 'src/app/dash-board/response.Interface';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';
import { TranslatePipe } from 'src/app/core-module/pipes/translate.pipe';
import { DashboardDownloadService } from 'src/app/core-module/service/dashboard-download.service';
import { AppService } from 'src/app/core-module/service/app.service';
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
  colors: string[];
  tooltip: ApexTooltip;
};
@Component({
  selector: 'app-pipeline-currentyear',
  templateUrl: './pipeline-currentyear.component.html',
  styleUrls: ['./pipeline-currentyear.component.scss'],
  providers: [TranslatePipe]
})
export class PipelineCurrentyearComponent implements OnInit {

  @Input() public datacurrentyear: any;
  @Output() public reloadService: EventEmitter<any> = new EventEmitter();
  options: { id: number; info: string; val: string; }[];
  selectedVal: string = 'Select';
  showVal: any;
  activeTab: any;
  constructor(private dashboardService: DashBoardService, private translate: TranslatePipe, private appService: AppService, private dashboardDownload: DashboardDownloadService, private elementRef: ElementRef) { }
  @HostListener('document:click', ['$event']) onDocumentClick() {
    this.selectbox = false;
  }
  loader: boolean = true;
  reload: boolean = false;
  responseMonthWise: response = {};
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public downloadOption: any;
  public downloadData;
  public downloadHeader: string = 'Monthly';
  selectbox: boolean = false;
  dataTochart: any = {};

  ngOnInit(): void {
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
    this.selectedVal = this.options[0].val;
    this.ngOnChanges();
  }
  ngOnChanges(): void {
    // current Date
    let currdate = new Date();

    let newDate = this.dashboardService.dateFormat(currdate);

    // getting six month from now in time stamp
    let sixMonths = currdate.setMonth(currdate.getMonth() + 6);

    let newSixDate = this.dashboardService.dateFormat(new Date(sixMonths));
    let requestMonthWise = {
      "reportName": "pipeline-departure",
      "reportBasedOn": "Revenue in USD",
      "startDate": newDate + ' 00:00:00',
      "endDate": newSixDate + ' 23:59:59'
    }
    if (this.datacurrentyear !== undefined) {
      this.options[0].info = "Revenue in " + this.datacurrentyear.responseAdditionalData.curreny;
      this.downloadHeader = this.options[0].info;
      // this.options[0].val = "Revenue in "+ (this.datacurrentyear?.responseAdditionalData?.curreny !== undefined ? this.datacurrentyear.responseAdditionalData.curreny : 'USD');
      // this.selectedVal = this.options[0].info;
      if (this.datacurrentyear) {
        this.serviceCall(requestMonthWise.reportBasedOn);

      } else {
        this.reload = true;
        this.loader = false;
      }
    }
  }
  openSelectBox() {
    this.selectbox = true;
  }
  select(val: string) {
    this.downloadHeader = val;
    this.selectedVal = val;
    this.activeTab = val;
    this.selectbox = false;
    this.serviceCall(val);
  }
  reloadItem() {
    this.loader = true;
    this.reloadService.emit('reloadSerevice');
  }
  serviceCall(request: any) {
    // this.dashboardService.httpPost('pipeline_departure', request, '').subscribe(data => {
    this.loader = false;
    this.options.map((data: any) => {
      if (data.val === this.selectedVal) {
        this.showVal = data.info;
      }
    });
    let currdata: any = this.datacurrentyear;
    this.selectedVal = request;

    // let keys = ['pay_completed', 'pay_partially_completed', 'yet_2_pay', 'month_index', 'year_index'];
    let data: any = this.dashboardService.convertRequestType(currdata, request);
    this.responseMonthWise = {
      responseData: data.responseData,
      responseMessage: 'ok',
    };
    this.initChart(this.responseMonthWise);
    // });
  }
  initChart(data: any) {
    this.downloadData = data;
    let monthIndex: any = data.responseData.map(data => data['month_index']);
    let yearIndex = data.responseData.map(data => data['year_index']);
    let titleText = this.translate.transform("Pipeline Revenue – For next 6 Months");
    let paymentCompleted;
    let paymentpartialyCompleted;
    let paymentYetToComplete;
    data.responseData.map(data => data['label'] = `${data['month_index']} ${data['year_index']}`);
    let label = data.responseData.map(data => data['label']);
    if (this.selectedVal === this.options[0].val) {
      paymentCompleted = data.responseData.map((data) => this.dashboardService.kFormatter(data['pay_completed']));
      paymentpartialyCompleted = data.responseData.map(data => this.dashboardService.kFormatter(data['pay_partially_completed']));
      paymentYetToComplete = data.responseData.map(data => this.dashboardService.kFormatter(data['yet_2_pay']));
    } else {
      paymentCompleted = data.responseData.map(data => data['pay_completed']);
      paymentpartialyCompleted = data.responseData.map(data => data['pay_partially_completed']);
      paymentYetToComplete = data.responseData.map(data => data['yet_2_pay']);
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
            download: '<i class="icon-28-chart-download" title="Download" aria-hidden="true"></i>',
          },
          export: {
            csv: {
              headerCategory: this.activeTab ? this.activeTab.includes('Revenue in') ? this.options[0].info : this.activeTab : this.options[0]['info'],
              filename: 'Pipeline Revenue - For next  6 Months',
            },
            svg: {
              filename: 'Pipeline Revenue - For next  6 Months'
            },
            png: {
              filename: 'Pipeline Revenue - For next  6 Months'
            }
          }
        },
        zoom: {
          enabled: true
        },
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
        enabled: false
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
      },
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
        }
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
    this.dashboardDownload.chartDownload(this.downloadData.responseData, type, legendItems, 'Pipeline revenue - for next  6 months', 'piplelineCurrYearDiv', this.downloadHeader)
  }
}
