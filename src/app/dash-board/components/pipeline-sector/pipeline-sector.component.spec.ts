import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';

import { PipelineSectorComponent } from './pipeline-sector.component';

describe('PipelineSectorComponent', () => {
  let component: PipelineSectorComponent;
  let fixture: ComponentFixture<PipelineSectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        
      ],
      providers: [DashBoardService],
      declarations: [ PipelineSectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
