import { Component, OnInit, ElementRef, ViewChild, HostListener} from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexYAxis,
  ApexTooltip,
  ApexMarkers,
  ApexXAxis,
  ApexPlotOptions,
  ApexTitleSubtitle,
  ApexLegend,
  ApexTheme
} from "ng-apexcharts";
import { TranslatePipe } from 'src/app/core-module/pipes/translate.pipe';
import { AppService } from 'src/app/core-module/service/app.service';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';
import { response } from '../../response.Interface';
import { DashboardDownloadService } from 'src/app/core-module/service/dashboard-download.service';


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  labels: string[];
  stroke: any; // ApexStroke;
  markers: ApexMarkers;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  tooltip: ApexTooltip;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  theme: ApexTheme;
  colors: string[];
};
@Component({
  selector: 'app-request-trend-year',
  templateUrl: './request-trend-year.component.html',
  styleUrls: ['./request-trend-year.component.scss'],
  providers:[TranslatePipe]
})
export class RequestTrendYearComponent implements OnInit {
  public reload:boolean = false;
  showVal: string;
  activeTab: string;
  @HostListener('document:click', ['$event']) onDocumentClick() {
    this.selectbox = false;
  }

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public downloadOption: any;
  public downloadHeader:string = 'Monthly';
  reqTrendVal: response = {};
  textColor: string = 'var(--TXTBLACK)';
  options: Array<any>=[];
  selectbox: boolean = false;
  selectedVal: string = 'select';
  chartHeaderTittle: any;
  seriesItems:any;
  responseData:any;
  constructor(private dashboardSevice: DashBoardService, private dashboardDownload: DashboardDownloadService,  private translate : TranslatePipe,private appService:AppService, private elementRef: ElementRef ) { }
  loader: boolean = true;
  ngOnInit() {
    this.downloadOption = this.appService.chartDownloadOption;

    if(window.innerWidth < 480) {
      this.chartHeaderTittle = this.appService.chartHeaderTittleMb;
     } else
      this.chartHeaderTittle = this.appService.chartHeaderTittleDf;
     
    this.options = [
      {
        "id": 1,
        "info":"monthly",
        "val":"monthly"
      },
      {
        "id": 2,
        "info": "regions",
        "val": "regions"
      }
      // {
      //   "info": "pos country",
      //   "id": 3,
      //   "val": "pos_country"
      // },
      // {
      //   "info": "station",
      //   "id": 4,
      //   "val": "station"
      // }
    ];
   this.serviceData();

  }


  serviceData(){
    let curYear:any = new Date().getFullYear();
    let prevYear:any = curYear - 1;
    curYear = curYear.toString();
    prevYear = prevYear.toString();
    let reqTrendYear = {
      "reportName": "request-trend",
      "startDate": curYear+"-01-01 00:00:00",
      "endDate": curYear+"-12-31 23:59:59",
      "reportBasedOn": "monthly"
    };
    this.serviceCall(reqTrendYear);
  }

  openSelectBox() {
    this.selectbox = true;
  }
  async serviceCall(request: any) {
    let curYear:any = new Date().getFullYear();
    this.loader = true;
    var data = await this.appService.trendYearRequest(request).toPromise()
    this.responseData = data.response
    if( data.status === 200 && data.response.Message === "Success") {
        this.selectedVal = request.reportBasedOn;
        this.options.map((data:any)=>{
          if (data.val === this.selectedVal ) {
            this.showVal = data.info;
          }
        });
        data?.response?.data?.map(item => item['year_index'] = curYear);
        let keys = ['adhoc', 'series', 'total_group_request', 'requested_month','year_index'];
        if (this.selectedVal == 'quarterly')
          data = this.dashboardSevice.convertArrayType(data,3,keys);
        if (this.selectedVal == 'halfyearly')
        data.response.data = this.dashboardSevice.convertArrayType(data, 6, keys);

        let index = {
          "regions": "country_code",
          "monthly": "requested_month",
          // "quarterly": "requested_month",
          // "halfyearly": "requested_month",
          "pos_country": "pos_country",
          "station":"pos_code"
        };
        this.loader = false;
        if (this.loader == false){
          this.initChart(data.response, index[request.reportBasedOn]);
        }
      } 
     
      else{
        this.loader = false;
        this.reload = true;
      }
  }


  select(val: string) {
    this.downloadHeader = val === 'monthly' ? 'Monthly' : 'Regions';
    let curYear:any = new Date().getFullYear();
    let prevYear:any = curYear - 1;
    curYear = curYear.toString();
    prevYear = prevYear.toString();
    this.activeTab = val;
    let reqTrendYear = {
      "reportName": "request-trend",
      "startDate": curYear+"-01-01 00:00:00",
      "endDate": curYear+"-12-31 23:59:59",
      "reportBasedOn": val
    }
    this.serviceCall(reqTrendYear);
    this.selectbox = false;
  }

  reloadItem(){
    this.serviceData();
  }
 


