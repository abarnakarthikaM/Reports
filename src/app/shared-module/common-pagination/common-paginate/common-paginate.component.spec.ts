import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPaginateComponent } from './common-paginate.component';

describe('CommonPaginateComponent', () => {
  let component: CommonPaginateComponent;
  let fixture: ComponentFixture<CommonPaginateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonPaginateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonPaginateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
