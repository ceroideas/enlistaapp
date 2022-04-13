import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservesLPageRoutingModule } from './reserves-l-routing.module';

import { ReservesLPage } from './reserves-l.page';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ReservesLPageRoutingModule
  ],
  declarations: [ReservesLPage]
})
export class ReservesLPageModule {}
