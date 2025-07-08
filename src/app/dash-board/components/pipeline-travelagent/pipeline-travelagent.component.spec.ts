import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslatePipe } from 'src/app/core-module/pipes/translate.pipe';
import { AppService } from 'src/app/core-module/service/app.service';
import { DashBoardService } from 'src/app/core-module/service/dash-board.service';

import { PipelineTravelagentComponent } from './pipeline-travelagent.component';

describe('PipelineTravelagentComponent', () => {
  let component: PipelineTravelagentComponent;
  let fixture: ComponentFixture<PipelineTravelagentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        
      ],
      providers: [AppService,DashBoardService],
      declarations: [ PipelineTravelagentComponent,TranslatePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineTravelagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
