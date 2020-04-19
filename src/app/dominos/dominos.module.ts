import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DominosComponent } from './dominos.component';
import { DominosRoutingModule } from './dominos-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [DominosComponent],
  imports: [
    CommonModule,
    DominosRoutingModule,
    SharedModule,
    NgxSpinnerModule,
    DragDropModule
  ]
})
export class DominosModule { }
