import { Injectable } from '@angular/core';
import { DashBoardService } from './dash-board.service';

@Injectable({
  providedIn: 'root'
})

export class DashboardDownloadService {

  constructor(private dashboardSevice: DashBoardService) { }
  public header = [];
  public chartDownload(data: any, type, legend: any, chartTittle, id, headerCategory) {

    let csvTempData = JSON.parse(JSON.stringify(data));

    const legendItems = legend;
    const disabledLegendNames: any = [];

    // Unselected items push into one variable
    legendItems.forEach((legendItem: HTMLElement) => {
      if (legendItem.classList.contains('apexcharts-inactive-legend')) {
        const legendName = legendItem.getAttribute('seriesname');
        disabledLegendNames.push(legendName);
      }
    });

    // Deleted from the unselected items in object for png and svg
    csvTempData.forEach((entry: any) => {
      disabledLegendNames.forEach((disabledName: any) => {
        delete entry[disabledName];
      });
    });
    // Deleted from the unselected items in object for csv
    csvTempData.map((data: any) => {
      Object.keys(data).forEach((key: any) => {
        disabledLegendNames.forEach((disabledName: any) => {
          if ((key == 'total_group_request' && disabledName == 'Noxofxrequest' || key == 'adhoc' && disabledName == 'Adhoc' || key == 'adhoc' && disabledName == 'Instantxquote' || key == 'series' && disabledName == 'Series' || key == 'conference' && disabledName == 'Conference' || key == 'flexible' && disabledName == 'Flexible') && chartTittle === 'Request trend period') {
            delete data[key]
            if (data[key] === undefined || data[key] === 'undefined undefined') {
              delete data[key];
            }
          } else if (key == 'pay_completed' && disabledName == 'PaymentxCompleted' || key == 'pay_completed' && disabledName == 'Paymentxcompleted' || key == 'pay_partially_completed' && disabledName == 'PaymentxPartiallyxCompleted' || key == 'pay_partially_completed' && disabledName == 'Paymentxpartiallyxcompleted' || key == 'yet_2_pay' && disabledName == 'YetxtoxMakexPayment') {
            delete data[key]
            if (data[key] === undefined || data[key] === 'undefined undefined') {
              delete data[key];
            }
          }
        });
      });
    });
    this.header = [];
    var airlineCode = sessionStorage.getItem("themeCode")
    let downloadResponseData = csvTempData.map((data) => {
      if (data.requested_month || data.month_index || data.country_code || data.pos_code || data.source || data.pos_country) {
        this.header.push(headerCategory);
      }
      if (data.total_group_request) {
        this.header.push("No of request")
      }
      if (airlineCode == 'WN' && data.adhoc) {
        this.header.push("Instant quote");
      } else if (data.adhoc) {
        this.header.push("Adhoc");
      }
      if (data.series && airlineCode != 'WN') {
        this.header.push("Series");
      }
      if (data.conference && airlineCode != 'WN' && airlineCode != 'JA') {
        this.header.push("Conference");
      }
      if (data.flexible) {
        this.header.push("Flexible");
      }
      if (data.pay_completed) {
        this.header.push("Payment Completed")
      }
      if (data.pay_partially_completed) {
        this.header.push("Payment Partially Completed");
      }
      if (data.yet_2_pay) {
        this.header.push("Yet to Make Payment");
      }
      this.header = [...new Set(this.header)];
      if (chartTittle === 'Request trend period') {
        const datas = { "No of request": data.total_group_request, "Flexible": data.flexible }
        if (airlineCode == 'WN') {
          datas['Instant quote'] = data.adhoc;
        } else {
          datas['Adhoc'] = data.adhoc;
          datas['Series'] = data.series;
        }
        if (airlineCode != 'JA') { datas['Conference'] = data.conference; }

        if (data.requested_month) {
          datas[headerCategory] = data.requested_month;
        } else {
          datas[headerCategory] = data.country_code;
        }
        return datas;
      }
      if (chartTittle === 'Revenue analysis') {
        const datas = { "Payment Completed": data.pay_completed, "Payment Partially Completed": data.pay_partially_completed, "Yet to Make Payment": data.yet_2_pay }
        if (data.month_index) {
          datas[headerCategory] = data.month_index;
        } else {
          datas[headerCategory] = data.country_code;
        }
        return datas;
      }
      if (chartTittle === 'Revenue comparision' ||
        // chartTittle === 'Revenue analysis' ||
        chartTittle === 'Pipeline revenue - for next  6 months' ||
        chartTittle === 'Pipeline revenue - for next  6 months comparison' ||
        chartTittle === 'Pipeline revenue - POS country wise' ||
        chartTittle === 'Pipeline revenue - top sector' ||
        chartTittle === 'Pipeline revenue - top stations'
      ) {
        const datas = { "Payment Completed": data.pay_completed, "Payment Partially Completed": data.pay_partially_completed, "Yet to Make Payment": data.yet_2_pay }
        if (data.month_index && data.year_index) {
          datas[headerCategory] = data.month_index + ' ' + data.year_index;
        } else if (chartTittle === 'Pipeline revenue - POS country wise') {
          datas[headerCategory] = data.pos_country;
        } else if (chartTittle === 'Pipeline revenue - top sector') {
          datas[headerCategory] = data.source + "-" + data.destination;
        } else if (chartTittle === 'Pipeline revenue - top stations') {
          datas[headerCategory] = data.pos_code;
        } else if (chartTittle === 'Revenue analysis' && data.requested_month) {
          datas[headerCategory] = data.month_index;
        } else {
          datas[headerCategory] = data.country_code;
        }
        return datas;
      }
    })

    this.dashboardSevice.downloadFile(downloadResponseData, this.header, chartTittle, type, id);
  }

}

