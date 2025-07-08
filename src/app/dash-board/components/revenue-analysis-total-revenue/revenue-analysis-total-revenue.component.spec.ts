import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';

import { RevenueAnalysisTotalRevenueComponent } from './revenue-analysis-total-revenue.component';

describe('RevenueAnalysisTotalRevenueComponent', () => {
  let component: RevenueAnalysisTotalRevenueComponent;
  let fixture: ComponentFixture<RevenueAnalysisTotalRevenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
       
      ],
      providers: [DashBoardService],
      declarations: [ RevenueAnalysisTotalRevenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueAnalysisTotalRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
