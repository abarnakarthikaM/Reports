import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from 'src/app/core-module/service/app.service';
import { environment } from 'src/environments/environment';
declare var $:any;
declare var toastr: any;
@Component({
  selector: 'app-alert-input',
  templateUrl: './alert-input.component.html',
  styleUrls: ['./alert-input.component.scss'],
})
export class AlertInputComponent implements OnInit {
  @Input() public alertIpData: any;
  @Output() inputAlertInfo = new EventEmitter();
  public isReturn:boolean;
  public userValue: string = "";
  public isDisabled: boolean = true;
  public requestValue: any = {};
  public saveReportName: boolean = false;
  public airlineCode: string = sessionStorage.getItem("themeCode");
  constructor(
    private appService: AppService
  ) {}

  ngOnInit(): void {  
    console.log(this.alertIpData);
    if(this.alertIpData.apiName || this.alertIpData.queueReportName != ''){
      this.userValue = this.alertIpData.queueReportName;
    }
  }

  // When a user enters flynas in a different format, it becomes flynas.
  onInputBlur(event: any) {
    if (this.airlineCode == 'XY') {
      this.userValue = event.target.value.replace(/(\w*)flynas/gi, function (_, p1) {
        return p1 + 'flynas';
      });
    }
  }

  // User entered data getting function
  onKey(event: any) {
    this.isDisabled = true;
    let inputValue = event.target.value;
    if (inputValue.length > 0) {
      for (let i = 0; i < inputValue.length; i++) {
        let charCode = inputValue.charCodeAt(i);
        if (((charCode > 64 && charCode < 91) ||
          (charCode > 96 && charCode < 123) ||
          charCode == 8 ||
          charCode == 32 ||
          (charCode >= 48 && charCode <= 57)) &&
          event.target.value !== '') {
          this.isReturn = true;
          this.userValue = event.target.value;
        } else {
          this.isReturn = false
          toastr.error('Report name not valid , name should begin with letter');
          event.target.value = this.userValue;
          return false;
        }
      }
    } else if (inputValue == '') {
      toastr.error('Please enter report name ');
      this.userValue = '';
      return false;
    }
    
  }
  // close popup and send data based on user button click
  public closeModal(userAction: boolean) {
    this.isDisabled = false;
    if(this.alertIpData.apiName){
          this.appService.queReportSavedList = true;
    }
   
    var apiName= this.alertIpData.apiName ? 'queued-save-reports':'save-reports';
    var alertDetail = {
      userAction: userAction,
      userInput: this.userValue,
    };
    if(this.isReturn == false && userAction){
      toastr.error('Report name not valid , name should begin with letter');
    }
    if((this.userValue == '' || this.userValue == undefined) && userAction)
      toastr.error('Please enter report name ');
    if (this.userValue != '') this.isReturn = true;
    if (userAction && this.userValue != undefined && this.userValue != '' && this.isReturn) {
      this.alertIpData.requestData['reportSavedAs'] =  this.userValue;
         this.appService
        .httpPost(
          this.alertIpData.requestData,
          '',
          environment.CUSTOME_BACKEND_URL + apiName
        )
        .subscribe((data) => {
          if(data?.responseCode == 0 && (data?.response?.data == null || data?.response?.data.responseMessage == 'ok') ) {
            if (data?.response?.data?.responseErrorDesc) {
              this.isDisabled = false;
              let msg = data?.response?.data?.responseErrorDesc
                ? data?.response?.data?.responseErrorDesc
                : 'Report Name already exists';
              toastr.error(msg);
            } else {
              setTimeout(() => {
                this.isDisabled = true;
                this.appService.showReportData = undefined;
                this.inputAlertInfo.emit(alertDetail);
              }, 500);
              $('.cls-err').addClass('d-none');
            }
          } else {
            this.isDisabled = false;
            let msg = data?.response?.data?.responseErrorDesc
              ? data?.response?.data?.responseErrorDesc
              : 'Report Name already exists';
            toastr.error(msg);
          }
        });
    } else {
      $('.cls-err').removeClass('d-none');
    }
    if (!userAction) {
      this.appService.queReportSavedList = false;
      this.inputAlertInfo.emit(alertDetail);
    }
  }
  public restrictInput(event: any, type: string, maxlength: any): any {
    var userInput = event.target.value;
    if (maxlength) {
    if (userInput.length + 1 > maxlength) {
    return false;
    }
    }
    this.appService.inpVal(event, type);
    }
    isModalVisible: boolean = false;
    public closeFocus(){
      this.isModalVisible = true;
    }
}
