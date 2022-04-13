import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UniqueReservesPageRoutingModule } from './unique-reserves-routing.module';

import { UniqueReservesPage } from './unique-reserves.page';

import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    UniqueReservesPageRoutingModule
  ],
  declarations: [UniqueReservesPage]
})
export class UniqueReservesPageModule {}
