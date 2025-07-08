import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'src/app/core-module/service/app.service';
import { LocationService } from 'src/app/core-module/service/autocomplete.service';
declare var $: any;
declare var toastr: any;
@Component({
  selector: 'app-auto-complete-dropdown',
  templateUrl: './auto-complete-dropdown.component.html',
  styleUrls: ['./auto-complete-dropdown.component.scss']
})
export class AutoCompleteDropdownComponent implements OnInit {
  @Input() public formData: any;
  @Input() public conditionValue: any;
  // Initial value and user changed value
  @Input() public dropdownDefaultVal: any;
  // Dropdown clicked value emit to the parent 
  @Output() dropdownDataVal = new EventEmitter();
  public form: FormGroup = new FormGroup({});
  public dropDownData: any;
  public submitted: boolean = false;
  public responseData: any;
  public childResVal: any;
  public autoCompDrpDwnData: any;
  public isChildCondition: any;
  public dropDownValue: any = [];
  public childVal: any;
  
  constructor(private autocompleteCity: LocationService, private _appService: AppService) { }

  ngOnInit(): void {
  }
  ngOnChanges(): void {
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
    if (this._appService.summaryReportInfo.isSummaryReport) {
      if (this.conditionValue.hide_condition.length == 0)
        this.setupAutocomplete(this.dropDownData.keys, responseData, responseDetail);
      else if (this.conditionValue.hide_condition.length > 0)
        this._appService.summaryReportInfo['parentCondition'] = this.conditionValue.hide_condition;
    } else {
      this.setupAutocomplete(this.dropDownData.keys, responseData, responseDetail);
    }
  }

  // Reset the input value when click the dropdown
  public resetInput(dataKey: any) {
    this.form.get(dataKey).setValue("")
    if (dataKey == 'category') {
      const dropdownElement: any = document.getElementById('subCategory') as HTMLInputElement;
      dropdownElement.value = '';
    }
  
    if(dataKey == "userType") {
      const dropdownElement: any = document.getElementById('groupType') as HTMLInputElement;
      dropdownElement.value = '';
    }
    if (dataKey == 'subCategory' || dataKey == 'groupType')
      this._appService.auoCompSubCategory = false;
    else
      this._appService.auoCompParentEditEnable = false;
    this.autoCompDrpDwnData = ""
  }

  // Dropdown Child data handling when user hover the dropdown
  handleChildConditionData(id: any) {
    // Summary Report dropdown Api call after autoComplete value set.
    let agencyName = sessionStorage.getItem('summarydropDown')
    if (this._appService.summaryReportInfo.isdropDown && this._appService.summaryReportInfo.isSummaryReport) {
      let summaryRequest: any = {
        reportName: this.dropDownData.reportName,
        reportBasedOn: this.dropDownData.basedOn,
        agencyName: agencyName
      };
      let responseDetail: string = this.dropDownData.reportName;
      this.setupAutocomplete(id, summaryRequest, responseDetail);
    }
    if (
      this.conditionValue.keys == this._appService.childCondition &&
      this._appService.childConditionInfo.count == 0
    ) {
      this._appService.childConditionInfo.count++;
      if (this._appService.dataForUserType) {
        $('.position-label').addClass('cls-active-label');
        const before = this.dropDownData.dropDownValue;
        const after =
          this.dropDownData.responseData[this._appService.dataForUserType];
        if (before[0]?.id == after[0]?.id)
          this._appService.childConditionInfo.selectedInfo = after[0]?.id;
        this._appService.groupDataValue =
          after?.length > 0 ? after[0].id : undefined;
        if (
          this.dropDownData.responseData[this._appService.dataForUserType]
            .length == 0
        )
          toastr.error(
            'No ' +
            this._appService.childCondition +
            ' data is found for choosen ' +
            this._appService.parentCondition
          );
        if (
          this._appService.dataForUserType &&
          (!before || before[0] !== after[0] || this.dropDownValue.length == 0)
        ) {
          this.dropDownData['dropDownValue'] =
            this.dropDownData.responseData[this._appService.dataForUserType];
          this.dropDownValue = this.dropDownData.dropDownValue;
        }
        this.dropDownData.dropDownValue
        if (this.conditionValue.editValue) {
          this.dropDownData.dropDownValue.map((autoData: any) => {
            if (autoData.id == this.conditionValue.editValue) {
              this.autoCompDrpDwnData = autoData.value
            }
          })
        }
        this.valueSet(id, this.dropDownData.dropDownValue)
      }
      // Edit page value handling for the child dropdown.
      else if (this.conditionValue.editValue) {
        let childEditData: any = this._appService.isEditReport.reportAdditionalInfo.savedReportInfo.chosenConditions;
        let childEditVal = id == 'groupType' ? childEditData?.userType : childEditData?.category;
        this.childVal = this.conditionValue.condition_value[0].responseData[childEditVal];
        this.childVal.map((autoSubData: any) => {
          if (autoSubData.id == this.conditionValue.editValue) {
            if (this.autoCompDrpDwnData == undefined)
              this.autoCompDrpDwnData = autoSubData.value;
            this._appService.auoCompSubCategory = true;
            this.valueSet(id, this.childVal);
          }
        })
      }
    }

  }

