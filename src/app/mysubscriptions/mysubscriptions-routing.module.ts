import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MysubscriptionsPage } from './mysubscriptions.page';

const routes: Routes = [
  {
    path: '',
    component: MysubscriptionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MysubscriptionsPageRoutingModule {}
