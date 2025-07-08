import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';

import { RevenueAnalysisComparisionComponent } from './revenue-analysis-comparision.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RevenueAnalysisComparisionComponent', () => {
  let component: RevenueAnalysisComparisionComponent;
  let fixture: ComponentFixture<RevenueAnalysisComparisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        
      ],
      // providers: [DashBoardService],
      declarations: [ RevenueAnalysisComparisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueAnalysisComparisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
