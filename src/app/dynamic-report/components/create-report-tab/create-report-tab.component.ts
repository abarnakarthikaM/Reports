import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AppService } from 'src/app/core-module/service/app.service';

declare var $: any;
@Component({
  selector: 'app-create-report-tab',
  templateUrl: './create-report-tab.component.html',
  styleUrls: ['./create-report-tab.component.scss'],
})
export class CreateReportTabComponent implements OnInit {
  @Input() activeModuleData: any;
  @Input() savedReportHide: any;
  @Input() savedListFlag: any;
  constructor(public appService: AppService) {}

  public flagFieldsAvailable: boolean = true;
  public editReport: any = undefined;
  public Fields: any = undefined;
  public availableCondition: any = undefined;
  public flagReviewFlow: boolean = false;
  public allFieldsConditions: any;
  public tabList: any = [];
  public selectedFieldData: any = [];
  public isSubMenu: boolean = false;
  tabId: string = '';
  public tabItemsResponsive = {
    listItem: ['availableFields', 'availableConditions', 'reviewSave'],
    currentItem: 0,
  };
  public hideConditionList: any = {
    showCondition: [],
    hideCondition: [],
  };
  @Output() redirect = new EventEmitter();

  ngOnInit(): void {}

  ngOnChanges() {
    this.savedListFlag = this.savedReportHide;

    this.isSubMenu = this.activeModuleData?.submenu?.length > 0 ? true : false;
    this.getAvailableTab();
  }

  // The following method is triggered when clicked is made in tab element.
  // It helps to navigate to previous and back tab.
  // For back tab no condition is need but for previous tab it satisfy the condition of any one field or condition is choosed.

  public handelTabClick(id: string) {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (id == 'pre' || id == 'next') {
      if (
        id == 'next' &&
        this.tabItemsResponsive.currentItem < 3 &&
        this.handleFieldTabRestriction() > 0
      ) {
        this.tabItemsResponsive.currentItem++;
        id =
          this.tabItemsResponsive.listItem[this.tabItemsResponsive.currentItem];
      } else if (id == 'pre' && this.tabItemsResponsive.currentItem > 0) {
        this.tabItemsResponsive.currentItem--;
        id =
          this.tabItemsResponsive.listItem[this.tabItemsResponsive.currentItem];
      }
    }

    this.appService.showReportData = undefined;
    $('#tab' + id).trigger('click');
    this.flagReviewFlow = id === 'reviewSave' ? true : false;
    if (this.appService.childCondition) {
      this.appService.childConditionInfo.selectedInfo = undefined;
      this.appService.childConditionInfo.count = 0;
      this.appService.dataForUserType = undefined;
    }
    //Child Dropdown data is there only enable the childApi
    this.allFieldsConditions.response.data.conditions.condition_details.map(
      (drpDwnData: any) => {
        if (drpDwnData.keys == 'userEmail' && drpDwnData.status == 'N') {
          this.appService.summaryReportInfo.isValidChildCondition = true;
        } else if (drpDwnData.keys == 'userEmail' && drpDwnData.status == 'Y') {
          this.appService.summaryReportInfo.isChildReportEnable = true;
        }
      }
    );
  }

  // Following Method handle to use the mandatory date picker enable
  private handleDateMandatory(conditionList: any) {
    let filterData = conditionList.filter((item) => item.type === 'datepicker');
    this.appService.isDateFieldMandatory = filterData.length > 0;
  }

  // The following method is used to get the fields and condition from api and assigned their response to this.Fields and
  // this.availableCondition for further development.
  public async getAvailableTab() {
    let reqData = {
      accessToken: sessionStorage.getItem('accessToken'),
      moduleKey: this.activeModuleData?.key,
    };
    if (this.appService.selectedMenu != '')
      this.allFieldsConditions = await this.appService
        .getAllFieldConditions(reqData, this.appService.selectedMenu)
        .toPromise();
    if (this.allFieldsConditions && this.checkingHideCondition())
      this.handleSummaryReportData();
    this.Fields = this.allFieldsConditions?.response?.data?.fields;
    this.availableCondition =
      this.allFieldsConditions?.response?.data?.conditions;
    if (this.allFieldsConditions?.response?.data?.conditions?.isDateMandatory) {
      this.handleDateMandatory(
        this.allFieldsConditions?.response?.data?.conditions[0]
          ?.condition_details
      );
    }
    this.handleParentCondition();
    this.appService.mandatoryField = [];
    this.appService.mandatoryCondition = [];
    this.handleMandatoryFieldsandCondition();
    this.appService.isFieldData =
      this.allFieldsConditions?.response?.data?.fields.length > 0;
    if (this.appService.isEditReport) this.handleEditData();
    this.selectedFieldData = this.allFieldsConditions?.response?.data?.fields;
    this.setAvailableFieldsandConditions();
  }

