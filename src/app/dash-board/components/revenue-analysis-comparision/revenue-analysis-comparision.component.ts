import { Component, ViewChild, HostListener, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
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
import { TranslatePipe } from 'src/app/core-module/pipes/translate.pipe';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';
import { AppService } from 'src/app/core-module/service/app.service';
import { response } from '../../response.Interface';
import { DashboardDownloadService } from 'src/app/core-module/service/dashboard-download.service';

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
  tooltip: ApexTooltip
};
@Component({
  selector: 'app-revenue-analysis-comparision',
  templateUrl: './revenue-analysis-comparision.component.html',
  styleUrls: ['./revenue-analysis-comparision.component.scss'],
  providers: [TranslatePipe]
})
export class RevenueAnalysisComparisionComponent implements OnInit {

  @Input() public comparisondata: any;
  @Output() public reloadService: EventEmitter<any> = new EventEmitter();
  selectboxbaseddon: boolean;
  basedonval: any;
  basedOn: any;
  activeTab: any = "Monhtly";
  @HostListener('document:click', ['$event']) onDocumentClick() {
    this.selectbox = false;
    this.selectboxbaseddon = false;
  }
  @ViewChild("chart") chart: ChartComponent;
  revAnalysisCmp: response = {};
  public chartOptions: Partial<ChartOptions>;
  loader: boolean = true;
  selectbox: boolean = false;
  options: Array<any> = [];
  selectedVal: string = 'select';
  public downloadData: any;
  public reload: boolean = false;
  chartHeaderTittle: any;
  public downloadOption: any;
  public downloadHeader: string = 'Monthly';
  constructor(private dashboardService: DashBoardService, private dashboardDownload: DashboardDownloadService, private translate: TranslatePipe, private appService: AppService, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.downloadOption = this.appService.chartDownloadOption;

    if (window.innerWidth < 480) {
      this.chartHeaderTittle = this.appService.chartHeaderTittleMb;
    } else
      this.chartHeaderTittle = this.appService.chartHeaderTittleDf;
    this.options = [
      {
        "id": 1,
        "val": "monthly"
      },
      {
        "id": 2,
        "val": "quarterly"
      },
      {
        "id": 3,
        "val": "halfyearly"
      }
    ];
    this.basedOn = [
      {
        "id": 1,
        "info": "Revenue in SGD",
        "val": "Revenue in SGD"
      },
      {
        "id": 2,
        "info": "No of Request",
        "val": "No of Request"
      },
      {
        "id": 3,
        "info": "No of Passenger",
        "val": "No of Passenger"
      }
    ];
    this.basedonval = this.basedOn[0].val;
    // this.ngOnChanges();
  }
  ngOnChanges(): void {
    let curYear: any = new Date().getFullYear();
    let prevYear: any = curYear - 1;
    curYear = curYear.toString();
    prevYear = prevYear.toString();
    // this.comparisondata = {"_DataYr2019":[{"month_index":"JAN","pay_completed":0,"pay_partially_completed":0,"sort_order":1,"year_index":2022,"yet_2_pay":0},{"month_index":"FEB","pay_completed":0,"pay_partially_completed":0,"sort_order":2,"year_index":2022,"yet_2_pay":0},{"month_index":"MAR","pay_completed":0,"pay_partially_completed":0,"sort_order":3,"year_index":2022,"yet_2_pay":0},{"month_index":"APR","pay_completed":0,"pay_partially_completed":0,"sort_order":4,"year_index":2022,"yet_2_pay":0},{"month_index":"MAY","pay_completed":0,"pay_partially_completed":0,"sort_order":5,"year_index":2022,"yet_2_pay":0},{"month_index":"JUN","pay_completed":0,"pay_partially_completed":0,"sort_order":6,"year_index":2022,"yet_2_pay":0},{"month_index":"JUL","pay_completed":0,"pay_partially_completed":0,"sort_order":7,"year_index":2022,"yet_2_pay":0},{"month_index":"AUG","pay_completed":0,"pay_partially_completed":0,"sort_order":8,"year_index":2022,"yet_2_pay":0},{"month_index":"SEP","pay_completed":424210,"pay_partially_completed":0,"sort_order":9,"year_index":2022,"yet_2_pay":656282.96},{"month_index":"OCT","pay_completed":0,"pay_partially_completed":0,"sort_order":10,"year_index":2022,"yet_2_pay":0},{"month_index":"NOV","pay_completed":0,"pay_partially_completed":0,"sort_order":11,"year_index":2022,"yet_2_pay":0},{"month_index":"DEC","pay_completed":58355.05000000001,"pay_partially_completed":0,"sort_order":12,"year_index":2022,"yet_2_pay":8167.81}],"_DataYr2020":[{"month_index":"JAN","pay_completed":7384.55,"pay_partially_completed":0,"sort_order":1,"year_index":2023,"yet_2_pay":5365.4},{"month_index":"FEB","pay_completed":6422.8,"pay_partially_completed":0,"sort_order":2,"year_index":2023,"yet_2_pay":0},{"month_index":"MAR","pay_completed":0,"pay_partially_completed":0,"sort_order":3,"year_index":2023,"yet_2_pay":0},{"month_index":"APR","pay_completed":0,"pay_partially_completed":0,"sort_order":4,"year_index":2023,"yet_2_pay":0},{"month_index":"MAY","pay_completed":0,"pay_partially_completed":0,"sort_order":5,"year_index":2023,"yet_2_pay":0},{"month_index":"JUN","pay_completed":0,"pay_partially_completed":0,"sort_order":6,"year_index":2023,"yet_2_pay":0},{"month_index":"JUL","pay_completed":0,"pay_partially_completed":0,"sort_order":7,"year_index":2023,"yet_2_pay":0},{"month_index":"AUG","pay_completed":0,"pay_partially_completed":0,"sort_order":8,"year_index":2023,"yet_2_pay":0},{"month_index":"SEP","pay_completed":0,"pay_partially_completed":0,"sort_order":9,"year_index":2023,"yet_2_pay":0},{"month_index":"OCT","pay_completed":0,"pay_partially_completed":0,"sort_order":10,"year_index":2023,"yet_2_pay":0},{"month_index":"NOV","pay_completed":0,"pay_partially_completed":0,"sort_order":11,"year_index":2023,"yet_2_pay":0},{"month_index":"DEC","pay_completed":0,"pay_partially_completed":0,"sort_order":12,"year_index":2023,"yet_2_pay":0}],"currency":"BRL"}
    if (this.comparisondata !== undefined) {
      if (this.comparisondata.responseMessage === 'err') {
        this.reload = true;
        this.loader = false;
      } else {
        let reqAnalysisCmp = {
          "reportName": "revenue-analysis",
          "reportBasedOn": "monthly",
          // "startDate":  prevYear+"-01-01 00:00:00",
          // "endDate": curYear+"-01-01 00:00:00",
        };
        this.serviceCall(reqAnalysisCmp);
      }
    }
  }

