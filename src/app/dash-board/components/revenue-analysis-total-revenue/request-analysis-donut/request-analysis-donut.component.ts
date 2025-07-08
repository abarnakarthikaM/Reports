import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend,
  ApexTooltip,
  ApexTheme
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  pie: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  theme: ApexTheme;
  colors: string[];

};
@Component({
  selector: 'app-request-analysi-donut',
  templateUrl: './request-analysis-donut.component.html',
  styleUrls: ['./request-analysis-donut.component.scss']
})
export class RequestAnalysisDonutComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  @Input() reqAnalysisDonut: any;
  @Input() public legend: any
  emptyObj: boolean = true;
  @Input() activeTab: string = 'Monthly';
  constructor() {
  }

  ngOnChanges() {
    this.emptyObj = Object.keys(this.reqAnalysisDonut).length == 0;
    let paymentCompleted = Number(parseFloat(this.reqAnalysisDonut.getPaymentCompleted).toFixed(2));
    let partialCompleted = Number(parseFloat(this.reqAnalysisDonut.getPartialCompleted).toFixed(2));
    let yettoComplete = Number(parseFloat(this.reqAnalysisDonut.getYetCompleted).toFixed(2));
    let series = [paymentCompleted, partialCompleted, yettoComplete];
    let color = ['#1d5cac', '#f1a917', '#f73b3c'];
    const labels = ['Payment Completed', 'Payment Partially completed', 'Yet to make Payment'];

    if (!this.emptyObj) {
      this.chartOptions = {
        series: series.filter((_, index) => this.legend?.includes(index)),
        labels: labels.filter((_, index) => this.legend?.includes(index)),
        chart: {
          width: 300,
          type: "pie",
          offsetY: 50,
          offsetX: 50,
          // toolbar: {
          //   show: true,
          //   offsetX: 300,
          //   offsetY: 30,
          //   tools: {
          //     download:'<i class="fa fa-download cls-custom-download-icon" title="Download pie chart" aria-hidden="true"></i>',
          //   },
          //   export: {
          //     csv: {
          //       headerCategory: this.activeTab ? this.activeTab : 'Monthly',
          //       filename: 'Revenue Analysis'
          //     }
          //   },
          // }
        },
        dataLabels: {
          enabled: true
        },
        legend: {
          show: false,
        },
        tooltip: {
          style: {
            fontFamily: 'var(--PRIMARYREGULARFONT)'
          },
          y: {
            formatter: function (val: any) {
              function intlFormat(val) {
                return new Intl.NumberFormat().format(
                  Math.round(val * 10) / 10
                );
              }
              if (val) {
                if (Number(val) >= 1000000000) {
                  return intlFormat(Number(val) / 1000000000) + 'B';
                } else if (Number(val) >= 1000000) {
                  return intlFormat(Number(val) / 1000000) + 'M';
                } else if (Number(val) >= 1000) {
                  return intlFormat(Number(val) / 1000) + 'k';
                }
              }
              return Number(parseFloat(val)).toLocaleString('en');
            }
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                size: '100'
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ],
        colors: color.filter((_, index) => this.legend?.includes(index))
      };

    }
  }

  download() {
    // var chart = new ApexCharts(el, options);
    // var dataURL = chart.dataURI().then(({ imgURI, blob }) => {
    //   const { jsPDF } = window.jspdf
    //   const pdf = new jsPDF();
    //   pdf.addImage(imgURI, 'PNG', 0, 0);
    //   pdf.save("pdf-chart.pdf");
    // })
  }



  public Formatter(num: number) {
    let absNumber: any = (Math.abs(num) / 1000).toFixed(2);

    let sign = Math.sign(num);
    let finalVal = (sign * absNumber);

    return Math.abs(num) > 999 ? finalVal : Math.sign(num) * Math.abs(num);

  }
  ngOnInit(): void {
  }

}
