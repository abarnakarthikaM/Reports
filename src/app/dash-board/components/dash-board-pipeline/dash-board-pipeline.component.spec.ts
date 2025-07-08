import { HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';

import { DashBoardPipelineComponent } from './dash-board-pipeline.component';

describe('DashBoardPipelineComponent', () => {
  let component: DashBoardPipelineComponent;
  let fixture: ComponentFixture<DashBoardPipelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashBoardPipelineComponent,DashBoardService,HttpClient]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashBoardPipelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
