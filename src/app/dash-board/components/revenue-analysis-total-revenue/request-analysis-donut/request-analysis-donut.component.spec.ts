import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';

import { RequestAnalysisDonutComponent } from './request-analysis-donut.component';

describe('RequestAnalysisDonutComponent', () => {
  let component: RequestAnalysisDonutComponent;
  let fixture: ComponentFixture<RequestAnalysisDonutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        
      ],
      providers: [DashBoardService],
      declarations: [ RequestAnalysisDonutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestAnalysisDonutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