  reloadItem() {
    this.reloadService.emit('reloadSerevice');
    this.loader = true;
  }

  openSelectBox() {
    this.selectbox = true;
  }
  openSelectBox2() {
    this.selectboxbaseddon = true;
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

  serviceCall(request: any) {
    // this.dashboardService.httpPost('revenue_analysis', request, '').subscribe(data => {
    this.selectedVal = request.reportBasedOn;
    let data = this.comparisondata;
    // let splitArray = this.chunk(data.responseData, 4);
    let _DataYr2019: any = {};
    let _DataYr2020: any = {};
    _DataYr2019.responseData = data._DataYr2019;
    _DataYr2020.responseData = data._DataYr2020;
    let keys = ['pay_completed', 'pay_partially_completed', 'yet_2_pay', 'month_index', 'year_index'];

    let quarterly2019 = this.dashboardService.convertArrayType(_DataYr2019, 3, keys);
    let quarterly2020 = this.dashboardService.convertArrayType(_DataYr2020, 3, keys);

    let halfyearly2019 = this.dashboardService.convertArrayType(_DataYr2019, 6, keys);
    let halfyearly2020 = this.dashboardService.convertArrayType(_DataYr2020, 6, keys);

    let typeObj = {
      'monthly': _DataYr2020.responseData.concat(_DataYr2019.responseData),
      'quarterly': quarterly2020.responseData.concat(quarterly2019.responseData),
      'halfyearly': halfyearly2019.responseData.concat(halfyearly2020.responseData)
    };

    this.loader = false;
    if (this.loader == false)
      this.initChart(typeObj[this.selectedVal]);
    // });
  }


  select(val: string) {
    this.downloadHeader = val === 'monthly' ? 'Monthly' : val === 'quarterly' ? 'Quarterly' : val === 'halfyearly' ? 'Halfyearly' : '';
    this.activeTab = val;
    let curYear: any = new Date().getFullYear();
    let prevYear: any = curYear - 1;
    curYear = curYear.toString();
    prevYear = prevYear.toString();
    let reqAnalysisCmp = {
      "reportName": "revenue-analysis",
      "reportBasedOn": val,
      // "startDate":  prevYear+"-01-01 00:00:00",
      // "endDate": prevYear+"-12-31 23:59:59",
    };
    this.serviceCall(reqAnalysisCmp);
    this.selectbox = false;
  }

  selectBasedon(val: string) {
    this.basedonval = val;
    // let curYear:any = new Date().getFullYear();
    // curYear = curYear.toString();
    // let reqAnalysis = {
    //   "reportName": "revenue-analysis",
    //   "reportBasedOn":val,
    //   "startDate": curYear+"-01-01 00:00:00",
    //   "endDate": curYear+"-12-31 23:59:59"
    // }
    this.selectboxbaseddon = false;
    // this.serviceCall(reqAnalysis);
  }

  initChart(chartData: any) {
    this.downloadData = chartData;
    // get current and previous year values
    let curYear = new Date().getFullYear();
    let prevYear = curYear - 1;

    // getYear wise values
    let getCurYearVal = chartData.filter(data => data['year_index'] == curYear);
    let getPrevYearVal = chartData.filter(data => data['year_index'] == prevYear);

    let titleText = this.translate.transform("Revenue Comparison – Total Revenue in ");

    // get year & request type wise values
    let getCurrPayCompVal = getCurYearVal.map(data => this.dashboardService.kFormatter(data['pay_completed']));
    let getPrevPayCompVal = getPrevYearVal.map(data => this.dashboardService.kFormatter(data['pay_completed']));
    let getCurrPayPartialVal = getCurYearVal.map(data => this.dashboardService.kFormatter(data['pay_partially_completed']));
    let getPrevPayPartialVal = getPrevYearVal.map(data => this.dashboardService.kFormatter(data['pay_partially_completed']));
    let getCurrYetToPayVal = getCurYearVal.map(data => this.dashboardService.kFormatter(data['yet_2_pay']));
    let getPrevYetToPayVal = getPrevYearVal.map(data => this.dashboardService.kFormatter(data['yet_2_pay']));


    // payment completed values
    let paymentComp = [];
    getCurrPayCompVal.map((data: number, index: number) => {
      paymentComp.push(getPrevPayCompVal[index]);
      paymentComp.push(data);
    });

    // payment partial completed values
    let payPartialComp = [];
    getCurrPayPartialVal.map((data: number, index: number) => {
      payPartialComp.push(getPrevPayPartialVal[index]);
      payPartialComp.push(data);
    });

    // payment yet to completed values
    let payYettoComp = [];
    getCurrYetToPayVal.map((data: number, index: number) => {
      payYettoComp.push(getPrevYetToPayVal[index]);
      payYettoComp.push(data);
    });

    // label preparation
    getCurYearVal.map(data => data['label'] = `${data['month_index']} ${data['year_index']}`);
    getPrevYearVal.map(data => data['label'] = `${data['month_index']} ${data['year_index']}`);
    let label: string[] = [];
    getCurYearVal.map((data: any, index: number) => {
      label.push(getPrevYearVal[index]['label']);
      label.push(data['label']);
    });

    this.chartOptions = {
      series: [
        {
          name: "Payment Completed",
          data: paymentComp
        },
        {
          name: "Payment Partially Completed",
          data: payPartialComp
        },
        {
          name: "Yet to Make Payment",
          data: payYettoComp
        }
      ],
      chart: {
        type: "bar",
        height: 350,
        width: '95%',
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
              headerCategory: this.activeTab ? this.activeTab : 'Monthly',
              filename: 'Revenue comparision',
            },
            svg: {
              filename: 'Revenue comparision'
            },
            png: {
              filename: 'Revenue comparision'
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
          horizontal: false,
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
            fontSize: '10px',
            fontWeight: 500,
            fontFamily: 'var(--PRIMARYREGULARFONT)'

          }
        }
      },
      yaxis: {
        title: {
          text: "Amount",
          style: {
            fontFamily: 'var(--PRIMARYREGULARFONT)',
            fontWeight: 600,
            fontSize: '14'
          },
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
            fontWeight: 500,
            fontFamily: 'var(--PRIMARYREGULARFONT)'
          }
        }
      },
      tooltip: {
        style: {
          fontFamily: 'var(--PRIMARYREGULARFONT)'
        },
      },
      legend: {
        position: "bottom",
      },
      fill: {
        opacity: 1
      },
      title: {
        text: titleText + this.comparisondata.currency + " - Yr " + prevYear + " vs Yr " + curYear,
        align: 'left',
        floating: false,
        style: this.chartHeaderTittle
      },
      colors: ['#1d5cac', '#f1a917', '#f73b3c'],
    };

  }

  // Download png,svg and csv data passing and function calling.
  public downloadChart(type: any) {
    const legendItems = this.elementRef.nativeElement.querySelectorAll('.apexcharts-legend-series');
    this.dashboardDownload.chartDownload(this.downloadData, type, legendItems, 'Revenue comparision', 'requestRevenueAnalyDivId', this.downloadHeader)
  }
}
