import { Component, ViewChild,ElementRef, OnInit, HostListener, Input, Output, EventEmitter} from '@angular/core';
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
import { AppService } from 'src/app/core-module/service/app.service';
import { TranslatePipe } from 'src/app/core-module/pipes/translate.pipe';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';
import { DashboardDownloadService } from 'src/app/core-module/service/dashboard-download.service';
declare var $: any;
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
  tooltip: ApexTooltip;
  title:ApexTitleSubtitle;
  theme: ApexTheme;
  colors: string[];
};

@Component({
  selector: 'app-request-trend-comparision',
  templateUrl: './request-trend-comparision.component.html',
  styleUrls: ['./request-trend-comparision.component.scss'],
  providers:[TranslatePipe]
})
export class RequestTrendComparisionComponent implements OnInit {

  @Input() public comparisondata:any;
  @Output() public reloadService : EventEmitter<any> = new EventEmitter();
  activeTab: any = "Monthly";
  @HostListener('document:click', ['$event']) onDocumentClick() {
    this.selectbox = false;
  }
  public reload:boolean = false;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public downloadOption: any;
  loader: boolean = true;
  selectbox: boolean = false;
  options: Array<any> = [];
  selectedVal: string = 'select';
  chartHeaderTittle: any;
  downloadData: any;
  seriesItems:any;
  constructor(private dashboardService: DashBoardService,private appService:AppService,  private dashboardDownload: DashboardDownloadService, private translate : TranslatePipe, private elementRef: ElementRef) { }
  ngOnInit() {
 if(window.innerWidth < 480) {
      this.chartHeaderTittle = this.appService.chartHeaderTittleMb;
     } else
      this.chartHeaderTittle = this.appService.chartHeaderTittleDf;
      
    this.downloadOption = this.appService.chartDownloadOption;
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
    // this.ngOnChanges();
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
      "reportBasedOn": "monthly"
    };
    if(this.comparisondata !== undefined) {
      this.serviceCall(reqTrendCmp);
    }
    
  }

  reloadItem() {
    this.loader = true;
    this.reloadService.emit('reloadSerevice');
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

        let keys = ['adhoc', 'series', 'total_group_request','month_range','year','conference','flexible'];
        // if (this.selectedVal == 'quarterly') {
        let _Quadata2017 = this.dashboardService.convertArrayType(_data2017, 3, keys);
        let _Quadata2018 = this.dashboardService.convertArrayType(_data2018, 3, keys);
        // }

        // if (this.selectedVal == 'halfyearly'){
          let _Hlfdata2017 = this.dashboardService.convertArrayType(_data2017, 6, keys);
          let _Hlfdata2018 = this.dashboardService.convertArrayType(_data2018, 6, keys);
        //  }
        
      let typeObj = {
        'monthly': _data2017.responseData.concat(_data2018.responseData),
        'quarterly': _Quadata2017.responseData.concat(_Quadata2018.responseData),
        'halfyearly': _Hlfdata2017.responseData.concat(_Hlfdata2018.responseData),
      };
        this.loader = false;
        if (this.loader == false){
          this.initChart(typeObj[this.selectedVal]);
          
        }
          
          
        // });
    }

  }

  openSelectBox() {
    this.selectbox = true;
  }

  select(val: string) {
    this.activeTab = val;
    let curYear:any = new Date().getFullYear();
    let prevYear:any = curYear - 1;
    curYear = curYear.toString();
    prevYear = prevYear.toString();
    let reqTrendCmp = {
      "reportName": "request-trend-comparison",
      "startDate":  prevYear+"-01-01 00:00:00",
      "endDate": curYear+"-12-31 23:59:59",
      "reportBasedOn": val
    }
    this.selectbox = false;
    this.serviceCall(reqTrendCmp);
  }

  initChart(chartData: any) {
    this.downloadData = chartData;  
    // get current and previous year values
    let curYear = new Date().getFullYear();
    let prevYear = curYear - 1;

    // getYear wise values
    let getCurYearVal = chartData.filter(data => data['year'] == curYear);
    let curYearVal = getCurYearVal[0].year.toString();
    // curYearVal= curYearVal.slice(curYearVal.length-2, curYearVal.length);
  
    let getPrevYearVal = chartData.filter(data => data['year'] == prevYear);
    let prevYearVal = getPrevYearVal[0].year.toString();
    // prevYearVal= prevYearVal.slice(prevYearVal.length-2, prevYearVal.length);
    // get year & request type wise values
    let getCurrTotanNoReqVal = getCurYearVal.map(data => data['total_group_request']);
    let getprevTotanNoReqVal = getPrevYearVal.map(data => data['total_group_request']);
    let getCurrAdhocVal = getCurYearVal.map(data => data['adhoc']);
    let getPrevAdhocVal = getPrevYearVal.map(data => data['adhoc']);
    let getCurrSeriesVal = getCurYearVal.map(data => data['series']);
    let getPrevSeriesVal = getPrevYearVal.map(data => data['series']);

    let getCurrflexibleVal = getCurYearVal.map(data => data['flexible']);
    let getPrevflexibleVal = getPrevYearVal.map(data => data['flexible']);

    let getCurrConferenceVal = getCurYearVal.map(data => data['conference']);
    let getPrevConferenceVal = getPrevYearVal.map(data => data['conference']);

     // Total no values Prev year
     let totalNoValPrev = [];
     getCurrTotanNoReqVal.map((data: number, index: number) => {
      totalNoValPrev.push(getprevTotanNoReqVal[index]);
      totalNoValPrev.push(0);
     });
     // total no of values Current year
     let totalNoValcurnt = [];
     getCurrTotanNoReqVal.map((data: number, index: number) => {
      totalNoValcurnt.push(0);
      totalNoValcurnt.push(data);
     });

    // adhoc values Prev year
    let adhocValPrev = [];
    getCurrAdhocVal.map((data: number, index: number) => {
      adhocValPrev.push(getPrevAdhocVal[index]);
      adhocValPrev.push(0);
    });
    // adhoc values Current year
    let adhocValsCurnt = [];
    getCurrAdhocVal.map((data: number, index: number) => {
      adhocValsCurnt.push(0);
      adhocValsCurnt.push(data);
    });
    // series values prev year
    let seriesValPrev = [];
    getCurrSeriesVal.map((data: number, index: number) => {
      seriesValPrev.push(getPrevSeriesVal[index]);
      seriesValPrev.push(0);
    });
    // series values Current year 
      let seriesValCurnt = [];
      getCurrSeriesVal.map((data: number, index: number) => {
        seriesValCurnt.push(0);
        seriesValCurnt.push(data);
      });
    // flexible values prev year
    let flexiValPrev = [];
    getCurrflexibleVal.map((data: number, index: number) => {
      flexiValPrev.push(getPrevflexibleVal[index]);
      flexiValPrev.push(0);
    });
    // flexible values curnt year
    let flexiValCurnt = [];
    getCurrflexibleVal.map((data: number, index: number) => {
      flexiValCurnt.push(0);
      flexiValCurnt.push(data);
    });

    // Confernce values prev year
    let conferenceValPrev = [];
    getCurrConferenceVal.map((data: number, index: number) => {
      conferenceValPrev.push(getPrevConferenceVal[index]);
      conferenceValPrev.push(0);
    })
    // Confernce values current year
    let conferenceValCurnt = [];
      getCurrConferenceVal.map((data: number, index: number) => {
        conferenceValCurnt.push(0);
        conferenceValCurnt.push(data);
      })
    // label preparation
    getCurYearVal.map(data => data['label'] = `${data['month_range']} ${data['year']}`);
    getPrevYearVal.map(data => data['label'] = `${data['month_range']} ${data['year']}`);
    let label: string[] = [];
    let titleText =  this.translate.transform("Request Trend – Comparison");
    getCurYearVal.map((data: any, index: number) => {
      label.push(getPrevYearVal[index]['label']);
      label.push(data['label']);
    });
    var airlineCode = sessionStorage.getItem("themeCode")
    if (airlineCode == 'WN') {
      this.seriesItems = [
        {
          name: 'Instant quote-' + prevYearVal,
          data: adhocValPrev,
        },
        {
          name: "Flexible-" + prevYearVal,
          data: flexiValPrev
        },
        {
          name: "Instant quote-" + curYearVal,
          data: adhocValsCurnt,
        },
        {
          name: "Flexible-" + curYearVal,
          data: flexiValCurnt
        },
      ];
    } else {
      this.seriesItems = [
        {
          name: 'Adhoc-' + prevYearVal,
          data: adhocValPrev,
        },
        {
          name: 'Series-' + prevYearVal,
          data: seriesValPrev,
        },
        {
          name: "Conference-" + prevYearVal,
          data: conferenceValPrev,
        },
        {
          name: "Flexible-" + prevYearVal,
          data: flexiValPrev,
        },
        {
          name: "Adhoc-" + curYearVal,
          data: adhocValsCurnt,
        },
        {
          name: "Series-" + curYearVal,
          data: seriesValCurnt,
        },
        {
          name: "Conference-" + curYearVal,
          data: conferenceValCurnt,
        },
        {
          name: "Flexible-" + curYearVal,
          data: flexiValCurnt,
        },
      ];
    }
    
   
    this.chartOptions = {
      series: this.seriesItems,
      chart: {
        type: "bar",
        height: 350,
        width:'95%',
        stacked: true,
        toolbar: {
          show: true,
          offsetX: 0,
          offsetY: 30,
          tools: {
            download:'<i class="icon-15-download" title="Download" aria-hidden="true"></i>',
          },
          export: {
            csv: {
              headerCategory: this.activeTab ? this.activeTab : 'Monthly',
              filename: 'Request trend comparision',
            },
            svg: {
              filename: 'Request trend comparision'
            },
            png: {
              filename: 'Request trend comparision'
            }
          }
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
          horizontal: true,
          distributed: false
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
          formatter: function (val:any) {
            return  val;
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
          formatter: function (val:any) {
            return  val;
          },
        },
        axisBorder: {
          show: true,
          color: '#78909C',
          offsetX: 0,
          offsetY: 0
        },
        title: {
          text: "Period",
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
      tooltip: {
        style: {
          fontFamily: 'var(--PRIMARYREGULARFONT)'
        },
      },
      legend: {
        labels: {
          colors: 'var(--TXTBLACK)',
          useSeriesColors: false
        }
      },
      colors:airlineCode=='WN' ?['#1b5cac','#06b25c', '#6C0BA9','#0a0a7c','#6fdd6f','#a6c']:['#1d5cac','#06b25c', '#ffb520', '#f73d3e', '#6C0BA9','#0a0a7c','#6fdd6f','#dd9f21', '#cb4647', '#a6c'],
      title: {
        text: titleText +" Yr " + prevYear + " vs Yr " + curYear,
        //  +" Yr " + prevYear + " vs Yr " + curYear,
        align: 'left',
        floating: false,
        style: this.chartHeaderTittle
      },
    };
  }

  // For customized download implementation purpose for request trend year comparision
  public header: any=[];
  public downloadChart(type: any) {
    console.log(this.downloadData);
    // console.log(type);
    // const legendItems = this.elementRef.nativeElement.querySelectorAll('.apexcharts-legend-series');
    // this.dashboardDownload.chartDownload(this.downloadData, type, legendItems, 'Request-Trend-Year-comparision')

      let csvTempData = JSON.parse(JSON.stringify(this.downloadData));
    const legendItems = this.elementRef.nativeElement.querySelectorAll('.apexcharts-legend-series');
    const disabledLegendNames: any = [];

    // Unselected items push into one variable
    legendItems.forEach((legendItem: HTMLElement) => {
      if (legendItem.classList.contains('apexcharts-inactive-legend')) {
        const legendName = legendItem.getAttribute('seriesname');
        disabledLegendNames.push(legendName);
      }
    });

    // Deleted from the unselected items in object for png and svg
    csvTempData.forEach((entry: any) => {
      disabledLegendNames.forEach((disabledName: any) => {
        delete entry[disabledName];
      });
    });
    console.log(disabledLegendNames);
    console.log(csvTempData);
    
    // Deleted from the unselected items in object for csv
    csvTempData.map((data: any) => {
      Object.keys(data).forEach((key: any) => {
        disabledLegendNames.forEach((disabledName: any) => {
          if (key == 'total_group_request' && disabledName == 'Noxofxrequestx23' || key == 'adhoc' && disabledName == 'adhocx23' || key == 'series' && disabledName == 'seriesx23' || key == 'conference' && disabledName == 'conferencex23' || key == 'flexible' && disabledName == 'Flexiblex23' 
            ||key == 'total_group_request' && disabledName == 'Noxofxrequestx24' || key == 'adhoc' && disabledName == 'adhocx24' || key == 'series' && disabledName == 'seriesx24' || key == 'conference' && disabledName == 'conferencex24' || key == 'flexible' && disabledName == 'Flexiblex24') {
            delete data[key]
            if (data[key] === undefined || data[key] === 'undefined undefined') {
              delete data[key];
            }
          }
        });
      });
    });

    // Request header framing for csv download
    this.header = [];
    let downloadResponseData = csvTempData.map((data) => {
      this.header.push("Monthly");
        if (data.total_group_request) {
          this.header.push("No of request")
        }
        if (data.adhoc) {
          this.header.push("Adhoc");
        }
        if (data.series) {
          this.header.push("Series");
        }
        if (data.conference) {
          this.header.push("Conference");
        }
        if (data.flexible) {
          this.header.push("Flexible");
        }
      // }else if(data.year == 2024){
        // if (data.total_group_request) {
        //   this.header.push("No of request-24")
        // }
        // if (data.adhoc) {
        //   this.header.push("Adhoc-24");
        // }
        // if (data.series) {
        //   this.header.push("Series-24");
        // }
        // if (data.conference) {
        //   this.header.push("Conference-24");
        // }
        // if (data.flexible) {
        //   this.header.push("Flexible-24");
        // }
    
      this.header = [...new Set(this.header)];
      const datas = { "Monthly": data.month_range +' '+ data.year, "No of request": data.total_group_request, "Adhoc": data.adhoc, "Series": data.series, "Conference": data.conference, "Flexible": data.flexible,}
      // "No of request-24": data.total_group_request, "Adhoc-24": data.adhoc, "Series-24": data.series, "Conference-24": data.conference, "Flexible-24": data.flexible
      // const datas = {"Monthly": data.month_range +' '+ data.year,"No of request": data.total_group_request }
      // const datas = { "Monthly": data.month_range +' '+ data.year, "No of request": data.total_group_request, "Adhoc": data.adhoc, "Series": data.series, "Conference": data.conference, "Flexible": data.flexible }
      // this.header = ["Monthly","No of request","Adhoc", "Series","Conference","Flexible"]
      return datas;
    })
    this.dashboardService.downloadFile(downloadResponseData, this.header, 'Request trend period', type, 'requestTrendYearDivId');
  }
}
