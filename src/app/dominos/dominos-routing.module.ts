import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DominosComponent } from './dominos.component';


const routes: Routes = [
  {
    path: '',
    component: DominosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DominosRoutingModule { }
