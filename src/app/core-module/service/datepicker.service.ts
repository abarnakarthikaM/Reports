import { Injectable } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
// *************************************************

//  * Component Name------- datepicker service
//  * HTML & CSS -------------- Naveen.s
//  * Created date -------------- 18-Nov-2020
//  * Powered by --------------- Infiniti software solutions

// *************************************************
// tslint:disable-next-line: no-any
declare var $: any;
/**
 * Desc: date picker service
 */
@Injectable({
  providedIn: 'root',
})
export class DatepickerService {
  /**
   * Desc : FormGroup
   */
  public form: FormGroup = new FormGroup({});
  // Based on airline base we set the date range.
  public productType = sessionStorage.getItem('themeCode');
  /**
   * Desc : set calendar function
   */
  // tslint:disable-next-line: no-any
  public setCalendar(
    field: string,
    formGroup: FormGroup,
    formId: string,
    arrayIndex: number = 0,
    mindate: string = 'null',
    maxdate: string = 'null',
    header: boolean = false,
    numberOfMonths: number = 1
  ): void {
    let yearRange = this.productType === '6E' ? '-20:+3' : '-20:+20';
    this.form = formGroup;
    const minD: Date | null = mindate !== 'null' ? new Date(mindate) : null;
    const maxD: Date | null = maxdate !== 'null' ? new Date(maxdate) : null;
    // tslint:disable-next-line: no-any
    const comp: any = this;
    $(document).ready(() => {
      $('#' + field).datepicker({
        beforeShow: () => {
          $('.ui-datepicker').addClass('cls-infi-datepicker');
          $('.ui-datepicker-next,ui-datepicker-next').addClass(
            'waves-effect waves-circle waves-red'
          );
          setTimeout(() => {
            $('a.ui-state-default').attr('href', 'javascript:;');
          }, 0);
          if (header) {
            comp.setHeader(formId, arrayIndex);
          }
          return [true, ''];
        },
        dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        dateFormat: 'dd-M-yy',
        startDate: '-3d',
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        numberOfMonths: numberOfMonths || 1,
        minDate: minD,
        maxDate: maxD,
        autoClose: false,
        yearRange: yearRange,
        onSelect(date: Date): void {
          comp.form.controls[formId].setValue(date);
          switch (formId) {
            case 'fromDate':
              if (comp.form.controls.fromDate === '') {
                comp.form.controls.fromDate.setValue(date);
              }
              break;
            case 'toDate':
              if (comp.form.controls.toDate === '') {
                comp.form.controls.toDate.setValue(date);
              }
              break;
          }
          setTimeout(function () {
            var nextDiv = $('#' + field)
              .parents('.cls-tab-focus')
              .parent()
              .nextAll(":not('span')")[0];
            if (
              $('#' + field)
                .parent()
                .next('div')
                .find('input').length != 0
            ) {
              $('#' + field)
                .parent()
                .next('div')
                .find('input')
                .focus();
            } else if (nextDiv == undefined) {
              $('#' + field)
                .parents('.cls-form-tab')
                .siblings('.cls-button-group')
                .find('button:first-child')
                .focus();
            } else {
              $(nextDiv).find('input')[0].focus();
            }
          }, 1);
        },
        onChangeMonthYear(): void {
          setTimeout(() => {
            $('a.ui-state-default').attr('href', 'javascript:;');
          }, 0);
          if (header) {
            comp.setHeader(formId, arrayIndex);
          }
        },
        onClose(): void {
          $('#' + field).datepicker('destroy');
        },
      });
      // setTimeout(() => {
      //   if ($('#' + field).offset().top < 250) {
      //     $('.ui-datepicker').css('top', '150px');
      //   }
      // }, 200);
      $('#' + field).datepicker('show');
      $('#' + field).dblclick((e: any) => {
        e.preventDefault();
      });
    });
  }
  /**
   * Desc: Set headers for calendar
   */
  public setHeader(field: string, index: number): void {
    const value: string = (this.form.get('requestInfo') as FormArray).value[
      index
    ][field];
    let template = '<div class="datepicker-header">';
    template += value
      ? '<span class="date">' +
        $.datepicker.formatDate('d M, yy', new Date(value)) +
        '</span>'
      : '';
    template +=
      '<span>Book round trip for great savings</span><button type="button" class="reset-link">Reset</button></div>';
    setTimeout(() => {
      $('#' + field + index)
        .parents('.form-group')
        .append($('#ui-datepicker-div'));
      if (field === 'departure' || field === 'arrival') {
        $('#ui-datepicker-div div:first').before(template);
      }
    }, 0);
    //
  }
}
