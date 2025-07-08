import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropIndexComponent } from './components/drag-drop-index/drag-drop-index.component';



@NgModule({
  declarations: [DragDropIndexComponent],
  imports: [ CommonModule],
  exports:[ DragDropIndexComponent]
})
export class DragAndDropModule { }
