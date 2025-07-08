import { Component, OnInit, HostListener, Input,Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { AppService } from 'src/app/core-module/service/app.service';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';
@Component({
  selector: 'app-revenue-analysis-total-revenue',
  templateUrl: './revenue-analysis-total-revenue.component.html',
  styleUrls: ['./revenue-analysis-total-revenue.component.scss']
})
export class RevenueAnalysisTotalRevenueComponent implements OnInit {
  @Input() public revenueData:any;
  public legendIndex: any = [0,1,2]
  @Output() public reloadService : EventEmitter<any> = new EventEmitter();
  basedOn: { id: number; info: string; val: string; }[];
  selectboxbaseddon: boolean;
  basedonval: string;
  showVal: any;
  currency: string;
  activeTab: string;
  constructor(private dashboardService: DashBoardService,private appService:AppService,private cdr: ChangeDetectorRef) { }
  @HostListener('document:click', ['$event']) onDocumentClick() {
    this.selectbox = false;
    this.selectboxbaseddon = false;
  }
  public reload:boolean = false;
  reqAnalysis: any = {};
  reqAnalysisDonut: object = {};
  loader: boolean = true;
  selectbox: boolean = false;
  options: Array<any> = [];
  selectedVal: string = 'select';
  ngOnInit(): void {
    this.options = [
      {
        "id": 1,
        "info": "monthly",
        "val": "monthly"
      },
      //  {
      //   "id": 2,
      //   "info": "quarterly",
      //   "val": "quarterly"
      // },
      // {
      //   "id": 3,
      //   "info": "halfyearly",
      //   "val": "halfyearly"
      // },
      {
        "id": 2,
        "info": "regions",
        "val": "regions"
      },
      // {
      //   "info": "station",
      //   "id": 3,
      //   "val": "station"
      // },
      // {
      //   "info": "pos country",
      //   "id": 4,
      //   "val": "pos_country"
      // }
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
    let curYear:any = new Date().getFullYear();
    curYear = curYear.toString();
    let reqAnalysis = {
      "reportName": "revenue-analysis",
      "reportBasedOn": "monthly",
      "startDate": curYear+"-01-01 00:00:00",
      "endDate": curYear+"-12-31 23:59:59"
    };
    if (this.revenueData !== undefined) {
      if (this.revenueData.responseMessage === 'err') {
        this.reload = true;
        this.loader = false;
      } else {
        let data:any = {};
       data.responseData = this.revenueData.responseData;
        // data.currency = this.revenueData.responseAdditionalData.curreny;
        this.currency = this.revenueData.responseAdditionalData.curreny;
        this.assignData(reqAnalysis, data);
      }
      this.serviceCall(reqAnalysis);
    }
  }


  openSelectBox() {
    this.selectbox = true;
  }
  openSelectBox2(){
    this.selectboxbaseddon = true;
  }
  select(val: string) {
    this.activeTab = val;
    let curYear:any = new Date().getFullYear();
    curYear = curYear.toString();
    let reqAnalysis = {
      "reportName": "revenue-analysis",
      "reportBasedOn":val,
      "startDate": curYear+"-01-01 00:00:00",
      "endDate": curYear+"-12-31 23:59:59"
    }
    this.selectbox = false;
    this.serviceCall(reqAnalysis);
  }

  selectBasedon(val: string) {
    this.basedonval = val;
    this.selectboxbaseddon = false;
    // this.serviceCall(reqAnalysis);
  }

  async serviceCall(request:any) {
    this.loader = true;
    var data= await this.appService.revenueAnalysisRequest(request).toPromise()
      if (data?.response?.Message!== 'Success') {
        this.reload = true;
        this.loader = false;
      } else {
        this.assignData(request, data?.response?.data);
      }
  }
  reloadItem(){
    this.reloadService.emit('reloadSerevice');
    this.loader = true;
  }
  assignData(request: any, data: any): void {
    this.loader = false;
    this.selectedVal = request.reportBasedOn;
    this.options.map((data:any)=>{
      if (data.val === this.selectedVal ) {
        this.showVal = data.info;
      }
    });
    this.loader = false;
    let _DataYr2020 = data;
    let keys = ['pay_completed', 'pay_partially_completed', 'yet_2_pay', 'month_index', 'year_index'];
    let bckEndData = {
      "monthly": _DataYr2020,
      // "quarterly": this.dashboardService.convertArrayType(_DataYr2020, 3, keys),
      // "halfyearly": this.dashboardService.convertArrayType(_DataYr2020, 6, keys),
      "regions":  _DataYr2020,
      "station":  _DataYr2020,
      "pos_country": _DataYr2020,
    };
    // let donutVal = this.dashboardService.convertArrayType(_DataYr2020, 12, keys).responseData;
    //Add the array of object values for pie chart

    // let addedValue = [donutVal.reduce((acc, n) => {
    //   n = this.dashboardService.kFormatter(n);
    //   for (var prop in n) {
    //     if (acc.hasOwnProperty(prop)) acc[prop] += n[prop];
    //     else acc[prop] = n[prop];
    //   }
    //   return acc;
    // }, {})]
    // Assigning Object Values
  
    this.reqAnalysis = bckEndData[request.reportBasedOn];
    let res =  this.reqAnalysis.responseData;
    let pc = res.map(d=> this.dashboardService.kFormatter(d.pay_completed))
    let pac = res.map(d=> this.dashboardService.kFormatter(d.pay_partially_completed))
    let yc = res.map(d=> this.dashboardService.kFormatter(d.yet_2_pay))

    pc = pc.reduce((a: any,b: any)=> Number(a) + Number(b), 0)
    pac = pac.reduce((a: any ,b: any)=> Number(a) + Number(b), 0)
    yc = yc.reduce((a: any,b: any)=> Number(a) + Number(b), 0)

    this.reqAnalysisDonut = {
      getPaymentCompleted: pc,
      getPartialCompleted: pac,
      getYetCompleted: yc
    };

  }
  public flag :boolean = true;

  public legendsClick(data:any) {
    this.flag = false
    if (this.legendIndex?.includes(data)) 
      this.legendIndex = this.legendIndex?.filter(item => item !== data);
    else {
      this.legendIndex.push(data);
    }
    this.cdr.detectChanges();
    this.flag = true;
  }

  ngDoCheck(){
    if(document.getElementsByClassName("cls-custom-download-icon").length == 0){
    }
    // this.addImageIcon()
  }
}
