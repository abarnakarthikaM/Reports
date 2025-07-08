import { Component, ViewChild, OnInit, HostListener, ElementRef } from '@angular/core';
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
  ApexYAxis,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexTheme
} from "ng-apexcharts";
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  fill: ApexFill;
  title: ApexTitleSubtitle,
  theme: ApexTheme;
  colors: string[];
};

import { response } from 'src/app/dash-board/response.Interface';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';
import { TranslatePipe } from 'src/app/core-module/pipes/translate.pipe';
import { AppService } from 'src/app/core-module/service/app.service';
import { DashboardDownloadService } from 'src/app/core-module/service/dashboard-download.service';

@Component({
  selector: 'app-pipeline-station',
  templateUrl: './pipeline-station.component.html',
  styleUrls: ['./pipeline-station.component.scss'],
  providers: [TranslatePipe]
})
export class PipelineStationComponent implements OnInit {

  selectbox: boolean = false;
  options: { id: number; info: string; val: string; }[];
  selectedVal: string;
  showVal: string = 'Select';
  activeTab: any;
  @HostListener('document:click', ['$event']) onDocumentClick() {
    this.selectbox = false;
    // this.selectboxbaseddon = false;
  }
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public downloadOption: any;
  public downloadData;
  public downloadHeader: any;
  loader: boolean = true;
  reload: boolean = false;

