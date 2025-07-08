import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowReportBarChartComponent } from './show-report-bar-chart.component';

describe('ShowReportBarChartComponent', () => {
  let component: ShowReportBarChartComponent;
  let fixture: ComponentFixture<ShowReportBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowReportBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowReportBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
