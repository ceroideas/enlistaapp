import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminNotificationsPageRoutingModule } from './admin-notifications-routing.module';

import { AdminNotificationsPage } from './admin-notifications.page';

import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    AdminNotificationsPageRoutingModule
  ],
  declarations: [AdminNotificationsPage]
})
export class AdminNotificationsPageModule {}
