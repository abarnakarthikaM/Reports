import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowReportListComponent } from './show-report-list.component';
import { AppService } from 'src/app/core-module/service/app.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ShowReportListComponent', () => {
  let component: ShowReportListComponent;
  let fixture: ComponentFixture<ShowReportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        
      ],
      providers: [AppService],
      declarations: [ ShowReportListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