  // Method to handle hide condition data.
  private handleSummaryReportData() {
    this.allFieldsConditions.response.data.conditions[0].condition_details.map(
      (value: any) => {
        this.hideConditionList.showCondition.map((data: any, index: any) => {
          if (data == value.keys) {
            value['show_condition'] =
              this.hideConditionList.hideCondition[index];
          }
          if (!value.hide_value) value['hide_value'] = false;
        });
      }
    );
  }

  // Method to check whether any hide condition is present or not. If hide condition is present it return true else it return false.
  private checkingHideCondition() {
    this.hideConditionList.showCondition = [];
    this.hideConditionList.hideCondition = [];
    this.allFieldsConditions.response.data.conditions[0].condition_details.map(
      (value: any) => {
        if (value.hide_condition) {
          this.hideConditionList.showCondition.push(value.hide_condition);
          this.hideConditionList.hideCondition.push(value.keys);
          value['hide_value'] = true;
        }
      }
    );
    return this.hideConditionList.showCondition.length > 0 ? true : false;
  }

  // Method to handle parent and child condition
  private handleParentCondition() {
    let condition = this.allFieldsConditions?.response?.data?.conditions;
    if (condition && condition.length > 0) {
      condition[0].condition_details.filter((value: any) => {
        if (value.parent_condition && value.parent_condition != '') {
          this.appService.parentCondition = value.parent_condition;
          this.appService.childCondition = value.keys;
          condition[0].condition_details.filter((typeValue: any) => {
            if (
              typeValue.keys == this.appService.parentCondition &&
              typeValue.type == value.type
            )
              this.appService.childConditionInfo.type = true;
          });
        }
      });
    }
  }

  // Handle mandatory fields and condition
  private handleMandatoryFieldsandCondition() {
    // Handle mandatory fields
    for (let i = 0; i < this.Fields?.length; i++) {
      for (let j = 0; j < this.Fields[i]?.field_details?.length; j++) {
        if (this.Fields[i].field_details[j]?.status == 'Y')
          this.appService.mandatoryField.push(
            this.Fields[i].field_details[j].keys
          );
      }
    }
    // Handle mandatory condition
    for (let i = 0; i < this.availableCondition?.length; i++) {
      for (
        let j = 0;
        j < this.availableCondition[i].condition_details.length;
        j++
      ) {
        if (this.availableCondition[i].condition_details[j].status == 'Y')
          this.appService.mandatoryCondition.push(
            this.availableCondition[i].condition_details[j].keys
          );
      }
    }
  }

  // Handle report edit data
  public async handleEditData() {
    // let data: any = await this.appService.getSavedReportData().toPromise();
    this.editReport = this.appService.isEditReport;
    // if (data.responseMessage === 'ok') {
    //   data.responseData.conditions.map((value) => {
    //     if (value.savedReportName == this.appService.isEditReport.report_name) {
    //       this.editReport = value;
    //     }
    //   });
    // }

    // this.loader = false;
    let choosenFeilds: [] =
      this.editReport.reportAdditionalInfo.savedReportInfo.chosenFields;
    let editAvailableCondition: any =
      this.editReport.reportAdditionalInfo.savedReportInfo.chosenConditions;
    let choosenConditions = Object.keys(editAvailableCondition);
    this.appService.auoCompParentEditVal = editAvailableCondition;
    for (let i = 0; i < this.Fields.length; i++) {
      for (let j = 0; j < this.Fields[i].field_details.length; j++) {
        if (choosenFeilds.length > 0) {
          for (let a = 0; a < choosenFeilds.length; a++) {
            if (choosenFeilds[a] == this.Fields[i].field_details[j].keys) {
              this.Fields[i].field_details[j].status = 'Y';
              break;
            } else {
              this.Fields[i].field_details[j].status = 'N';
            }
          }
        } else {
          this.Fields[i].field_details[j].status = 'N';
        }
      }
    }
    for (
      let a = 0;
      a < this.availableCondition[0].condition_details.length;
      a++
    ) {
      for (let b = 0; b < choosenConditions.length; b++) {
        if (
          choosenConditions[b] ==
          this.availableCondition[0].condition_details[a].keys
        ) {
          this.availableCondition[0].condition_details[a]['editValue'] =
            editAvailableCondition[choosenConditions[b]];
          this.availableCondition[0].condition_details[a].status = 'Y';
          break;
        } else {
          this.availableCondition[0].condition_details[a].status = 'N';
        }
      }
    }
  }

