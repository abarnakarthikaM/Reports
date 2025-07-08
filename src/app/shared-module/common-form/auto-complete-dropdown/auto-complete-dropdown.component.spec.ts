import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCompleteDropdownComponent } from './auto-complete-dropdown.component';

describe('AutoCompleteDropdownComponent', () => {
  let component: AutoCompleteDropdownComponent;
  let fixture: ComponentFixture<AutoCompleteDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoCompleteDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCompleteDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
