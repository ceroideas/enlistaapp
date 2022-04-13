import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SchedulePage } from './schedule.page';

const routes: Routes = [
  {
    path: '',
    component: SchedulePage
  },
  {
    path: 'modal-ok',
    loadChildren: () => import('./modal-ok/modal-ok.module').then( m => m.ModalOkPageModule)
  },
  {
    path: 'modal-valoration',
    loadChildren: () => import('./modal-valoration/modal-valoration.module').then( m => m.ModalValorationPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SchedulePageRoutingModule {}
