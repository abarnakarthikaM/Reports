import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { SavedReportListIndexComponent } from './saved-report-list-index.component';

describe('SavedReportListIndexComponent', () => {
  let component: SavedReportListIndexComponent;
  let fixture: ComponentFixture<SavedReportListIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedReportListIndexComponent,Router ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedReportListIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
