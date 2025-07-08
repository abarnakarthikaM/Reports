import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from 'src/app/core-module/service/app.service';
declare var toastr: any;

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent implements OnInit {
  /**
   * input data for checkbox
   */
  @Input() public groupData: any = [];
  /**
   * output data for checkbox
   */
  @Output() finalArray = new EventEmitter();
  constructor(public appService: AppService) { }

  public respectiveFields: string = '';
  public ismandatoryDataAdd: boolean = false;
  /**
   * ngOnInit
   */
  ngOnInit(): void {
    this.respectiveFields = this.groupData.field_details
      ? 'field_details'
      : 'condition_details';
    if (this.groupData[0] && this.respectiveFields == 'condition_details')
      this.groupData = this.groupData[0];
  }

  ngOnChanges() {
    // console.log(this.groupData,'vvv');

    // console.log(this.groupData,'group_data');
    // this.groupData.id=this.groupData.head.split(' ').join('');
    // this.groupData.id=this.groupData.id.split('/').join('');
    this.respectiveFields = this.groupData.field_details
      ? 'field_details'
      : 'condition_details';
    this.groupData =
      this.groupData[0] && this.respectiveFields == 'condition_details'
        ? this.groupData[0]
        : this.groupData;
    if (this.groupData[this.respectiveFields]) {
      this.groupData[this.respectiveFields] = this.groupData[
        this.respectiveFields
      ].filter((data) => data.name != undefined);
    }
    this.selectDeselect();
  }
  /**
   * select deselect function
   */
  public selectDeselect() {
    let result = 0;
    let i = 0;
    this.DefaultSelect();
    this.groupData[this.respectiveFields].map((data: any) => {
      if (data.status === 'Y') {
        i++;
      }
      result++;
    });
    if (result === i) {
      this.groupData.status = 'Y';
    } else {
      this.groupData.status = 'N';
    }
  }
  /**
   * select individual checkbox
   */
  public selectCheckbox(status: string, index: number | string) {
    if (this.respectiveFields == 'condition_details' && this.groupData[this.respectiveFields][index].show_condition)
      this.handleShowandHideCondition(status, index);
    let handleGroupTypeCondition: boolean = true;
    let mandatoryData =
      this.respectiveFields == 'field_details'
        ? this.appService.mandatoryField
        : this.appService.mandatoryCondition;
    let count: number = 0;
    mandatoryData.map((value) => {
      if (value != this.groupData[this.respectiveFields][index].keys) count++;
      else count;
    });
    if (count == mandatoryData.length) {
      if (
        this.respectiveFields == 'condition_details' &&
        this.groupData[this.respectiveFields][index].keys == this.appService.childCondition) {
        handleGroupTypeCondition = this.handleParentCondition(
          false,
          this.groupData[this.respectiveFields][index].status,
          this.groupData[this.respectiveFields][index].status == 'Y'
        );
        this.appService.isUserTypeCondition = this.groupData[this.respectiveFields][index].status == 'N' ? true : false;
      } else if (
        this.respectiveFields == 'condition_details' &&
        this.groupData[this.respectiveFields][index].keys == this.appService.parentCondition &&
        this.groupData[this.respectiveFields][index].status == 'Y'
      ) this.handleParentCondition(true, 'Y', false);
      if (handleGroupTypeCondition)
        this.groupData[this.respectiveFields][index]['status'] =
          status === 'N' ? 'Y' : 'N';
      else
        toastr.error("Choose " + this.appService.parentCondition + " condition before choosing the " + this.appService.childCondition);
    }
    else this.groupData[this.respectiveFields][index]['status'] = 'Y';
    const tempArray = this.groupData[this.respectiveFields].filter(
      (data: any) => data.status === 'Y'
    );
    tempArray.map((data: any) =>
      Object.assign(data, { index: this.groupData.head })
    );
    this.selectDeselect();
    this.DefaultSelect();
    if (this.respectiveFields === 'condition_details' && this.appService?.isDateFieldMandatory)
      this.handleDateCondtion(this.groupData);
    this.finalArray.emit(this.groupData);
  }

  // Date range mandatory fields enable
  private handleDateCondtion(conditionList: any) {
    let selectedCondition = conditionList?.condition_details?.filter(data => data.status === 'Y');
    let dateConditionList = selectedCondition?.filter(item => item.type === "datepicker");
    if(dateConditionList?.length === 0) toastr.error('Kindly choose anyone date picker condition')
  }

  // Handle show and hide condition dynamically for summary report
  private handleShowandHideCondition(status: string, index: number | string) {
    this.groupData[this.respectiveFields].map((data) => {
      if (this.groupData[this.respectiveFields][index].show_condition == data.keys)
        data.hide_value = status == 'N' ? false : true;
    });
  }

  // Handle condition check for the parent condition
  private handleParentCondition(checkingStatus?: boolean, status?: string, isCheck?: boolean) {
    if (status == 'Y' && isCheck) {
      this.appService.groupDataValue = undefined;
      return true;
    } else {
      let count: number = 0;
      this.groupData['condition_details'].filter((data: any) => {
        count =
          data.keys == this.appService.parentCondition && data.status == 'Y'
            ? 1
            : count;
        if (
          checkingStatus &&
          data.keys == this.appService.childCondition &&
          data.status == 'Y'
        )
          data.status = 'N';
      });
      return count > 0 ? true : false;
    }
  }

  private DefaultSelect() {
    this.groupData[this.respectiveFields].map((data: any) => {
      // Default Select
      if (
        data.keys == 'sector' &&
        data.name.toLowerCase() == 'sector' &&
        data.id == '1'
      ) {
        data.status = 'Y';
      }
    });
    const tempArray = this.groupData[this.respectiveFields].filter(
      (data: any) => data.status === 'Y'
    );
    tempArray.map((data: any) =>
      Object.assign(data, { index: this.groupData.head })
    );
    this.finalArray.emit(this.groupData);
  }
  /**
   * select all checkbox
   */
  public selectAll(status: string) {
    if (!this.ismandatoryDataAdd) this.handleMandatoryData();
    this.groupData['status'] = status === 'N' ? 'Y' : 'N';
    this.groupData[this.respectiveFields].map((data) => {
      if (data.keys == 'userEmail')
        data.hide_value = status == 'N' ? false : true;
    });
    const tempArray = (this.groupData['status'] === 'N' ? false : true)
      ? this.groupData[this.respectiveFields].filter(
        (data: any) => (data.status = 'Y')
      )
      : this.groupData[this.respectiveFields].map((data: any) =>
        data.default ? (data.status = 'Y') : (data.status = 'N')
      );
    tempArray.map((data: any) =>
      Object.assign(data, { index: this.groupData.head })
    );
    this.DefaultSelect();
    // this.finalArray.emit(this.groupData);
  }

  // Handle mandatory data for select all action
  private handleMandatoryData() {
    this.groupData[this.respectiveFields]?.map((data) => {
      let mandatoryData = this.respectiveFields == 'field_details'
        ? this.appService.mandatoryField
        : this.appService.mandatoryCondition;
      mandatoryData.map((value) => {
        if (value == data.keys) data['default'] = true;
      });
    });
  }

  // Tab Select All Click 
  public tabClick(event: KeyboardEvent, id: any) {
    if (event.key == 'Enter') {
      this.selectAll(id);
    }
  }

}
