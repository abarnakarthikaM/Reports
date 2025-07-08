import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe } from 'src/app/core-module/pipes/translate.pipe';

import { DashBoardIndexComponent } from './dash-board-index.component';

describe('DashBoardIndexComponent', () => {
  let component: DashBoardIndexComponent;
  let fixture: ComponentFixture<DashBoardIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashBoardIndexComponent,TranslatePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashBoardIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
