import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';
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
  ApexTitleSubtitle
} from "ng-apexcharts";
import { TranslatePipe } from 'src/app/core-module/pipes/translate.pipe';

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
  title:ApexTitleSubtitle
};
@Component({
  selector: 'app-request-trend-comparision2',
  templateUrl: './request-trend-comparision2.component.html',
  styleUrls: ['./request-trend-comparision2.component.scss'],
  providers:[TranslatePipe]
})
export class RequestTrendComparision2Component implements OnInit {
  @Input() public comparisondata:any;
  @Output() public reloadService : EventEmitter<any> = new EventEmitter();
  @HostListener('document:click', ['$event']) onDocumentClick() {
    this.selectbox = false;
  }
  public reload:boolean = false;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  loader: boolean = true;
  selectbox: boolean = false;
  options: Array<any> = [];
  selectedVal: string = 'select';
  constructor(private dashboardService: DashBoardService) { }

  ngOnInit(): void {

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
    this.ngOnChanges();

  }
  ngOnChanges(): void {
    let curYear:any = new Date().getFullYear();
    let prevYear:any = curYear - 1;
    curYear = curYear.toString();
    prevYear = prevYear.toString();
    let reqTrendCmp = {
      "reportName": "request-trend-comparison",
      "startDate":  prevYear+"-01-01 00:00:00",
      "endDate": curYear+"-12-31 23:59:59",
      "reportBasedOn": "quarterly"
    };
    if(this.comparisondata !== undefined) {
      this.serviceCall(reqTrendCmp);
    }
  }

  reloadItem() {
    this.reloadService.emit('reloadSerevice');
    this.loader = true;
  }

  serviceCall(request: any) {
    this.loader = true;
    if (this.comparisondata.responseMessage === 'err') {
      this.loader = false;
      this.reload = true;
    } else {
      // this.dashboardService.httpPost('request_trend_comparision', request, '').subscribe(data => {

      this.selectedVal = request.reportBasedOn;

      let _data2017:any ={};
      let _data2018:any ={};
      _data2017.responseData = this.comparisondata._data2017;
      _data2018.responseData = this.comparisondata._data2018;
      _data2017.responseData.map(data => data['total_group_request'] = 0);
      _data2018.responseData.map(data => data['total_group_request'] = 0);

      let keys = ['adhoc', 'series', 'total_group_request','month_range','year'];
      if (this.selectedVal == 'quarterly') {
        _data2017 = this.dashboardService.convertArrayType(_data2017, 3, keys);
        _data2018 = this.dashboardService.convertArrayType(_data2018, 3, keys);
      }

      if (this.selectedVal == 'halfyearly'){
        _data2017 = this.dashboardService.convertArrayType(_data2017, 6, keys);
        _data2018 = this.dashboardService.convertArrayType(_data2018, 6, keys);
       }
      let _data = {
        "responseData": _data2017.responseData.concat(_data2018.responseData),
        "responseMessage": "ok"
      }
      this.loader = false;
      if (this.loader == false)
        this.initChart(_data);
      // });

    }
  }
  openSelectBox() {
    this.selectbox = true;
  }
  select(val: string) {
    let curYear:any = new Date().getFullYear();
    let prevYear:any = curYear - 1;
    curYear = curYear.toString();
    prevYear = prevYear.toString();
    let reqTrendCmp = {
      "reportName": "request-trend-comparison",
      "startDate": prevYear+"-01-01 00:00:00",
      "endDate": curYear+"-12-31 23:59:59",
      "reportBasedOn": val
    }
    this.selectbox = false;
    this.serviceCall(reqTrendCmp);
  }
  initChart(chartData: any) {
    // get current and previous year values
    let curYear = new Date().getFullYear();
    let prevYear = curYear - 1;

    // getYear wise values
    let getCurYearVal = chartData.responseData.filter(data => data['year'] == curYear);
    let getPrevYearVal = chartData.responseData.filter(data => data['year'] == prevYear);

    // get year & request type wise values
    let getCurrAdhocVal = getCurYearVal.map(data => data['adhoc']);
    let getPrevAdhocVal = getPrevYearVal.map(data => data['adhoc']);
    let getCurrSeriesVal = getCurYearVal.map(data => data['series']);
    let getPrevSeriesVal = getPrevYearVal.map(data => data['series']);

    // adhoc values
    let adhocVal = [];
    getCurrAdhocVal.map((data: number, index: number) => {
      adhocVal.push(getPrevAdhocVal[index]);
      adhocVal.push(data);
    });

    // series values
    let seriesVal = [];
    getCurrSeriesVal.map((data: number, index: number) => {
      seriesVal.push(getPrevSeriesVal[index]);
      seriesVal.push(data);
    });
    // label preparation
    getCurYearVal.map(data => data['label'] = `${data['month_range']} ${data['year']}`);
    getPrevYearVal.map(data => data['label'] = `${data['month_range']} ${data['year']}`);

    let label: string[] = [];

    getCurYearVal.map((data: any, index: number) => {
      label.push(getPrevYearVal[index]['label']);
      label.push(data['label']);
    });
    this.chartOptions = {
      series: [
        {
          name: "adhoc",
          data: adhocVal
        },
        {
          name: "series",
          data: seriesVal
        }
      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [
        {
          breakpoint: 480,
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
          text: "Requests",
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
      title: {
        text: "Request trend - Comparision Yr " + prevYear + " vs Yr " + curYear,
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
  }

}
