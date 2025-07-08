import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';

import { PipelinePosComponent } from './pipeline-pos.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('PipelinePosComponent', () => {
  let component: PipelinePosComponent;
  let fixture: ComponentFixture<PipelinePosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        
      ],
      providers: [DashBoardService],
      declarations: [ PipelinePosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelinePosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
