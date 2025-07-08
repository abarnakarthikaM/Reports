import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { AppService } from 'src/app/core-module/service/app.service';
declare var $: any;
@Component({
  selector: 'app-year-picker',
  templateUrl: './year-picker.component.html',
  styleUrls: ['./year-picker.component.scss']
})
export class YearPickerComponent implements OnInit {
  public form: FormGroup = new FormGroup({});
  public selectedYear: string;
  constructor(private appService: AppService) { }
  public yearPicker: any;
  public submitted: boolean = false;
  public isReadOnly:boolean = false;
  @Input() public formData: any = [];

  @Input() public formValues: any = [];

  @Input() public conditionValue: any = {};

  public selectYear: any = [];
  ngOnInit(): void {
    this.yearPicker = this.formData[0]
    this.formData.forEach((data: any) => {
      this.form?.addControl(
        data.keys,
        new FormControl(
          this.conditionValue?.editValue &&
          this.conditionValue.editValue[data.keys],
          Validators.required
        )
      );
    });
  }
  public chooseYear(fieldId: any) {
    // Year picker key based array value framing for booked year and depature year
    if (fieldId == 'bookedYearFrom') {
      const currentYear = new Date().getFullYear();
      this.selectYear = Array.from({ length: 5 }, (_, i) => ((currentYear - 1) - i).toString());
    } else if (fieldId == 'bookedYearTo') {
      const currentYear = new Date().getFullYear();
      this.selectYear = Array.from({ length: 5 }, (_, i) => ((currentYear) - i).toString());
      const filteredYears = this.selectYear.filter(year => year > this.selectedYear);
      this.selectYear = filteredYears
    } else if (fieldId == 'departureYearFrom') {
      const currentYear = new Date().getFullYear();
      this.selectYear = Array.from({ length: 5 }, (_, i) => ((currentYear) - i).toString());
    } else {
      const currentYear = new Date().getFullYear();
      this.selectYear = Array.from({ length: 5 }, (_, i) => ((currentYear + 1) - i).toString());
      const filteredYears = this.selectYear.filter(year => year > this.selectedYear);
      this.selectYear = filteredYears
    }
    $('#' + fieldId).autocomplete({
      appendTo: $('#' + fieldId).parents('.cls-year-picker'),
      source: (request: any, response: any) => {
        // Filter the responseData to show matching results.
        const results = this.selectYear.filter((item) => {
          return item;
        }
        );
        if (results.length === 0) {
          results.push({ id: 'No results', value: 'No results' });
        }
        response(results);
      },
      // User Clicked the dropdown value handling.
      select: (event, ui) => {
        this.isReadOnly = true;
        if (fieldId == 'bookedYearFrom') {
          this.form.get("bookedYearTo").setValue("");
          this.selectedYear = ui.item.value;
        }
        if (fieldId == 'departureYearFrom') {
          this.form.get("departureYearTo").setValue("");
          this.selectedYear = ui.item.value;
        }
        if (ui.item.value !== 'No results') {
          this.form.controls[fieldId].setValue(ui.item.value); // Set the selected value in the form.
        }
      },
      minLength: 0,
    });
    // Trigger the autocomplete dropdown on click or focus.
    $('#' + fieldId).on('click', function () {
      $(this).autocomplete('search', $(this).val()); // Trigger the autocomplete search
    });
  }
}
