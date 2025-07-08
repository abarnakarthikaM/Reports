// import { group } from '@angular/animations';
import { Component, OnInit,Input, EventEmitter, Output } from '@angular/core';
import { AppService } from 'src/app/core-module/service/app.service';

declare var $: any;
@Component({
selector: 'app-radio',
templateUrl: './radio.component.html',
styleUrls: ['./radio.component.scss'],
})
export class RadioComponent implements OnInit {
@Input() public groupData: any = [];
@Output() public radioStatus: EventEmitter<any> = new EventEmitter();

constructor(public appService: AppService) {}

ngOnInit(): void {
this.groupData.map((item:any) => {
return item.menuName == this.appService.selectedMenu
? item.activeStatus = 'Y'
: item.activeStatus = 'N'
})
}

public selectRadiobtn(status: any, i: any) {
this.groupData.map((data: any) => (data.activeStatus = 'N'));
this.groupData[i]['activeStatus'] = status == 'Y' ? 'N' : "Y";
this.appService.currentBasedOn = this.groupData[i].basedOn;
let data = this.groupData[i];
this.radioStatus.emit(data);
}
}
