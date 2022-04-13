import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservesPageRoutingModule } from './reserves-routing.module';

import { ReservesPage } from './reserves.page';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ReservesPageRoutingModule
  ],
  declarations: [ReservesPage]
})
export class ReservesPageModule {}
