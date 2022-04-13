import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalValorationPage } from './modal-valoration.page';

const routes: Routes = [
  {
    path: '',
    component: ModalValorationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalValorationPageRoutingModule {}
