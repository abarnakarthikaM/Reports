import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe } from 'src/app/core-module/pipes/translate.pipe';

import { SaveandPreviewTabComponent } from './saveand-preview-tab.component';

describe('SaveandPreviewTabComponent', () => {
  let component: SaveandPreviewTabComponent;
  let fixture: ComponentFixture<SaveandPreviewTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveandPreviewTabComponent,TranslatePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveandPreviewTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
