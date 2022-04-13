import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpacesPageRoutingModule } from './spaces-routing.module';

import { SpacesPage } from './spaces.page';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    SpacesPageRoutingModule
  ],
  declarations: [SpacesPage]
})
export class SpacesPageModule {}
