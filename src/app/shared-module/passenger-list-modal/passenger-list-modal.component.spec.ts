import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerListModalComponent } from './passenger-list-modal.component';

describe('PassengerListModalComponent', () => {
  let component: PassengerListModalComponent;
  let fixture: ComponentFixture<PassengerListModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassengerListModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
