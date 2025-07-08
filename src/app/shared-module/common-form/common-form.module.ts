import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form/form.component';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { MultiSelectComponent } from './multi-select/multi-select.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { CoreModuleModule } from 'src/app/core-module/core-module.module';
import { CustomDirectiveModule } from 'src/app/custom-directive/custom-directive.module';
import { RadioButtonComponent } from './radio-button/radio-button.component'
import { AutoCompleteDropdownComponent } from './auto-complete-dropdown/auto-complete-dropdown.component';
import { YearPickerComponent } from './year-picker/year-picker.component'
@NgModule({
  declarations: [FormComponent, AutoCompleteComponent, DropdownComponent, MultiSelectComponent, DatePickerComponent, RadioButtonComponent, AutoCompleteDropdownComponent, YearPickerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModuleModule,
    CustomDirectiveModule
  ],
  exports: [FormComponent]
})
export class CommonFormModule { }
