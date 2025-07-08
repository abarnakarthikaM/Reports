import { Component, OnInit } from '@angular/core';
// import { ConnectionService } from 'ng-connection-service';
@Component({
  selector: 'app-dash-board-index',
  templateUrl: './dash-board-index.component.html',
  styleUrls: ['./dash-board-index.component.scss']
})
export class DashBoardIndexComponent implements OnInit {

  public flagTabDashboard : boolean = true;
  // public networkerror:boolean=false;
  constructor() { }
  // constructor(private connectionService: ConnectionService) {
  //   this.connectionService.monitor().subscribe(isConnected => {
  //     if (!isConnected) {
  //     this.networkerror = true;
  //     // this.router.navigate(["./" + urlConfig.FRONTEND_ROUTES.nointernet]);
  //     }
  //     });
  //  }

  ngOnInit(): void {
  }

  public handelClick(type:string){
    type==='pipe' ? this.flagTabDashboard=false : this.flagTabDashboard=true;
  }
}
