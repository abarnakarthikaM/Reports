import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowReportPieChartComponent } from './show-report-pie-chart.component';

describe('ShowReportPieChartComponent', () => {
  let component: ShowReportPieChartComponent;
  let fixture: ComponentFixture<ShowReportPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowReportPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowReportPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
