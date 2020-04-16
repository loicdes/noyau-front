import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PyramideComponent } from './pyramide.component';


const routes: Routes = [
  {
    path: '',
    component: PyramideComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PyramideRoutingModule { }