  async setupAutocomplete(fieldId: string, responseData: any, responseDetail: string): Promise<void> {
    // Api calling for the all dropdown create and edit page.
    let data = await this._appService
      .getMultiSelectOption(responseData, responseDetail)
      .toPromise();
    if (this.conditionValue.keys == this._appService.childCondition) {
      this.dropDownData['responseData'] = data?.response?.data?.listData[0];
      this.dropDownData['dropDownValue'] = this._appService.dataForUserType
        ? data?.response?.data?.listData[0][this._appService.dataForUserType]
        : data?.response?.data?.listData[0][
        Number(Object.keys(data?.response?.data?.listData[0])[0])
        ];
      this.dropDownValue = [];
    }
    this._appService.summaryReportInfo.isdropDown = false;
    this.responseData = data.response.data.listData;
    // Edit page child data initial value setup function calling.
    if (this.conditionValue.parent_condition != "" && this.conditionValue.parent_condition != undefined) {
      this.handleChildConditionData(fieldId);
    }

    // Edit page auto fill value set in the input handling.
    if (this.conditionValue.editValue) {
      this._appService.groupPaceInfo.reportEditVal = this.conditionValue.editValue;
      this._appService.auoCompParentEditEnable = true;
      this.responseData.map((autoData: any) => {
        if (autoData.id == this.conditionValue.editValue || autoData.value == this.conditionValue.editValue ) {
          this.autoCompDrpDwnData = autoData.value;
        }
      })
    }
        // Gropupace report Dropdown initial value set for report type dropdown 
      if (this._appService.groupPaceInfo.reportDrpDwnValSet && fieldId == 'reportType') {
          if(this.dropdownDefaultVal.default)
          this.form.get('reportType').setValue(this.dropdownDefaultVal.id);
          this.autoCompDrpDwnData = this.dropdownDefaultVal.value;
      }

    // Call for the dropdown value handling Except Child data.
    if (this.conditionValue.parent_condition == "" || this.conditionValue.parent_condition == undefined) {
      this.valueSet(fieldId, this.responseData)
    }
    // Trigger the autocomplete dropdown on click or focus.
    $('#' + fieldId).on('click', function () {
      $(this).autocomplete('search', $(this).val()); // Trigger the autocomplete search
    });
  }

  // After Api call setup the value when click or hover for parent and child. 
  public valueSet(fieldId: string, responseValue: any) {
    $('#' + fieldId).autocomplete({
      appendTo: $('#' + fieldId).parents('.cls-auto-complete-dropdown'),
      source: (request: any, response: any) => {
        // Filter the responseData to show matching results.
        const results = responseValue.filter((item) => {
          if (item.value) {
            return item.value.toLowerCase().includes(request.term.toLowerCase())
          }
          else {
            item.value = item.id;
            return item.value.toLowerCase().includes(request.term.toLowerCase())
          }
        }
        );
        if (results.length === 0) {
          results.push({ id: 'No results', value: 'No results' });
        }
        response(results);
      },
      // User Clicked the dropdown value handling.
      select: (event, ui) => {
        if (ui.item.id !== 'No results') {
          if (this._appService.groupPaceInfo.reportDrpDwnValSet && fieldId == 'reportType') {
            this.form.get('reportType').setValue(ui.item.id);
            this.autoCompDrpDwnData = ui.item.value;
          }
          this._appService.groupPaceInfo.reportEditVal = ui.item.value;
          this._appService.summaryReportInfo.isValidChildCondition = true;
          this.autoCompDrpDwnData = ui.item.value;
          this.dropdownDataVal.emit(ui.item.id);
          this.form.controls[fieldId].setValue(ui.item.id); // Set the selected value in the form.
        }
        // When click the parent id and set the valriable for child response matching.
        if (this.dropDownData.keys == this._appService.childCondition) {
          this.isChildCondition = false;
          this._appService.groupDataValue = event.target.value;
          this._appService.childConditionInfo.selectedInfo = event.target.value;
        }
        if (this.dropDownData.keys == this._appService.parentCondition && this._appService.childConditionInfo.type) {
          this._appService.childConditionInfo.selectedInfo = undefined;
          this._appService.childConditionInfo.count = 0;
          this._appService.dataForUserType = event.target.value;
        }
      },
      minLength: 0,
    });

  }

}
