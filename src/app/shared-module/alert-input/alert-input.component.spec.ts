import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppService } from 'src/app/core-module/service/app.service';

import { AlertInputComponent } from './alert-input.component';

describe('AlertInputComponent', () => {
  let component: AlertInputComponent;
  let fixture: ComponentFixture<AlertInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        
      ],
      providers: [AppService],

      declarations: [ AlertInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AlertInputComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
