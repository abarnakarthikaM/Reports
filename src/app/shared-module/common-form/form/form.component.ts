import { Component, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Input() public items: any = {};
  @Input() public formData = {};
  @Input() public formValues = {};
  @Input() public updatedformData = {};
  @Input() public dropdownDefaultVal;
  @Output() dropdownSelectVal = new EventEmitter();
  @ViewChildren('dp') dropdownDetails: any;
  @ViewChildren('rb') radioButtonDetails: any;
  @ViewChildren('ac') autoCompleteDetails: any;
  @ViewChildren('date') datePickerDetails: any;
  @ViewChildren('ms') multiSelectDetails: any;
  @ViewChildren('adp') autocompleteDropdownDetails: any;
  @ViewChildren('yp') yearPickerDetails : any;
  constructor() { }

  // Date formatter is applied in the following code.
  public dateFormatter = (key: any, type: string) => {
    let date = new Date(
      this.formValues['dateRangeOfRequests'][key]
    ).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    return (this.formValues['dateRangeOfRequests'][key] =
      date.replace(',', '').split(' ')[1] +
      '-' +
      date.replace(',', '').split(' ')[0] +
      '-' +
      date.replace(',', '').split(' ')[2]);
  };
  // value emit to the parent component from dropdown to form 
  public getDropdownData(data:any){
    this.dropdownSelectVal.emit(data)
  }
  ngOnInit(): void {
    this.formData[0].type= this.items.type
  }
}
