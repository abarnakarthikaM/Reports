import { Component, Input } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import {AppService} from '../../../core-module/service/app.service'
import { LocationService } from 'src/app/core-module/service/autocomplete.service';
declare var $:any;

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss'],
})
export class AutoCompleteComponent {
  constructor(private autocompleteCity: LocationService,private _appService: AppService) {}
  public form: FormGroup = new FormGroup({});
  public submitted: boolean = false;

  @Input() public formData: any = [];

  @Input() public formValues: any = [];

  @Input() public conditionValue: any = {};

  public autoStatus: any = [];

  public isArrowKeyPressed = false;
  ngOnInit(): void {}

  ngOnChanges() {
    this.formData.forEach((data: any) => {
      this.form?.addControl(
        data.keys,
        // new FormControl(this.formValues, Validators.required)
        new FormControl(
          this.conditionValue?.editValue
            ? this.conditionValue.editValue[data.keys]
              ? this.conditionValue.editValue[data.keys]
              : this.conditionValue.editValue
            : '',
          Validators.required
        )
      );
    });
  }

 // Following method is used for validation for each autocomplete condition
  public stringValidation(event: any,data:any, type:string) {
    if (event.target.value.length === 1 && event.target.value[0] === ' ') { 
         event.target.value = '';
    }
    if(type == 'text') {
      this._appService.autoCompleteValueClick = true;
    }
    let strOnly = undefined;
    let boolVar =
      (data == 'agentEmailId' || data == 'agencyEmailId') &&
      event.target.value.length > 0;
    if (data == 'processId' || data == 'issueId' || data == 'referenceId' || data == 'fileId')
      strOnly = /^[0-9]\d*$/;
    else if (data == 'ipAddress') strOnly = /^[0-9.,]+$/;
    else if (data == 'flightNumber') strOnly = /^[a-zA-Z0-9_.-]*$/;
    else if (boolVar) strOnly = /^[a-zA-Z0-9@_.\-]*$/;
    else if (data == 'travelAgency' || data == 'agencyName') strOnly = /^[a-zA-Z0-9.@_ ]+$/;
    else strOnly = /^[a-zA-Z.@_]+$/;
    
      let inputChar = String.fromCharCode(event.charCode);
      if (!strOnly.test(inputChar)) {
        event.preventDefault();
      }
 
  }
// WCAG Development and auto complete button enter validation 
  public dropdownFocus(event: any, field: any, item: any) {
    if (event.target.value.length > 2) {
      var value = event.target.value;
      setTimeout(() => {
        var listLength = $('#' + item.conditionValue.keys).siblings('ul').find('li').length;
        var listElem = $('#' + item.conditionValue.keys).siblings('ul').find('li');
        var listElement = [], listData = [];

        listElem.each((key, value) => {
          listElement.push(value);
          listData.push($(value).text());
        });

        var indexPlace = listData.indexOf(value);
        if (event.which == 40) {
          this.isArrowKeyPressed = true;
          event.preventDefault();
          (indexPlace == -1) ? $('#' + item.conditionValue.keys).val(listElem.eq(0).text()) : (indexPlace + 1 == listLength) ? $('#' + item.conditionValue.keys).val(listElem.eq(0).text()) : $('#' + item.conditionValue.keys).val(listElem.eq(indexPlace + 1).text());
        }
        else if (event.which == 38) {
          event.preventDefault();
          if (indexPlace == -1) {
            $('#' + item.conditionValue.keys).val(value);
            return false;
          } else {
            (indexPlace == 0) ? $('#' + item.conditionValue.keys).val(listElem.eq(listLength - 1).text()) : $('#' + item.conditionValue.keys).val(listElem.eq(indexPlace - 1).text());
          }
        }
      }, 10);

      // Key down and enter validation for autocomplete
      if (event.which == 13 && this.isArrowKeyPressed) {
        this._appService.autoCompleteValueClick = true;
        event.preventDefault();
        var currentValue = $('#' + item.conditionValue.keys).val();
        var bool = (currentValue == 'No results');
        setTimeout(() => {
          (bool) ? $('#' + item.conditionValue.keys).val('') : $('#' + item.conditionValue.keys).val(currentValue);
          $('#' + item.conditionValue.keys).siblings('ul').hide();
        }, 15);
        this._appService.autoCompletelistName.map((data: any) => {
          if (data.name == field) {
            data.status = 'Y'
          }
          this.autoStatus.push(data.status)
        })
        if (this.autoStatus.includes('N')) {
          this._appService.autoCompleteValueClick = false;
        } else {
          this._appService.autoCompleteValueClick = true;
        }
        this.isArrowKeyPressed = false;
      }
      if (this.autoStatus.length == 0) {
        this._appService.autoCompleteValueClick = false;
      } else {
        this._appService.autoCompleteValueClick = true;
      }
      if (event.which == 8 || event.which == 46) {
        this._appService.autoCompleteValueClick = false;
        this._appService.autoCompSummaryDrpDwn = false;
      }
    }
  }

  // AutoComplete value reset when focus the outside
  public onBlur(id:any,type: any) {
    if(!this._appService.autoCompSummaryDrpDwn && type != 'text') {
      this.form.get(id).setValue('')
      if(this._appService.summaryReportInfo.isChildReportEnable && id == 'agencyName'){
        const dropdownElement: any = document.getElementById('userEmail') as HTMLInputElement;
        dropdownElement.value = '';
        this._appService.summaryReportInfo.isValidChildCondition = false;
      }
    }
  }
  // Method to trigger the autocomplete service.
  public citySearch(id: string, reportName: string, basedOn: string): void {
    const searchLength = (this.form as FormGroup).controls[id].value;
    if (this.conditionValue.type == 'autocomplete')
      this.autocompleteCity.autoComplete(
        id,
        this.form as FormGroup,
        id,
        searchLength,
        'placesApi',
        reportName,
        basedOn
      );
  }

}