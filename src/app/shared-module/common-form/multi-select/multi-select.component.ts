import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'src/app/core-module/service/app.service';

declare var $: any;

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
})
export class MultiSelectComponent implements OnInit {
  @Input() public formData: any;
  @Input() public conditionValue: any;
  // {
  //   "label": "groupCategory",
  //   "formControl": "groupCategory",
  //   "dropdownData": [
  //     {
  //       "groupCategoryId": "1",
  //       "groupCategory": "Test"
  //     },
  //     {
  //       "groupCategoryId": "2",
  //       "groupCategory": "Test pack"
  //     }
  //   ]
  // }

  public submitted: boolean = false;

  public dropDownValue: any = [];

  public form: FormGroup = new FormGroup({});

  constructor(public appService: AppService) {}

  async ngOnInit(): Promise<void> {
    // this.dropDownValue = data.responseData.countryList;
    setTimeout(() => {
      $('select').formSelect();
    });
  }

  async ngOnChanges() {
    if (this.formData.keys)
      this.form?.addControl(
        this.formData[0].keys,
        new FormControl(
          this.conditionValue.editValue
            ? this.conditionValue.editValue
            : '',
          Validators.required
        )
      );
    let responseData: any = {
      reportName: this.formData[0].reportName,
      reportBasedOn: this.formData[0].basedOn,
    };
    let responseDetail: string = this.formData[0].reportName;
    // Service call for the multi select condition is made in following code.
    let data = await this.appService
      .getMultiSelectOption(responseData, responseDetail)
      .toPromise();
      if (data?.responseCode === 0 && data?.response?.data?.listData){
        setTimeout(() => {
          $('select').formSelect();
        });
        this.dropDownValue = data?.response?.data?.listData;
      }

  }
}
