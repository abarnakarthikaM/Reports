import { Injectable } from '@angular/core';
import { AppService } from './app.service';

declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class LogUserActionsService {

  public requestData: any;
  public ipAdd: any;
  public logUserActionKey: any;
  constructor(private _appService: AppService) {
    var currentdate = new Date();
    var date = currentdate.getFullYear() + '-' + (currentdate.getMonth() + 1) + '-' + currentdate.getDate() + " " + currentdate.getHours() + ":"
      + currentdate.getMinutes() + ":"
      + currentdate.getSeconds();
    $.getJSON("https://api.ipify.org?format=json", function (data) {
      localStorage.setItem('ipAddress', data.ip)
    });
    this.ipAdd = localStorage.getItem('ipAddress')

    this.requestData = {
      reportName: 'insert-user-action-log',
      userAction: [
        {
          page: '',
          action_module: '',
          action_type: '',
          action: '',
          summary: '',
          form_values: {
            data: {},
          },
          pid: '',
          reference_id: '34575',
          category: 'Report',
          action_date: date,
          ip_address: this.ipAdd,
          browser: navigator.appName + ' ' + navigator.appVersion,
        },
      ],
    };

  }

  public async logUserAction(apiRequestData: any, url: any, page: string, module: string, action_type: string, action: string, summary: string) {
    this.requestData.userAction[0].page = page;
    this.requestData.userAction[0].action_module = module;
    this.requestData.userAction[0].action_type = action_type;
    this.requestData.userAction[0].action = action;
    this.requestData.userAction[0].summary = summary;
    this.requestData.userAction[0].form_values.data = apiRequestData;

    this.logUserActionKey = sessionStorage.getItem('userActionKey');
    if (this.logUserActionKey != "undefined") {
      this.logUserActionKey = JSON.parse(this.logUserActionKey)
      // console.log(this.logUserActionKey);
      if (this.logUserActionKey) {
        var data = await this._appService.userActionLog(this.requestData, url).toPromise()
        console.log(data);
      }
    }

  }
}
