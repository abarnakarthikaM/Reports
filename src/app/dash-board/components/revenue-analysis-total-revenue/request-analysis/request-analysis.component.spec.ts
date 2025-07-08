import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';

import { RequestAnalysisComponent } from './request-analysis.component';

describe('RequestAnalysisComponent', () => {
  let component: RequestAnalysisComponent;
  let fixture: ComponentFixture<RequestAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
       
      ],
      providers: [DashBoardService],
      declarations: [ RequestAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
