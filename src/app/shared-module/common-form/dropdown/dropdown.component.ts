import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'src/app/core-module/service/app.service';
declare var $: any;
declare var toastr: any;

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {
  public form: FormGroup = new FormGroup({});
  public submitted: boolean = false;
  @Input() public formData: any;
  @Input() public conditionValue: any;
  public dropDownData: any;
  public dropDownValue: any = [];
  public isChildCondition: boolean = true;
  constructor(public appService: AppService) { }

  async ngOnInit(): Promise<void> {
    this.appService.childConditionInfo.count = 0;
    setTimeout(() => {
      $('select').formSelect();
    });
  }

  
  handleConditionValue = (event: any) => {
    let conditionValue = sessionStorage.getItem('conditionValue')
      ? JSON.parse(sessionStorage.getItem('conditionValue'))
      : {};
    conditionValue[this.dropDownData.keys] = event.target.value;
    sessionStorage.setItem('conditionValue', JSON.stringify(conditionValue));
  };

  onChangeEvent(event: any) {
    this.handleConditionValue(event);
    if (this.dropDownData.keys == this.appService.childCondition) {
      this.isChildCondition = false;
      this.appService.groupDataValue = event.target.value;
      this.appService.childConditionInfo.selectedInfo = event.target.value;
    }
    if (this.dropDownData.keys == this.appService.parentCondition && this.appService.childConditionInfo.type) {
      this.appService.childConditionInfo.selectedInfo = undefined;
      this.appService.childConditionInfo.count = 0;
      this.appService.dataForUserType = event.target.value;
      setTimeout(() => {
        $('select').map((index, items) => {
          if (items.name === this.appService.childCondition) {
            // $(items).val($(items).find('option').eq(0).val());
            $(items).trigger('click').val($(items).find('option').eq(0).val());
          }
          return true;
        });
      }, 100);
    }
  }

  // Following method is used for handling the dropdown child condition
  handleChildConditionData() {
    let agencyName= sessionStorage.getItem('summarydropDown')
    if(this.appService.summaryReportInfo.isdropDown && this.appService.summaryReportInfo.isSummaryReport){
      let summaryRequest: any = {
        reportName: this.dropDownData.reportName,
        reportBasedOn: this.dropDownData.basedOn,
        agencyName: agencyName
      };
      let responseDetail: string = this.dropDownData.reportName;
        this.handleServiceCall(summaryRequest, responseDetail);
    }

    if (
      this.conditionValue.keys == this.appService.childCondition &&
      this.appService.childConditionInfo.count == 0
    ) {
      this.appService.childConditionInfo.count++;
      if (this.appService.dataForUserType) {
        $('.position-label').addClass('cls-active-label');
        const before = this.dropDownData.dropDownValue;
        const after =
          this.dropDownData.responseData[this.appService.dataForUserType];
        if (before[0]?.id == after[0]?.id)
          this.appService.childConditionInfo.selectedInfo = after[0]?.id;
        this.appService.groupDataValue =
          after?.length > 0 ? after[0].id : undefined;
        if (
          this.dropDownData.responseData[this.appService.dataForUserType]
            .length == 0
        )
          toastr.error(
            'No ' +
            this.appService.childCondition +
            ' data is found for choosen ' +
            this.appService.parentCondition
          );
        if (
          this.appService.dataForUserType &&
          (!before || before[0] !== after[0] || this.dropDownValue.length == 0)
        ) {
          this.dropDownData['dropDownValue'] =
            this.dropDownData.responseData[this.appService.dataForUserType];
          this.dropDownValue = this.dropDownData.dropDownValue;
          setTimeout(() => {
            $('select').formSelect();
          }, 10);
        }
      }
    }
  }

  // Following method is triggered when click is made in the dropdown data
  onClickEvent() {

    this.appService.childConditionInfo.count++;
    if (
      this.conditionValue.keys == this.appService.childCondition &&
      !this.isChildCondition &&
      !this.appService.childConditionInfo.selectedInfo
    )
      this.appService.childConditionInfo.selectedInfo =
        this.dropDownValue[0]?.id;
  }

  async ngOnChanges() {
    this.dropDownData = this.formData[0];
    let responseData: any = {
      reportName: this.dropDownData.reportName,
      reportBasedOn: this.dropDownData.basedOn,
    };
    let responseDetail: string = this.dropDownData.reportName;
    if (this.dropDownData)
      this.form?.addControl(
        this.dropDownData.keys,
        new FormControl(
          this.conditionValue.editValue
            ? this.conditionValue.editValue
            : '',
          Validators.required
        )
      );
    // this.handleServiceCall(responseData, responseDetail);
    if (this.appService.summaryReportInfo.isSummaryReport) {
      if (this.conditionValue.hide_condition.length == 0)
        this.handleServiceCall(responseData, responseDetail);
      else if (this.conditionValue.hide_condition.length > 0)
        this.appService.summaryReportInfo['parentCondition'] = this.conditionValue.hide_condition;
    } else {
      this.handleServiceCall(responseData, responseDetail);
    }

  }

  // Service call for the dropdown option is made in the following code.
  async handleServiceCall(responseData: any, responseDetail: any) {
    let data = await this.appService
      .getMultiSelectOption(responseData, responseDetail)
      .toPromise();
    if (data?.responseCode === 0 && data?.response?.data?.listData) {
      this.appService.summaryReportInfo.isdropDown = false;
      setTimeout(() => {
        $('select').formSelect();
      });

      if (this.conditionValue.keys == this.appService.childCondition) {
        this.dropDownData['responseData'] = data?.response?.data?.listData[0];
        this.dropDownData['dropDownValue'] = this.appService.dataForUserType
          ? data?.response?.data?.listData[0][this.appService.dataForUserType]
          : data?.response?.data?.listData[0][
          Number(Object.keys(data?.response?.data?.listData[0])[0])
          ];
        this.dropDownValue = [];
      } else {
        this.dropDownValue = data?.response?.data?.listData;
        this.dropDownData['responseData'] = data?.response?.data?.listData;
        this.dropDownData['dropDownValue'] = data?.response?.data?.listData;
        // if (this.appService.parentCondition == this.conditionValue.keys)
        //   this.appService.dataForUserType =
        //     data?.response?.data?.listData[0].id;
      }
    }
  }
}