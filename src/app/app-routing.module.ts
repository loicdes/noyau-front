import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';


const routes: Routes = [
  {
    path: 'dominos',
    loadChildren: () => import('./dominos/dominos.module').then(m => m.DominosModule),
  },
  {
    path: 'pyramide',
    loadChildren: () => import('./pyramide/pyramide.module').then(m => m.PyramideModule),
  },
  {
    path: '',
    component: AccueilComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
