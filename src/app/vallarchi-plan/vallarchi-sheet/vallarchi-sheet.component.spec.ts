import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VallarchiSheetComponent } from './vallarchi-sheet.component';

describe('VallarchiSheetComponent', () => {
  let component: VallarchiSheetComponent;
  let fixture: ComponentFixture<VallarchiSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VallarchiSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VallarchiSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
