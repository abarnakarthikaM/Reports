import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VallarchiPlanComponent } from './vallarchi-plan.component';

describe('VallarchiPlanComponent', () => {
  let component: VallarchiPlanComponent;
  let fixture: ComponentFixture<VallarchiPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VallarchiPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VallarchiPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
