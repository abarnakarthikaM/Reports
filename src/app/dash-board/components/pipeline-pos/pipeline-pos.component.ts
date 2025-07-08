import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { response } from 'src/app/dash-board/response.Interface';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexTitleSubtitle,
  ApexNoData,
  ApexTheme
} from "ng-apexcharts";
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';
import { AppService } from 'src/app/core-module/service/app.service';
import { DashboardDownloadService } from 'src/app/core-module/service/dashboard-download.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  noData: ApexNoData;
  theme: ApexTheme;
  colors: string[];
};
@Component({
  selector: 'app-pipeline-pos',
  templateUrl: './pipeline-pos.component.html',
  styleUrls: ['./pipeline-pos.component.scss']
})
export class PipelinePosComponent implements OnInit {
  loader: boolean = true;
  reload: boolean = false;
  responseRegionWise: response = {};
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
  public downloadHeader;
  public downloadData;
  constructor(private dashboardService: DashBoardService, private appService: AppService, private dashboardDownload: DashboardDownloadService, private elementRef: ElementRef) { }


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
  serrviceData() {
    let currdate = new Date();

    let newDate = this.dashboardService.dateFormat(currdate);

    // getting six month from now in time stamp
    let sixMonths = currdate.setMonth(currdate.getMonth() + 6);

    let newSixDate = this.dashboardService.dateFormat(new Date(sixMonths));

    let requestRegionWise = {
      "reportName": "pipeline-departure",
      "reportBasedOn": "pos-country",
      // "reportBasedOn": "regions",
      "startDate": newDate + ' 00:00:00',
      "endDate": newSixDate + ' 23:59:59'
    };

    this.serviceCall(requestRegionWise);
  }

  reloadItem() {
    this.serrviceData();
  }

  openSelectBox() {
    this.selectbox = true;
  }

  select(val: string) {
    this.downloadHeader = val;
    this.activeTab = val;
    this.selectedVal = val;
    this.selectbox = false;
    this.serrviceData();
  }

  async serviceCall(request: any) {
    this.loader = true;
    var data = await this.appService.pipelineDepartureRequest(request).toPromise()
    let currenyFormat = data?.response?.data?.responseAdditionalData?.curreny !== undefined ? data.response.data.responseAdditionalData.curreny : 'USD';
    this.options[0].info = "Revenue in " + currenyFormat;
    if (this.downloadHeader == undefined) {
      this.downloadHeader = this.options[0].info
    }
    // this.options[0].val = "Revenue in "+ currenyFormat;
    this.options.map((data: any) => {
      if (data.val === this.selectedVal) {
        this.showVal = data.info;
      }
    });
    this.loader = false;
    if (data.response.Message !== 'Success') {
      this.reload = true;
    } else {
      let regionwise = JSON.parse(JSON.stringify(data.response.data));
      let reportData: any = this.dashboardService.convertRequestType(regionwise, this.selectedVal);
      this.loader = false;
      this.responseRegionWise = reportData;
      if (this.responseRegionWise.responseData.length > 0)
        this.initChart(this.responseRegionWise);
    }
  }


  initChart(data: any) {
    this.downloadData = data;
    let paymentCompleted;
    let paymentpartialyCompleted;
    let paymentYetToComplete;
    let label = data.responseData.map((data: any) => data['pos_country']);
    // let label = data.responseData.map((data:any) => data['country_code']);
    if (this.selectedVal === "Revenue in " + data?.response?.data?.responseAdditionalData?.curreny ? data.response.data.responseAdditionalData.curreny : 'USD') {
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
        toolbar: {
          show: false,
          offsetX: 0,
          offsetY: 30,
          tools: {
            download: '<i class="icon-28-chart-download" title="Download" aria-hidden="true"></i>',
          },
          export: {
            png: {
              filename: 'Pipeline revenue - POS country wise'
            },
            svg: {
              filename: 'Pipeline revenue - POS country wise'
            },
            csv: {
              headerCategory: this.activeTab ? this.activeTab.includes('Revenue in') ? this.options[0].info : this.activeTab : this.options[0]['info'],
              filename: 'Pipeline revenue - POS country wise',
            }
          }
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          // endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: label
      },
      yaxis: {
        title: {
          text: "Amount",
          style: {
            color: 'var(--TXTBLACK)',
            fontFamily: 'var(--PRIMARYREGULARFONT)',
            fontWeight: 600,
            fontSize: '14'
          }
        }
      },
      tooltip: {
        style: {
          fontFamily: 'var(--PRIMARYREGULARFONT)'
        },
      },
      fill: {
        opacity: 1
      },
      colors: ['#1d5cac', '#f1a917', '#f73b3c'],
      title: {
        "text": "Pipeline Revenue - POS Country Wise",
        align: 'left',
        floating: false,
        style: {
          color: 'var(--TXTBLACK)',
          fontSize: '14px',
          fontWeight: 600,
          fontFamily: 'var(--PRIMARYREGULARFONT)',
        }
      }
    };
    if (this.selectedVal.includes("Revenue in") || this.selectedVal === this.options[1].info || this.selectedVal === this.options[2].info) {
      function intlFormat(val) {
        return new Intl.NumberFormat().format(Math.round(val * 10) / 10);
      }
      this.chartOptions.yaxis.labels = {
        formatter(val: any) {
          if (val >= 1000000000) return intlFormat(val / 1000000000) + 'B';
          if (val >= 1000000) return intlFormat(val / 1000000) + 'M';
          if (val >= 1000) return intlFormat(val / 1000) + 'k';
          return intlFormat(val);
        },
      };
    }
  }

  // Download png,svg and csv data passing and function calling
  public downloadChart(type: any) {
    const legendItems = this.elementRef.nativeElement.querySelectorAll('.apexcharts-legend-series');
    this.dashboardDownload.chartDownload(this.downloadData.responseData, type, legendItems, 'Pipeline revenue - POS country wise', 'pipelinePosDiv', this.downloadHeader)
  }
}
