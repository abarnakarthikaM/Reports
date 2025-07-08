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
  ApexTheme,
} from 'ng-apexcharts';
import { TranslatePipe } from 'src/app/core-module/pipes/translate.pipe';

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
  selector: 'app-show-report-pie-chart',
  templateUrl: './show-report-pie-chart.component.html',
  styleUrls: ['./show-report-pie-chart.component.scss'],
  providers: [TranslatePipe],
})
export class ShowReportPieChartComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  public reqAnalysisDonut: any = {
    getPaymentCompleted: 116707.3,
    getPartialCompleted: 0,
    getYetCompleted: 19145.28,
  };
  emptyObj: boolean = true;
  public activeTab: string = 'Monthly';
  public chartInfo: any = {};
  @Input() chartData: any;
  @Input() summaryReportData: any;
  constructor() {}

  ngOnInit() {
  }

  private handleChartData() {
    this.chartInfo = {
      chartLabel: [],
      chartValue: [],
    };
    let chartData = this.summaryReportData
      ? this.summaryReportData.list_body
      : this.chartData;
    let summaryType: string = chartData[0]?.month
      ? 'month'
      : chartData[0]?.weeks
      ? 'weeks'
      : chartData[0]?.fortNights
      ? 'Bi-Weekly'
      : undefined;
    chartData.map((data) => {
      if (Number(data.conversionPercentage.split('%')[0]) > 0) {
        let summaryTypeValue =  summaryType == 'Bi-Weekly'? data['fortNights'] : data[summaryType];
        this.chartInfo.chartLabel.push(summaryType + ' ' + summaryTypeValue);
        this.chartInfo.chartValue.push(
          Number(data.conversionPercentage.split('%')[0])
        );
      }
    });
  }
  
  ngOnChanges(): void {
    this.handleChartData();
    if (this.chartInfo.chartValue.length > 0) {
      this.chartOptions = {
        series: this.chartInfo.chartValue,
        labels: this.chartInfo.chartLabel,
        chart: {
          width: 380,
          type: 'pie',
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
        legend: {
          fontFamily: 'var(--PRIMARYREGULARFONT)',
        },
      };
    }
  }
}