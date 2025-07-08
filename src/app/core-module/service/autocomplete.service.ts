import { Injectable } from '@angular/core';
import { AppService } from '../service/app.service';
import { FormGroup } from '@angular/forms';
// *************************************************

//  * Component Name------- autocomplete service
//  * HTML & CSS -------------- Naveen.s
//  * Created date -------------- 18-Nov-2020
//  * Powered by --------------- Infiniti software solutions

// *************************************************
// tslint:disable-next-line: no-any
declare var $: any;
export interface itemData {
  city?: string;
  name?: string;
}

export interface uiData {
  item?: itemData;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  /**
   * Desc: Form group to hold form values
   */
  public form: FormGroup = new FormGroup({});
  /**
   * schedule email
   */
  public scheduleEmail: any;
  //  Search Filter 
  public searchData: any;
  public autoComName: any = [];
  public responseData: any;
  public filteredData: any;
  public autoCompSearchData: any = [];
  private extraData: string | undefined = undefined;
  constructor(private _appService: AppService) {}
  /**
   * Desc: auto-complete method
   */
  public autoComplete(
    field: string,
    formGroup: FormGroup,
    formId: string,
    formDataVal: any,
    actionName: string,
    reportName: string,
    basedOn: string
  ): void {
    if (formDataVal.length < 3) {
      this._appService.autoCompleteValueClick = false;
    }
    if (formDataVal.length > 3) {
      this.extraData = formDataVal;
      formDataVal = formDataVal.slice(0, 3);
    } else this.extraData = undefined;
    this.form = formGroup;
    // return;
    $('#' + formId)
      .autocomplete({
        appendTo: $('#' + formId).parents('.cls-auto-complete'),
        select: (event: Event, ui: any) => {
          this._appService.autoCompSummaryDrpDwn = true;
          // Summary report auto complete value and dropdown api enable value updation.
          if (ui.item.id != '') {
            if (formId == 'agencyName') {
              this._appService.summaryReportInfo.isdropDown = true;
              sessionStorage.setItem('summarydropDown', ui.item.id);
              this._appService.autoCompSummaryDrpDwn = true;
              this._appService.summaryReportInfo.isValidChildCondition = false;
              // When click the autocomplete value reset the child dropdown data
              if (this._appService.summaryReportInfo.isChildReportEnable) {
                const dropdownElement: any = document.getElementById(
                  'userEmail'
                ) as HTMLInputElement;
                dropdownElement.value = '';
              }
            }
          }
          let conditionValue = sessionStorage.getItem('conditionValue')
            ? JSON.parse(sessionStorage.getItem('conditionValue'))
            : {};
          conditionValue[formId] = ui?.item?.value ? ui.item.value : ui.item.id;
          sessionStorage.setItem(
            'conditionValue',
            JSON.stringify(conditionValue)
          );
          if (
            ui.item.email !== 'No results' ||
            ui.item.sector !== 'No results' ||
            ui.item.agencyName !== 'No results' ||
            ui.item.posCity !== 'No results'
          ) {
            this.form.controls[field].setValue(ui.item.id);
            setTimeout(() => {
              $('#' + formId).val(ui?.item?.value ? ui.item.value : ui.item.id);
            }, 1);
          }
          return event;
        },
        // tslint:disable-next-line: no-any
        source: async (request: any, response: any) => {
          let results: any;
          response(results);
          if ((request.term as string).length > 2) {
            setTimeout(() => {
              $('#' + formId).addClass('cls-loading');
            }, 1);
            const formdata = {
              reportName: reportName,
              reportBasedOn: basedOn,
            };
            switch (field) {
              case 'email':
              case 'requestProcessedBy':
              case 'agentEmailId':
                formdata['email'] = formDataVal;
                break;
              case 'agentId':
                formdata['agentId'] = formDataVal;
                break;
              case 'flightNumber':
                formdata['flightNumber'] = formDataVal;
                break;
              case 'packageName':
                formdata['packageName'] = formDataVal;
                break;
              case 'travelAgentName':
                formdata['travelAgentName'] = formDataVal;
                break;
              case 'pos':
                formdata['posName'] = formDataVal;
                break;
              case 'pointOfSale':
                formdata['pointOfSale'] = formDataVal;
                break;
              case 'emailId':
                formdata['emailId'] = formDataVal;
                break;
              case 'travelAgency':
                formdata['agencyName'] = formDataVal;
                break;
              case 'originCode':
              case 'destinationCode':
              case 'origin':
              case 'destination':
                formdata['sectorName'] = formDataVal;
                break;
              case 'agencyEmailId':
                formdata['email'] = formDataVal;
                formdata['agencyEmailId'] = formDataVal;
                break;
              case 'groupName':
                formdata['email'] = formDataVal;
                formdata['groupName'] = formDataVal;
                break;
              case 'resolvedBy':
                formdata['email'] = formDataVal;
                formdata['resolvedBy'] = formDataVal;
                break;
              case 'agencyName':
                formdata['email'] = formDataVal;
                formdata['agencyName'] = formDataVal;
                break;
            }
            this.autoCompSearchData.push(request.term as string);
            if (this.autoCompSearchData.length > 1) {
              if (this.autoCompSearchData.length > 2)
                this.autoCompSearchData.shift();
              this.autoCompSearchData[0] = this.autoCompSearchData[0].slice(
                0,
                3
              );
              this.autoCompSearchData[1] = this.autoCompSearchData[1].slice(
                0,
                3
              );
              if (this.autoCompSearchData[0] != this.autoCompSearchData[1])
                this._appService.autoCompleteSearch = true;
              else this._appService.autoCompleteSearch = false;
            }

            if (
              this._appService.autoCompleteSearch ||
              (request.term as string).length == 3
            ) {
              var data = await this._appService
                .autoCompleteData(formdata, reportName)
                .toPromise();
              this._appService.autoCompleteSearch = false;
              this.responseData = data.response?.data?.listData;
              this.searchData = data.response?.data?.listData;
              // response data framing an object and pushing
              this.autoComName.push({
                name: field,
                val: this.searchData,
              });
              // Duplicate object removing and update new object
              this.autoComName = Array.from(
                this.autoComName
                  .reduce((map, item) => map.set(item.name, item), new Map())
                  .values()
              );
            } else {
              this.responseData = this.filterData(request.term, field);
            }
            if (this.extraData !== undefined && this.extraData?.length > 3)
              this.responseData = this.filterData(request.term, field);
            setTimeout(() => {
              $('#' + formId).removeClass('cls-loading');
            }, 1);
            results = this.responseData;
            this.scheduleEmail =
              field == 'sectorName' ? this.scheduleEmail : this.responseData;
            response(results);
            if (results?.length === 0) {
              results = [{ id: 'No results', value: 'No results' }];
            }
            response(results);
          }
        },
      })
      // tslint:disable-next-line: no-any
      .data('ui-autocomplete')._renderItem = (ul: any, item: any) => {
      if (item.id) {
        const $li = $("<li class='li'>")
          .data('item.ui-autocomplete', item)
          .append(item?.label ? item.label : item?.value ? item.value : item.id)
          .appendTo(ul);
        let autoStatus = [];
        // Add click event to the li element
        $li.on('click', (event) => {
          this._appService.autoCompletelistName.map((data: any) => {
            if (data.name == field) {
              data.status = 'Y';
            }
            autoStatus.push(data.status);
          });
          // Check all auto complete status Y or not
          if (autoStatus.includes('N')) {
            this._appService.autoCompleteValueClick = false;
          } else {
            this._appService.autoCompleteValueClick = true;
          }
        });

        return $li;
      }
      return $("<li class='li'>")
        .data('item.ui-autocomplete', item?.id ? item.id : item)
        .append(
          '<span class="data-secondary">' + item?.value
            ? item.value
            : item?.email
            ? item.email
            : item?.agencyName
            ? item.agencyName
            : item?.label
            ? item.label
            : item.value + '</span>'
        )
        .appendTo(ul);
    };
  }

  // Based on user input, filter the autocomplete data.
  public filterData(data, autoCompName) {
    this.autoComName?.map((autoVal: any) => {
      if (autoVal.name == autoCompName) {
        this.filteredData = autoVal?.val?.filter((item) => {
          let normalizedId =
            autoCompName == 'travelAgency' || autoCompName == 'agencyName'
              ? item.value
                ? item.value
                : item.id
              : item.value
              ? item.value.toLowerCase().replace(/\s+/g, '')
              : item.id.toLowerCase().replace(/\s+/g, '');
          return normalizedId.toLowerCase().includes(data.toLowerCase());
        });
      }
    });
    return this.filteredData;
  }
}
