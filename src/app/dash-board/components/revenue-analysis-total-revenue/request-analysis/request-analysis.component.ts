import { Component, OnInit, ViewChild, Input, OnChanges, ElementRef, EventEmitter, Output } from '@angular/core';
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
  ApexTheme
} from "ng-apexcharts";
import { AppService } from 'src/app/core-module/service/app.service';
import { TranslatePipe } from 'src/app/core-module/pipes/translate.pipe';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';
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
  theme: ApexTheme;
  colors: string[];
};

@Component({
  selector: 'app-request-analysi',
  templateUrl: './request-analysis.component.html',
  styleUrls: ['./request-analysis.component.scss'],

  providers: [TranslatePipe]
})
export class RequestAnalysisComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: any;
  @Input() reqAnalysis: any;
  @Input() currency: string;
  @Input() selectedIndex: string;
  @Input() activeTab: string = "Monthly"
  @Output() public clickedId =  new EventEmitter();
  public downloadOption: any;
  public downloadHeader: string = 'Monthly';
  chartHeaderTittle: any;
  emptyObj: boolean = true;
  constructor(private dashboardService: DashBoardService, private dashboardDownload: DashboardDownloadService, private appService: AppService, private translate: TranslatePipe, private elementRef: ElementRef) {

  }

  ngOnChanges() {
    if (window.innerWidth < 480) {
      this.chartHeaderTittle = this.appService.chartHeaderTittleMb;
    } else
      this.chartHeaderTittle = this.appService.chartHeaderTittleDf;
    this.downloadHeader = this.selectedIndex === 'monthly' ? 'Monthly' : 'Regions';
    this.downloadOption = this.appService.chartDownloadOption;
    let curYear = new Date().getFullYear();
    let prevYear = (curYear - 1);
    this.emptyObj = Object.keys(this.reqAnalysis).length == 0;
    let selectBoxIndex = {
      "monthly": "month_index",
      // "quarterly": "month_index",
      // "halfyearly": "month_index",
      "regions": "country_code",
      "station": "pos_code",
      "pos_country": "pos_country"
    }

    if (!this.emptyObj) {
      let paymentCompleted = this.reqAnalysis.responseData.map(data => this.dashboardService.kFormatter(data.pay_completed));
      let partialCompleted = this.reqAnalysis.responseData.map(data => this.dashboardService.kFormatter(data.pay_partially_completed));
      let yettoComplete = this.reqAnalysis.responseData.map(data => this.dashboardService.kFormatter(data.yet_2_pay));
      let reportBasedOn = this.reqAnalysis.responseData.map(data => data[selectBoxIndex[this.selectedIndex]]);
      let titleText = this.translate.transform("Revenue Analysis – Total Revenue in");
      this.chartOptions = {
        series: [
          {
            name: "Payment Completed",
            data: paymentCompleted
          },
          {
            name: "Payment Partially Completed",
            data: partialCompleted
          },
          {
            name: "Yet to Make Payment",
            data: yettoComplete
          }
        ],
        chart: {
          type: "bar",
          events: {
            legendClick: (chartContext, seriesIndex, config) => {
              this.onLegendClick(seriesIndex);
            },
          },
          height: 350,
          toolbar: {
            show: false,
            offsetX: 460,
            offsetY: 30,
            tools: {
              download: '<i class="icon-28-chart-download" title="Download Line chart" aria-hidden="true"></i>',
            },
            export: {
              csv: {
                headerCategory: this.activeTab ? this.activeTab : 'Monthly',
                filename: 'Revenue Analysis',
              },
              svg: {
                filename: 'Revenue Analysis'
              },
              png: {
                filename: 'Revenue Analysis'
              }
            }
          },
        },
        legend: {
          onItemClick: {
            toggleDataSeries: true, // Controls the toggling of the data series
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"
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
          categories: reportBasedOn,
          labels: {
            style: {
              fontFamily: 'var(--PRIMARYREGULARFONT)',
              fontWeight: 500,
              fontSize: '10px'
            }
          }
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
          },
          labels: {
            formatter: function (val: any) {
              function intlFormat(val) {
                return new Intl.NumberFormat().format(
                  Math.round(val * 10) / 10
                );
              }
              if (val) {
                if (Number(val) >= 1000000000) {
                  return intlFormat(Number(val) / 1000000000) + 'B';
                } else if (Number(val) >= 1000000) {
                  return intlFormat(Number(val) / 1000000) + 'M';
                } else if (Number(val) >= 1000) {
                  return intlFormat(Number(val) / 1000) + 'k';
                }
              }
              return Number(parseFloat(val)).toLocaleString('en');
            },
            style: {
              fontSize: '10px',
              fontFamily: 'var(--PRIMARYREGULARFONT)',
              fontWeight: 500
            }
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          style: {
            fontFamily: 'var(--PRIMARYREGULARFONT)'
          },
          y: {
            formatter: function (val: any) {
              function intlFormat(val) {
                return new Intl.NumberFormat().format(
                  Math.round(val * 10) / 10
                );
              }
              if (val) {
                if (Number(val) >= 1000000000) {
                  return intlFormat(Number(val) / 1000000000) + 'B';
                } else if (Number(val) >= 1000000) {
                  return intlFormat(Number(val) / 1000000) + 'M';
                } else if (Number(val) >= 1000) {
                  return intlFormat(Number(val) / 1000) + 'k';
                }
              }
              return Number(parseFloat(val)).toLocaleString('en');
            }
          }
        },
        title: {
          "text": titleText + " " + this.currency + " Period: Jan " + curYear + " - Dec " + curYear,
          align: 'left',
          floating: false,
          style: this.chartHeaderTittle
        },
        colors: ['#1d5cac', '#f1a917', '#f73b3c']
      };
    }
  }
  onLegendClick(seriesIndex: number): void {
    this.clickedId.emit(seriesIndex)
  }
  ngOnInit(): void {
  }

  // Download png,svg and csv data passing and function calling
  public downloadChart(type: any) {
    const legendItems = this.elementRef.nativeElement.querySelectorAll('.apexcharts-legend-series');
    this.dashboardDownload.chartDownload(this.reqAnalysis.responseData, type, legendItems, 'Revenue analysis', 'requestAnalysisDivId', this.downloadHeader)
  }

}
