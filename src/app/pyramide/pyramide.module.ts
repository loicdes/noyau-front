import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PyramideComponent } from './pyramide.component';
import { PyramideRoutingModule } from './pyramide-routing.module';



@NgModule({
  declarations: [PyramideComponent],
  imports: [
    CommonModule,
    PyramideRoutingModule
  ]
})
export class PyramideModule { }
