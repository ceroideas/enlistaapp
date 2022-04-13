import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrCPage } from './qr-c.page';

const routes: Routes = [
  {
    path: '',
    component: QrCPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrCPageRoutingModule {}
