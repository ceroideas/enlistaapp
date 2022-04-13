import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalOkPage } from './modal-ok.page';

const routes: Routes = [
  {
    path: '',
    component: ModalOkPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalOkPageRoutingModule {}
