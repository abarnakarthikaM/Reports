import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppService } from 'src/app/core-module/service/app.service';

import { CreateReportTabComponent } from './create-report-tab.component';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CreateReportTabComponent', () => {
  let component: CreateReportTabComponent;
  let fixture: ComponentFixture<CreateReportTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        
      ],
      providers: [AppService],
      declarations: [ CreateReportTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReportTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
