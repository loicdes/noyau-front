import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PyramideComponent } from './pyramide.component';
import { PyramideRoutingModule } from './pyramide-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [PyramideComponent],
  imports: [
    CommonModule,
    PyramideRoutingModule,
    SharedModule,
    DragDropModule
  ]
})
export class PyramideModule { }
