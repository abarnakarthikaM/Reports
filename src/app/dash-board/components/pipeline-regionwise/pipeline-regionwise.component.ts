import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
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
  selector: 'app-pipeline-regionwise',
  templateUrl: './pipeline-regionwise.component.html',
  styleUrls: ['./pipeline-regionwise.component.scss']
})
export class PipelineRegionwiseComponent implements OnInit {
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

  constructor(private dashboardService: DashBoardService, private appService:AppService) {  }


  ngOnInit(): void {
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
  serrviceData(){
    let currdate = new Date();

    let newDate = this.dashboardService.dateFormat(currdate);

    // getting six month from now in time stamp
    let sixMonths = currdate.setMonth(currdate.getMonth() + 6);

    let newSixDate = this.dashboardService.dateFormat(new Date(sixMonths));

    let requestRegionWise = {
      "reportName": "pipeline-departure",
      // "reportBasedOn": "pos-country",
      "reportBasedOn": "regions",
      "startDate": newDate + ' 00:00:00',
      "endDate": newSixDate + ' 23:59:59'
    };

    this.serviceCall(requestRegionWise);
  }

  reloadItem(){
    this.serrviceData();
  }

  openSelectBox() {
    this.selectbox = true;
  }

  select(val: string) {
    this.activeTab = val;
    this.selectedVal = val;
    this.selectbox = false;
    this.serrviceData();
  }

  async serviceCall(request:any) {
    this.loader = true;
    var data = await this.appService.pipelineDepartureRequest(request).toPromise()

      this.options[0].info = "Revenue in "+data.responseAdditionalData.curreny;
      this.options.map((data:any)=>{
        if (data.val === this.selectedVal ) {
          this.showVal = data.info;
        }
      });
      this.loader = false;
      
      if (data.responseMessage !== 'ok'){
        this.reload = true;
      } else {  
        let regionwise = JSON.parse(JSON.stringify(data));
        let reportData = this.dashboardService.convertRequestType(regionwise, this.selectedVal);
        this.loader = false;
        this.responseRegionWise = reportData;
        if(this.responseRegionWise.responseData.length > 0)
          this.initChart(this.responseRegionWise);
      }
    // });
  }


  initChart(data: any) {
    let paymentCompleted;
    let paymentpartialyCompleted;
    let paymentYetToComplete;
    // let label = data.responseData.map((data:any) => data['pos_country']);
    let label = data.responseData.map((data:any) => data['country_code']);
    if (this.selectedVal === 'Revenue in USD') {
      paymentCompleted = data.responseData.map((data) => this.dashboardService.kFormatter(data['pay_completed']));
      paymentpartialyCompleted = data.responseData.map(data => this.dashboardService.kFormatter(data['pay_partially_completed']));
      paymentYetToComplete = data.responseData.map(data => this.dashboardService.kFormatter(data['yet_2_pay']));
      
    } else {
      paymentCompleted =  data.responseData.map(data => data['pay_completed']);
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
          show: true,
          offsetX: 0,
          offsetY: 30,
          tools: {
            download:'<i class="icon-28-chart-download" title="Download" aria-hidden="true"></i>',
          },
          export: {
            csv: {
              headerCategory: this.activeTab ? this.activeTab : this.options[0]['val'],
              filename: 'Pipeline Revenue - Region wise',
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
      fill: {
        opacity: 1
      },
      colors: ['#1d5cac', '#f1a917', '#f73b3c'],
      title: {
        "text": "Pipeline Revenue - Regions Wise",
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
    if(this.selectedVal === 'Revenue in USD') {
      this.chartOptions.yaxis.labels = {
        formatter(val:any) {
          return  Number(parseFloat(val)).toLocaleString('en');
        }
      };
    }
  }
}
