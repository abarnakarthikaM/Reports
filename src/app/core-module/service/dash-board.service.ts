import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
declare let CryptoJS: any;
import html2canvas from 'html2canvas';
import { ConfigService } from './config.service';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class DashBoardService {
  public themeColor = new BehaviorSubject('default');

  constructor(private http: HttpClient, private configService: ConfigService) { }
  chartModules: object = {
    "request_trend_year": "request-trend",
    "request_trend_comparision": "request-trend-comparison",
    "revenue_analysis": "revenue-analysis",
    "pipeline_departure": "pipeline-departure"
  };


  public httpPost(moduleName: string, inputData: any, actionName: string): Observable<any> {
    // AES encryption
    const data: string = CryptoJS.AES.encrypt(JSON.stringify(inputData), CryptoJS.enc.Base64.parse(this?.configService?.get('en')), { mode: CryptoJS.mode.ECB }).toString();
    const formData = new FormData();
    formData.append('data', data);
    let backEndURL = environment.BACKEND_URL + '' + this.chartModules[moduleName];
    return this.http.post(backEndURL, formData, {
      observe: 'response',
      responseType: 'text'
    }).pipe(map(data => {
      let responseData: any = {};
      responseData = data.body;
      responseData.status = data.status;
      return responseData;
    }));

  }

  public updateThemeColor(value: string) {
    this.themeColor.next(value);
  }

  public dateFormat(currdate: Date) {
    var year = currdate.getUTCFullYear();
    let newday = currdate.getUTCDate() < 10 ? `0${currdate.getUTCDate()}` : currdate.getUTCDate();
    let newmonth = (currdate.getUTCMonth() + 1) < 10 ? `0${(currdate.getUTCMonth() + 1)}` : (currdate.getUTCMonth() + 1);
    return `${year}-${newmonth}-${newday}`;
  }


  public kFormatter(num: number | any) {
    // let absNumber: any = (Math.abs(num) / 1000).toFixed(2);
    // let sign = Math.sign(num);
    // let finalVal = (sign * absNumber) + 'k';
    let finalVal = parseFloat(num).toFixed(2);
    return finalVal;
  }

  public convertArrayType(array: any, type: number, keys: string[]) {
    let cmpData = [];
    for (let i = 0; i < (array.responseData.length / type); i++) {
      cmpData.push(this.convertTimeRange(array.responseData.slice(((i * type)), ((i + 1) * type)), i, keys));
    }
    return {
      "responseData": cmpData,
      "responseMessage": "ok"
    };
  }

  public convertRequestType(array: any, type: string) {
    let conData = [];
    array?.responseData?.map((data: any) => {
      if (type == 'Revenue in USD') {
        let tempdata = {
          label: data.month_index + ' ' + data.year_index,
          month_index: data.month_index,
          pay_completed: data.pay_completed,
          pay_partially_completed: data.pay_partially_completed,
          sort_order: data.sort_order,
          year_index: data.year_index,
          yet_2_pay: data.yet_2_pay,
          country_code: data.country_code,
          pos_country: data.pos_country,
          destination: data.destination,
          source: data.source,
          total_amount_for_sorting: data.total_amount_for_sorting,
          pos_code: data.pos_code,
          agent_name: data.agent_name
        };
        conData.push(tempdata);
      }
      if (type == 'No of Passenger') {
        let tempdata = {
          label: data.month_index + ' ' + data.year_index,
          month_index: data.month_index,
          pay_completed: data.passenger_count_pay_completed,
          pay_partially_completed: data.passenger_count_pay_partially_completed,
          sort_order: data.sort_order,
          year_index: data.year_index,
          yet_2_pay: data.passenger_count_yet_2_pay,
          country_code: data.country_code,
          pos_country: data.pos_country,
          destination: data.destination,
          source: data.source,
          total_amount_for_sorting: data.total_amount_for_sorting,
          pos_code: data.pos_code,
          agent_name: data.agent_name
        };
        if (tempdata.label === 'undefined undefined') {
          tempdata.label = data.label;
        };
        conData.push(tempdata);
      }
      if (type == 'No of Departure') {
        let tempdata = {
          label: data.month_index + ' ' + data.year_index,
          month_index: data.month_index,
          pay_completed: data.departure_count_pay_completed,
          pay_partially_completed: data.departure_count_pay_partially_completed,
          sort_order: data.sort_order,
          year_index: data.year_index,
          yet_2_pay: data.departure_count_yet_2_pay,
          country_code: data.country_code,
          pos_country: data.pos_country,
          destination: data.destination,
          source: data.source,
          total_amount_for_sorting: data.total_amount_for_sorting,
          pos_code: data.pos_code,
          agent_name: data.agent_name
        };
        if (tempdata.label === 'undefined undefined') {
          tempdata.label = data.label;
        };
        conData.push(tempdata);
      }
    });
    return {
      "responseData": conData,
      "responseMessage": "ok"
    };
  }

  public convertTimeRange(array: any, index: number, keys: string[]) {
    let dummyObj = {
      a: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
    };
    array.map(data => {
      dummyObj.a += data[keys[0]];
      dummyObj.b += data[keys[1]];
      dummyObj.c += data[keys[2]];
      dummyObj.d += data[keys[5]];
      dummyObj.e += data[keys[6]];
    });
    return {
      [keys[0]]: dummyObj.a,
      [keys[1]]: dummyObj.b,
      [keys[2]]: dummyObj.c,
      [keys[3]]: `${array[0][keys[3]]} - ${array[(array.length - 1)][keys[3]]}`,
      [keys[4]]: array[0][keys[4]],
      [keys[5]]: dummyObj.d,
      [keys[6]]: dummyObj.e,
    };
  }

  //CSV download
  public downloadFile(data, header, fileName, type, id, filename = 'data') {

    if (type == 'csv') {
      let csvData = this.ConvertToCSV(data, header);
      let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
      let dwldLink = document.createElement("a");
      let url = URL.createObjectURL(blob);
      let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
      if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
      }
      dwldLink.setAttribute("href", url);
      dwldLink.setAttribute("download", fileName + ".csv");
      dwldLink.style.visibility = "hidden";
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
    } else if (type == 'png') {
      setTimeout(() => {
        const div: any = document.getElementById(id);

        // backup for download png header
        // const headerDiv = document.createElement('div');
        // console.log(headerDiv);
        // headerDiv.textContent = '';
        // div.style.padding = '25px';
        // headerDiv.style.fontFamily = 'var(--PRIMARYMEDIUMFONT)';
        // headerDiv.style.fontWeight = 'bold';
        // headerDiv.style.fontSize = '16px';
        const legendData = div.querySelectorAll('.apexcharts-legend.apexcharts-align-center');
        legendData.forEach((legend: any) => legend.style.overflow = 'hidden');
        // div.insertBefore(headerDiv, div.firstChild);
        html2canvas(div).then((canvas) => {
          const link = document.createElement('a');
          link.download = fileName + '.png';
          canvas.toBlob((blob: any) => {
            const url = URL.createObjectURL(blob);;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            // headerDiv.remove();
            div.style.padding = '0px';
            // $('#fn-dynamic-loader').removeClass('d-block').addClass('d-none');
          });
        });
      }, 0);
    } else if (type == 'svg') {
      // $('#fn-dynamic-loader').removeClass('d-none').addClass('d-block');
      setTimeout(() => {
        const tooltipElements = document.querySelectorAll('.apexcharts-tooltip');
        const tooltipElements1 = document.querySelectorAll('.apexcharts-xaxistooltip');
        const tooltipElements2 = document.querySelectorAll('.apexcharts-yaxistooltip');
        const xcrosshairs = document.querySelectorAll('.apexcharts-xcrosshairs');
        const ycrosshairs = document.querySelectorAll('.apexcharts-ycrosshairs');

        xcrosshairs.forEach((data: any) => data.style.opacity = 0);
        ycrosshairs.forEach((data: any) => data.style.opacity = 0);

        // Hide tooltips
        tooltipElements.forEach((tooltip: any) => tooltip.style.display = 'none');
        tooltipElements1.forEach((tooltip: any) => tooltip.style.display = 'none');
        tooltipElements2.forEach((tooltip: any) => tooltip.style.display = 'none');

        const svgDiv: any = document.getElementById(id);
        svgDiv.style.display = 'flex'; // Enable flexbox layout
        svgDiv.style.flexDirection = 'column';
        svgDiv.style.justify = 'space-around'; // Center vertically
        if (window.innerWidth > 1366) {
          svgDiv.style.transform = 'scale(0.9)'; // Scale content to 80% of its original size
        }
        // Remove overflow
        svgDiv.style.overflow = 'hidden';


        // backup for download svg header
        // const headerDiv = document.createElement('div');

        // console.log(headerDiv);
        // // headerDiv.textContent = header;
        // headerDiv.style.padding = '20px';
        // headerDiv.style.fontFamily = 'var(--PRIMARYMEDIUMFONT)';
        // headerDiv.style.fontWeight = 'bold';
        // headerDiv.style.fontSize = '16px';
        // svgDiv.insertBefore(headerDiv, svgDiv.firstChild);
        const legendElements = svgDiv.querySelectorAll('.apexcharts-legend');
        legendElements.forEach((legend: any) => legend.style.inset = 'auto 0px 5px 20px');
        const xTooltipElements = svgDiv.querySelectorAll('.apexcharts-xaxis-title-text');
        xTooltipElements.forEach((tooltip: any) => tooltip.setAttribute('y', '320'));

        // Center the SVG content horizontally
        svgDiv.style.margin = 'auto';

        const svgContent = new XMLSerializer().serializeToString(svgDiv);
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
        const svgLink = document.createElement('a');
        svgLink.href = URL.createObjectURL(svgBlob);
        svgLink.download = fileName + '.svg';
        svgLink.click();
        // headerDiv.remove();  
        tooltipElements.forEach((tooltip: any) => tooltip.style.display = 'block');
        tooltipElements1.forEach((tooltip: any) => tooltip.style.display = 'block');
        tooltipElements2.forEach((tooltip: any) => tooltip.style.display = 'block');
        // $('#fn-dynamic-loader').removeClass('d-block').addClass('d-none');
        svgDiv.style.display = 'block';
        if (window.innerWidth > 1366) {
          svgDiv.style.transform = 'unset'; // Scale content to 80% of its original size
        }
      }, 0);
    }

  }

  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';

    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = (i + 1) + '';
      for (let index in headerList) {
        let head = headerList[index];

        line += ',' + array[i][head];
      }
      str += line + '\r\n';
    }
    return str;
  }
}
