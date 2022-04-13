import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SchedulesPageRoutingModule } from './schedules-routing.module';

import { SchedulesPage } from './schedules.page';

import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    SchedulesPageRoutingModule
  ],
  declarations: [SchedulesPage]
})
export class SchedulesPageModule {}
