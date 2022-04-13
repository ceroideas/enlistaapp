import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpacesPage } from './spaces.page';

const routes: Routes = [
  {
    path: '',
    component: SpacesPage
  },
  {
    path: 'create/:id',
    loadChildren: () => import('./create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'create',
    loadChildren: () => import('./create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'schedule/:id',
    loadChildren: () => import('./schedule/schedule.module').then( m => m.SchedulePageModule)
  },
  {
    path: 'schedules/:id',
    loadChildren: () => import('./schedules/schedules.module').then( m => m.SchedulesPageModule)
  },
  {
    path: 'offers/:id',
    loadChildren: () => import('./offers/offers.module').then( m => m.OffersPageModule)
  },
  {
    path: 'unique-reserves/:id',
    loadChildren: () => import('./unique-reserves/unique-reserves.module').then( m => m.UniqueReservesPageModule)
  },
  {
    path: 'schedules',
    loadChildren: () => import('./schedules/schedules.module').then( m => m.SchedulesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpacesPageRoutingModule {}
