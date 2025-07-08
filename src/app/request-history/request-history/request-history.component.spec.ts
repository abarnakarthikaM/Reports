import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { RequestHistoryComponent } from './request-history.component';

describe('RequestHistoryComponent', () => {
  let sub_details =[]
  let component: RequestHistoryComponent;
  let fixture: ComponentFixture<RequestHistoryComponent>;
  let mockSomeService = {
    getData: () => {}
  }
  const fakeActivatedRoute = {
    snapshot: { data: sub_details as any }
  } as ActivatedRoute;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        
      ],
      providers: [ {provide: ActivatedRoute, useValue: fakeActivatedRoute,} ],
      declarations: [ RequestHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
