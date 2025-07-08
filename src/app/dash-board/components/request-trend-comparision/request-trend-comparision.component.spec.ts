import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';

import { RequestTrendComparisionComponent } from './request-trend-comparision.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RequestTrendComparisionComponent', () => {
  let component: RequestTrendComparisionComponent;
  let fixture: ComponentFixture<RequestTrendComparisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        
      ],
      providers: [DashBoardService],
      declarations: [ RequestTrendComparisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestTrendComparisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