  constructor(private dashboardService: DashBoardService, private translate: TranslatePipe, private appService: AppService, private dashboardDownload: DashboardDownloadService, private elementRef: ElementRef) { }

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
    this.serrviceData();
  }

  openSelectBox() {
    this.selectbox = true;
  }

  select(val: string) {
    this.downloadHeader = val;
    this.activeTab = val;
    this.serrviceData();
    this.loader = true;
    this.selectedVal = val;
    this.selectbox = false;
  }

  reloadItem() {
    this.reload = false;
    this.loader = true;
    this.serrviceData();
  }
  serrviceData() {
    let currdate = new Date();

    let newDate = this.dashboardService.dateFormat(currdate);

    // getting six month from now in time stamp
    let sixMonths = currdate.setMonth(currdate.getMonth() + 6);

    let newSixDate = this.dashboardService.dateFormat(new Date(sixMonths));
    let requestTravelAgent = {
      "reportName": "pipeline-departure",
      "reportBasedOn": "top-stations",
      "startDate": newDate + ' 00:00:00',
      "endDate": newSixDate + ' 23:59:59'
    }
    this.serviceCall(requestTravelAgent);
  }

  async serviceCall(request: any) {
    var data = await this.appService.pipelineDepartureRequest(request).toPromise();
    this.options[0].info = "Revenue in " + (data?.response?.data?.responseAdditionalData?.curreny !== undefined ? data.response.data.responseAdditionalData.curreny : 'USD');
    if (this.downloadHeader == undefined)
      this.downloadHeader = this.options[0].info;
    // this.options[0].val = "Revenue in "+ (data?.response?.data?.responseAdditionalData?.curreny !== undefined ? data.response.data.responseAdditionalData.curreny : 'USD');
    this.options.map((data: any) => {
      if (data.val === this.selectedVal) {
        this.showVal = data.info;
      }
    });
    if (data.response.Message !== 'Success') {
      this.reload = true;
      this.loader = false;
    } else {
      this.loader = true;
      let reportData: any = this.dashboardService.convertRequestType(data.response.data, this.selectedVal);
      this.initChart(reportData);
    }
  }

  initChart(chartData: response) {
    this.downloadData = chartData;
    // get year & request type wise values
    let pay_completed: any;
    let pay_partially_completed: any;
    let yet_2_pay: any;
    if (this.selectedVal === this.options[0].val) {
      pay_completed = chartData.responseData.map(data => this.dashboardService.kFormatter(data['pay_completed'])).slice(0, 10);
      pay_partially_completed = chartData.responseData.map(data => this.dashboardService.kFormatter(data['pay_partially_completed'])).slice(0, 10);
      yet_2_pay = chartData.responseData.map(data => this.dashboardService.kFormatter(data['yet_2_pay'])).slice(0, 10);
    } else {
      pay_completed = chartData.responseData.map(data => data['pay_completed']).slice(0, 10);
      pay_partially_completed = chartData.responseData.map(data => data['pay_partially_completed']).slice(0, 10);
      yet_2_pay = chartData.responseData.map(data => data['yet_2_pay']).slice(0, 10);
    }
    let label = chartData.responseData.map(data => data['pos_code']).slice(0, 10);
    let titleText = this.translate.transform("Pipeline Revenue – Top Stations");
    this.loader = false;

    this.chartOptions = {
      series: [
        {
          name: "Payment completed",
          data: pay_completed
        },
        {
          name: "Payment partially completed",
          data: pay_partially_completed
        },
        {
          name: "Yet to Make Payment",
          data: yet_2_pay
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
            png: {
              filename: 'Pipeline Revenue - Top stations',
            },
            svg: {
              filename: 'Pipeline Revenue - Top stations',
            },
            csv: {
              headerCategory: this.activeTab ? this.activeTab.includes('Revenue in') ? this.options[0].info : this.activeTab : this.options[0]['info'],
              filename: 'Pipeline Revenue - Top stations',
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
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        type: "category",
        categories: label,
      },
      yaxis: {
        show: true,
        labels: {
          style: {
            colors: 'var(--TXTBLACK)',
            fontFamily: 'var(--PRIMARYREGULARFONT)',
            fontWeight: 500,
            fontSize: '10px'
          },
        },
        axisBorder: {
          show: true,
          color: '#78909C',
          offsetX: 0,
          offsetY: 0
        },
        title: {
          text: "Stations",
          offsetX: 5,
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
      legend: {
        labels: {
          colors: 'var(--TXTBLACK)',
          useSeriesColors: false
        }
      },
      colors: ['#1d5cac', '#f1a917', '#f73b3c'],
      title: {
        text: titleText,
        align: 'left',
        floating: false,
        style: {
          color: 'var(--TXTBLACK)',
          fontSize: '14px',
          fontWeight: 600,
          fontFamily: 'var(--PRIMARYREGULARFONT)',
        }
      },
    };
    if (this.selectedVal.includes("Revenue in") || this.selectedVal === this.options[1].val || this.selectedVal === this.options[2].val) {
      this.chartOptions.xaxis.labels = {
        style: {
          colors: 'var(--TXTBLACK)',
          fontFamily: 'var(--PRIMARYREGULARFONT)',
          fontWeight: 500,
          fontSize: '10px'
        },
        formatter(val: any) {
          function intlFormat(val) {
            return new Intl.NumberFormat().format(Math.round(val * 10) / 10);
          }
          if (val >= 1000000000) return intlFormat(val / 1000000000) + 'B';
          if (val >= 1000000) return intlFormat(val / 1000000) + 'M';
          if (val >= 1000) return intlFormat(val / 1000) + 'k';
          return intlFormat(val);
        }
      },
        this.chartOptions.tooltip = {
          style: {
            fontFamily: 'var(--PRIMARYREGULARFONT)'
          },
          y: {
            formatter(val: any) {
              function intlFormat(val) {
                return new Intl.NumberFormat().format(Math.round(val * 10) / 10);
              }
              if (val >= 1000000000) return intlFormat(val / 1000000000) + 'B';
              if (val >= 1000000) return intlFormat(val / 1000000) + 'M';
              if (val >= 1000) return intlFormat(val / 1000) + 'k';
              return intlFormat(val);
            }
          }
        }
    } else {
      this.chartOptions.xaxis.labels = {
        style: {
          colors: 'var(--TXTBLACK)',
          fontFamily: 'var(--PRIMARYREGULARFONT)',
          fontWeight: 500,
          fontSize: '10px'
        }
      }
    }
  }

  // Download png,svg and csv data passing and function calling
  public downloadChart(type: any) {
    const legendItems = this.elementRef.nativeElement.querySelectorAll('.apexcharts-legend-series');
    this.dashboardDownload.chartDownload(this.downloadData.responseData, type, legendItems, 'Pipeline revenue - top stations', 'pipelineStationDiv', this.downloadHeader)
  }
}
