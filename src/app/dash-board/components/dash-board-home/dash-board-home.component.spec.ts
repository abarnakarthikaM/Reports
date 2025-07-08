import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslatePipe } from 'src/app/core-module/pipes/translate.pipe';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';

import { DashBoardHomeComponent } from './dash-board-home.component';

describe('DashBoardHomeComponent', () => {
  let component: DashBoardHomeComponent;
  let fixture: ComponentFixture<DashBoardHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        
      ],
      providers: [DashBoardService],
      declarations: [ DashBoardHomeComponent,TranslatePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashBoardHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