  // The following method is used to assigned the tab list value to one variable.
  public setAvailableFieldsandConditions() {
    this.tabList = [];
    if (this.appService.isFieldData)
      this.tabList.push({
        key: 'availableFields',
        name: 'Available fields',
        status: true,
      });
    this.tabList.push(
      {
        key: 'availableConditions',
        name: 'Available conditions',
        status: this.appService.isFieldData ? false : true,
      },
      { key: 'reviewSave', name: 'Review & save', status: false }
    );
    // if (!this.allFieldsConditions.response.data.fields) {
    //   this.tabList.shift();
    //   this.flagFieldsAvailable = false;
    // }

    // this.tabList[0].status = true;
  }

  public getFieldsCondition(data: any) {
    this.selectedFieldData[this.selectedFieldData.indexOf(data)] = data;
    this.handelTabRestriction('availableConditions');
  }

  public getavailableCondition(data: any) {
    this.allFieldsConditions.response.data.conditions = data;
    this.handelTabRestriction('reviewSave');
  }
  handleRedirect(status: boolean) {
    if (status) this.redirect.emit(true);
  }

  // The following method is used for field tab restriction. For example it restrict
  // when no field is selected but user try to go for next tab means, it will restrict that process.
  public handleFieldTabRestriction() {
    var fieldValidation = [];
    var sum = 0;
    this.selectedFieldData.forEach((element: any) => {
      let data = element.field_details.filter(
        (data: any) => data.status === 'Y'
      );
      fieldValidation.push(data.length);
    });
    fieldValidation.forEach((x) => (sum += x));
    return sum;
  }

  // Date picker mandatory fields
  private checkDateMandatory(filterData: any) {
    let dateConditions = filterData?.filter(
      (item) => item.type === 'datepicker'
    );
    return dateConditions?.length > 0;
  }

  // The following method is used for field and condition tab restriction. For example it restrict
  // when no field or condition is selected but user try to go for next tab means, it will restrict that process.
  public handelTabRestriction(id: string) {
    let value: any,
      sum = 0;
    switch (id) {
      case 'availableConditions':
        let fieldsLenght =
          this.allFieldsConditions.response.data.fields.length > 0
            ? true
            : false;
        value = !fieldsLenght
          ? false
          : this.handleFieldTabRestriction() <= 0
          ? true
          : false;
        break;

      case 'reviewSave':
        let data: any,
          dateMandatory: boolean = false;
        if (this.allFieldsConditions.response.data.conditions[0]) {
          data =
            this.allFieldsConditions.response.data.conditions[0].condition_details.filter(
              (data: any) => data.status === 'Y'
            );
        } else {
          data =
            this.allFieldsConditions.response.data.conditions.condition_details?.filter(
              (data: any) => data.status === 'Y'
            );
        }
        if (this.appService.isDateFieldMandatory)
          dateMandatory = !this.checkDateMandatory(data);
        let givenFieldsLenght =
          this.allFieldsConditions.response.data.fields.length > 0
            ? true
            : false;
        let sum = this.handleFieldTabRestriction();
        let fieldRestrictionValue = !givenFieldsLenght
          ? false
          : sum <= 0
          ? true
          : false;
        value = data.length <= 0 || dateMandatory ? true : false;
        value = value || fieldRestrictionValue;
        break;
    }
    // console.log("validaytion "+ id +" = = "+ value)
    return value;
  }

  // The following method is used for changing the radio component status in field and condition.
  public radioStatus(data: any) {
    for (let i = 0; i < this.activeModuleData.submenu.length; i++) {
      if (this.activeModuleData.submenu[i].menuName == data.menuName) {
        this.activeModuleData.submenu[i].activeStatus = 'Y';
      } else {
        this.activeModuleData.submenu[i].activeStatus = 'N';
      }
    }
    this.appService.selectedMenu = data.menuName;
    this.getAvailableTab();
  }
}
