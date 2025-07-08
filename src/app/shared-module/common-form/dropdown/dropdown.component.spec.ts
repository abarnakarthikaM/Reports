import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppService } from 'src/app/core-module/service/app.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DropdownComponent } from './dropdown.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslatePipe } from 'src/app/core-module/pipes/translate.pipe';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        
      ],
      providers: [AppService],
      declarations: [ DropdownComponent,TranslatePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
