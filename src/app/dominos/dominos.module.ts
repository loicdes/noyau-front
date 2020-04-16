import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DominosComponent } from './dominos.component';
import { DominosRoutingModule } from './dominos-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [DominosComponent],
  imports: [
    CommonModule,
    DominosRoutingModule,
    SharedModule,
    NgxSpinnerModule
  ]
})
export class DominosModule { }
