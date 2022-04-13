import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UniqueReservesPage } from './unique-reserves.page';

const routes: Routes = [
  {
    path: '',
    component: UniqueReservesPage
  },
  {
    path: 'create',
    loadChildren: () => import('../../reserves-l/create/create.module').then( m => m.CreatePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UniqueReservesPageRoutingModule {}
