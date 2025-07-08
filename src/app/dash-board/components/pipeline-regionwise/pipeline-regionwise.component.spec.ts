import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';

import { PipelineRegionwiseComponent } from './pipeline-regionwise.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('PipelineRegionwiseComponent', () => {
  let component: PipelineRegionwiseComponent;
  let fixture: ComponentFixture<PipelineRegionwiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        
      ],
      providers: [DashBoardService],
      declarations: [ PipelineRegionwiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineRegionwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
