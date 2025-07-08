import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppService } from 'src/app/core-module/service/app.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-passenger-list-modal',
  templateUrl: './passenger-list-modal.component.html',
  styleUrls: ['./passenger-list-modal.component.scss'],
})
export class PassengerListModalComponent implements OnInit {
  @Input() public nameChangeReportInfo: any;
  @Output() public nameCHangeReportStatus: EventEmitter<boolean> =
    new EventEmitter();
  constructor(public appService: AppService) {}

  public toClose: boolean = false;

  public passengerData: any = {};
  public popUpClose: boolean = false;

  ngOnInit(): void {
    if (this.nameChangeReportInfo) this.alertClose(true);
  }

  // Following method is used for getting the selected passengers data 
  public gettingPassengerData = () => {
    this.appService
      .httpPost(
        this.appService.passengerInfo,
        '',
        environment.CUSTOME_BACKEND_URL + 'get-passenger-details'
      )
      .subscribe((data) => {
        if (data?.responseCode == 0) {
          this.passengerData = data?.response?.data;
        }
      });
  };

  // Following method is used for closing the passenger popup data
  public alertClose(flag: boolean): void {
    if (flag) this.gettingPassengerData();
    this.popUpClose = flag;
    this.toClose = flag;
    if(!flag) this.nameCHangeReportStatus.emit(flag);
  }
  ngOnChanges() {}
}
