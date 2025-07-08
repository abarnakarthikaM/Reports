import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/core-module/service/app.service';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';
@Component({
  selector: 'app-dash-board-pipeline',
  templateUrl: './dash-board-pipeline.component.html',
  styleUrls: ['./dash-board-pipeline.component.scss']
})
export class DashBoardPipelineComponent implements OnInit {
  public datatocomparison:any;
  public datacurrentyear:Object;
  constructor(private dashboardService:DashBoardService, private appService:AppService) { }

  ngOnInit() {

       this.serviceData();

     }
     public getReload(data:any) {
      if(data === 'reloadSerevice')
      this.serviceData();
    }
    serviceData(){
      // current Date
      let currdate = new Date();

      let newDate = this.dashboardService.dateFormat(currdate);

      // getting six month from now in time stamp
      let sixMonths = currdate.setMonth(currdate.getMonth() + 6);

      let newSixDate = this.dashboardService.dateFormat(new Date(sixMonths));

      let requestMonthWise = {
        "reportName": "pipeline-departure",
        "reportBasedOn": "monthly",
        "startDate": newDate+' 00:00:00',
        "endDate": newSixDate+' 23:59:59'
      };

      this.serviceCall(requestMonthWise);
    }
     async serviceCall(request:any) {
      var data= await this.appService.pipelineDepartureRequest(request).toPromise()
        this.datacurrentyear = data.response.data;
        // data.responseMessage = 'err';
        if(data.response.Message === 'Success'){
          this.datatocomparison = data.response.data;
        }
  }
}