  initChart(chartData: any, labelIndex: string ='requested_month') {
    let curYear = new Date().getFullYear();
    // get request & Month inforamtion in Array format
    let getAdhocVal = chartData.data.map(data => { return data['adhoc'] !== undefined ? data['adhoc'] : 0 });
    let getSeriesVal = chartData.data.map(data => { return data['series'] !== undefined ? data['series'] : 0; });
    let getflexibleVal = chartData.data.map(data => { return data['flexible'] !== undefined ? data['flexible'] : 0;});
    let getConferenceVal = chartData.data.map(data => { return data['conference'] !== undefined ? data['conference'] : 0;});
    let getNoOfReqVal = chartData.data.map(data => { return data['total_group_request'] !== undefined ? data['total_group_request']: 0; });
    let label = chartData.data.map(data => data[labelIndex]);
    let titleText = this.translate.transform("Request Trend – Period");
    var airlineCode=sessionStorage.getItem("themeCode")
    if(airlineCode =='WN'){
      this.seriesItems = [
        {
          name: "No of request",
          type: "column",
          data: getNoOfReqVal
        },
        {
          name: "Instant quote",
          type: "line",
          data: getAdhocVal
        },
        {
          name: "Flexible",
          type: "line",
          data: getflexibleVal
        }
      ]
    }else if(airlineCode =='JA'){
      this.seriesItems = [
        {
          name: "No of request",
          type: "column",
          data: getNoOfReqVal
        },
        {
          name: "Adhoc",
          type: "line",
          data: getAdhocVal
        },
        {
          name: "Series",
          type: "line",
          data: getSeriesVal
        },
        {
          name: "Flexible",
          type: "line",
          data: getflexibleVal
        }
      ]
    }else{
      this.seriesItems = [
        {
          name: "No of request",
          type: "column",
          data: getNoOfReqVal
        },
        {
          name: "Adhoc",
          type: "line",
          data: getAdhocVal
        },
        {
          name: "Series",
          type: "line",
          data: getSeriesVal
        },
        {
          name: "Conference",
          type: "line",
          data: getConferenceVal
        },
        {
          name: "Flexible",
          type: "line",
          data: getflexibleVal
        }
      ]
    }
    this.chartOptions = {
      series: this.seriesItems,
      chart: {
        height: 350,
        width:'95%',
        type: "line",
        stacked: false,
        toolbar: {
          show: false,
          offsetX: 0,
          offsetY: 30,
          tools: {
            download:'<i class="icon-28-chart-download" title="Download" aria-hidden="true"></i>',
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false
          },
          export: {
            csv: {
              headerCategory: this.activeTab ? this.activeTab : 'Monthly',
              filename: 'Request trend period'
            },
            svg: {
              filename: 'Request trend period'
            },
            png: {
              filename: 'Request trend period'
            }

          }
        }
      },
      stroke: {
        width: [0, 2, 2, 2, 2],
        curve: "straight",
      },
      plotOptions: {
        bar: {
          columnWidth: "50%"
        }
      },
      fill: {
        colors: ['#2268c0', '#2eba9d', '#fdb336'],
        opacity: [1, 1, 1, 1, 1],
        gradient: {
          inverseColors: false,
          shade: "light",
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100, 100]
        }
      },
      labels: label,
      legend: {
        fontFamily: 'var(--PRIMARYREGULARFONT)',
        fontWeight: 500,
        fontSize: '10px',
        markers: {
          fillColors: ['#2268c0', '#2eba9d', '#fdb336']
        }
      },
      markers: {
        size: 0
      },
      xaxis: {
        type: "category",
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
        title: {
          text: "Requests",
          style: {
            color: 'var(--TXTBLACK)',
            fontFamily: 'var(--PRIMARYREGULARFONT)',
            fontWeight: 600,
            fontSize: '14'
          },
        },
        labels: {
          style: {
            fontFamily: 'var(--PRIMARYREGULARFONT)',
            fontWeight: 500,
            fontSize: '10px',
            colors: 'var(--TXTBLACK)'
          }
        },
        min: 0
      },
      title: {
        text: titleText + '  - Jan  ' + curYear + " - Dec " + curYear,
        align: 'left',
        floating: false,
        style: this.chartHeaderTittle
      },
      // colors: ['#1b5cac', '#06b25c', '#ffb530', '#f73d3e','#6C0BA9'],
      colors:airlineCode =='WN' ?['#1b5cac', '#06b25c', '#6C0BA9']: airlineCode =='JA'?['#1b5cac', '#06b25c', '#ffb530','#6C0BA9'] : ['#1b5cac', '#06b25c', '#ffb530', '#f73d3e','#6C0BA9'],
      tooltip: {
        shared: true,
        intersect: false,
        style: {
          fontFamily: 'var(--PRIMARYREGULARFONT)'
        },
        y: {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Requests";
            }
            return y;
          }
        }
      }
    };
     
  }

  public generateData(count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = "w" + (i + 1).toString();
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y
      });
      i++;
    }
    return series;
  }
  // Download png,svg and csv data passing and function calling
  public downloadChart(type: any) {
    const legendItems = this.elementRef.nativeElement.querySelectorAll('.apexcharts-legend-series');
    this.dashboardDownload.chartDownload(this.responseData.data, type, legendItems, 'Request trend period','requestDivId',  this.downloadHeader)
  }
}
