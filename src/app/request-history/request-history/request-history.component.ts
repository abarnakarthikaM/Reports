import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/core-module/service/app.service';
import { environment } from 'src/environments/environment';
declare var $: any;
@Component({
  selector: 'app-request-history',
  templateUrl: './request-history.component.html',
  styleUrls: ['./request-history.component.scss']
})
export class RequestHistoryComponent implements OnInit {
  public historyData: any;
  public headerData: any;
  public formData: any;
  public airlineCodeNote:any

  public modifiedData: any = undefined;
  constructor(private route: ActivatedRoute, private appService: AppService) { }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }


  ngOnInit(): void {
    this.airlineCodeNote=sessionStorage.getItem("themeCode");
    $(window).on('popstate', function () {
      window.location.reload();
      // window.location.replace('');
      const windowParent = (window.parent as any)
      if (typeof windowParent.reloadPage == 'function')
        windowParent.reloadPage();
    })

    setTimeout(() => {
      $('[data-toggle="popover"]').popover();
    })
    this.route.queryParams.subscribe(async params => {  
      // Iframe element getting from DOM
      // let getRequestName: string = (window?.frameElement as any)?.src?.split('?')[1];
      let getRequestName: string = this.appService.parentQuery?.split('?')[1]
      this.formData = {
        reportName: 'requestHistory',
        reportBasedOn: getRequestName.includes('tenderId') ? 'tender' : 'request',
      };
      let requestId = getRequestName.split('id=')[1];
      if (requestId?.includes('/')) {
        requestId = requestId.slice(0, requestId.indexOf('/'));
      }
      let tenderRequestId = getRequestName.split('tenderId=')[1]
      if (tenderRequestId?.includes('/')) {
        tenderRequestId = tenderRequestId.slice(0, tenderRequestId.indexOf('/'));
      }
      if (getRequestName?.includes('tenderId'))
        this.formData['tenderId'] = tenderRequestId;
      else
        this.formData['requestMasterId'] = requestId;

      var data = await this.appService
        .getDataHistoryDetails(this.formData)
        .toPromise();
      this.historyData = data.response.data.responseData;
      this.headerData = data.response.data.requestSummary;
      this.handleHistoryData();
    });

  }
  public handleHistoryData() {
    console.log(this.historyData)
    this.historyData.map((data: any) => {
      if (data.sub_details && data.sub_details.length > 0) {
        data.sub_details.map((sub: any) => {
          if (data.type != 'payment_pending' && data.type != 'timeline_extension') {
            if ((data.type == 'modified_request' && sub.heading == 'Request Details') || (data.type == 'tender_modifications' && sub.heading == 'Initial Details')) {
              console.log(sub.details);
              this.modifiedData = sub.details;
            }
            sub.details.map((d: any, i: number) => {
              d = d;
              sub['heads'] = Object.keys(sub.details[i]);
              if (sub.details[i].pnrSubDetails) sub['subHead'] = Object.keys(sub.details[i].pnrSubDetails);
              data['show'] = false;
            })
          } else {
            sub.details.map((paymentData: any) => {
              paymentData.map((finalData: any, i: number) => {
                sub['heads'] = Object.keys(finalData);
                if (finalData.pnrSubDetails && finalData.pnrSubDetails != '--') {
                  delete finalData.pnrSubDetails[0]['pnr_blocking_id'];
                  sub['subHead'] = Object.keys(finalData.pnrSubDetails[0]);
                } else if (
                  finalData.pnrSubDetails &&
                  finalData.pnrSubDetails == '--'
                ) {
                  sub['subHead'] = [];
                }
                if (i != 0) finalData.group_id = '';
              });
            });
            if(sub.gst_details) {
              sub?.gst_details?.map((gstData:any) => {
                sub['gstHead'] = Object.keys(gstData); 
              })
            }
            if(sub.pc_details) {
              sub?.pc_details?.map((pcData:any) => {
                sub['pcHead'] = Object.keys(pcData); 
              })
            }
          }

        })
      }
    });
  }

  public async historyDataParent(event: MouseEvent,data: any, type: any) {
    // Diasble the ctrl click in the firefox browser
    if (event.ctrlKey) {
      event.preventDefault();
    }
    const windowParent = (window.parent as any)
    if (typeof windowParent.callIframeHistoryDetails == 'function')
      windowParent.callIframeHistoryDetails(data, type)

    }

  handleToggle(index: number, status: boolean) {
    this.historyData[index].show = !this.historyData[index].show;
  }

}
