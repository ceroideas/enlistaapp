import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrOkPage } from './qr-ok.page';

const routes: Routes = [
  {
    path: '',
    component: QrOkPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrOkPageRoutingModule {}
