import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexTitleSubtitle,
  ApexTheme,
} from 'ng-apexcharts';
import { TranslatePipe } from 'src/app/core-module/pipes/translate.pipe';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  theme: ApexTheme;
  colors: string[];
};

@Component({
  selector: 'app-show-report-bar-chart',
  templateUrl: './show-report-bar-chart.component.html',
  styleUrls: ['./show-report-bar-chart.component.scss'],
  providers: [TranslatePipe],
})
export class ShowReportBarChartComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: any;
  public chartInfo: any = {};
  @Input() chartData: any;
  @Input() summaryReportData: any;
  public summaryType: string;
  constructor() {}

  ngOnInit() {}

  private handleChartData() {
    this.chartInfo = {
      chartLabel: [],
      chartFirstSeries: [],
      chartSecondSeries: [],
    };
    let chartData = this.summaryReportData
      ? this.summaryReportData.list_body
      : this.chartData;
    this.summaryType = chartData[0]?.month
      ? 'month'
      : chartData[0]?.weeks
      ? 'weeks'
      : chartData[0]?.fortNights
      ? 'Bi-Weekly'
      : undefined;
    chartData.map((data) => {
      let seriesData =
        data['requestRaised(noOfPax)'].split('(')[0] -
        data['requestFulFilled(noOfPax)'].split('(')[0];

      // if (Number(data.conversionPercentage.split('%')[0])) {
      let summaryTypeValue =
        this.summaryType == 'Bi-Weekly'
          ? data['fortNights']
          : data[this.summaryType];
      this.chartInfo.chartLabel.push(this.summaryType + ' ' + summaryTypeValue);
      this.chartInfo.chartFirstSeries.push(seriesData);
      this.chartInfo.chartSecondSeries.push(
        Number(data['requestFulFilled(noOfPax)'].split('(')[0])
      );
      // }
    });
  }

  ngOnChanges(): void {
    this.handleChartData();
    if (
      this.chartInfo.chartFirstSeries.length ||
      this.chartInfo.chartSecondSeries.length
    ) {
      this.chartOptions = {
        series: [
          {
            name: 'fulfilledRequest',
            data: this.chartInfo.chartSecondSeries,
          },
          {
            name: 'totalRequest',
            data: this.chartInfo.chartFirstSeries,
          },
        ],
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: true,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        yaxis: {
          title: {
            text: 'No of requests',
            style: {
              fontFamily: 'var(--PRIMARYREGULARFONT)',
            },
          },
          labels: {
            style: {
              fontFamily: 'var(--PRIMARYREGULARFONT)',
            },
          },
        },
        xaxis: {
          title: {
            text: this.summaryType,
            style: {
              fontFamily: 'var(--PRIMARYREGULARFONT)',
            },
          },
          type: 'category',
          categories: this.chartInfo.chartLabel,
          labels: {
            style: {
              fontFamily: 'var(--PRIMARYREGULARFONT)',
            },
          },
        },
        dataLabels: {
          formatter: (value: any, { seriesIndex, w, dataPointIndex }: any) =>
            this.valueFormatter(value, seriesIndex, w, dataPointIndex),
        },
        tooltip: {
          y: {
            formatter: (value: any, { seriesIndex, w, dataPointIndex }: any) =>
              this.valueFormatter(value, seriesIndex, w, dataPointIndex),
          },
        },
        legend: {
          fontFamily: 'var(--PRIMARYREGULARFONT)',
          position: 'right',
          offsetY: 40,
        },
        fill: {
          opacity: 1,
        },
      };
    }
  }

  valueFormatter = (
    value: any,
    seriesIndex: number,
    w: any,
    dataPointIndex: number
  ) => {
    if (w.config.series[seriesIndex].name == 'fulfilledRequest') {
      return value;
    } else if (w.config.series[seriesIndex].name == 'totalRequest') {
      return value + w.config.series[0].data[dataPointIndex];
    }
  };
}
