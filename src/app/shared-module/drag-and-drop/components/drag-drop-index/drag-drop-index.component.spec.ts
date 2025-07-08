import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragDropIndexComponent } from './drag-drop-index.component';

describe('DragDropIndexComponent', () => {
  let component: DragDropIndexComponent;
  let fixture: ComponentFixture<DragDropIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragDropIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragDropIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
