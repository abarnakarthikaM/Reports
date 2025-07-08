import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'src/app/core-module/service/app.service';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
})
export class RadioButtonComponent implements OnInit {
  public form: FormGroup = new FormGroup({});
  @Input() public formData: any;
  @Input() public conditionValue: any;
  public choosenValue: number | string;
  public radioButtonVal: any;

  constructor(public appService: AppService) {}

  async ngOnChanges() {
  //radio button dynamic request framing object creation 
    this.radioButtonVal = {
      'keys' : this.conditionValue.keys,
    }
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
    if (this.formData) this.handleControlValue();
    // this.addRadioControl();
  }

  // private addRadioControl() {
  //   this.form?.addControl(
  //     this.conditionValue.keys,
  //     new FormControl(
  //       this.conditionValue.editValue
  //         ? this.conditionValue.editValue[this.formData[0]['keys']]
  //         : this.choosenValue,
  //       Validators.required
  //     )
  //   );
  // }

  ngOnInit(): void {
    this.selectRadiobtn('Y',0);
    this.formData.map((item) => {
      if(!item.status) item.status = 'N';
    })
  }
  public handleControlValue() {
    this.formData.map((data) => {
      this.choosenValue = data.status == 'Y' ? data.keys : this.choosenValue;
    });
  }

  // When radio button is selected the following method is triggered.
  public selectRadiobtn(status: any, i: any) {
    this.formData.map((data: any) => (data.status = 'N'));
    this.formData[i]['status'] = status == 'Y' ? 'Y' : 'Y';
    this.choosenValue = this.formData[i].keys;
    this.radioButtonVal.value = this.formData[i]['keys'];
    if(this.appService.summaryReportInfo.isSummaryReport)
    this.appService.summaryReportInfo.summaryType = this.formData[i]['keys'];
    else
    this.appService.radiobuttonType =  this.radioButtonVal;
  }
}
