import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalValorationPageRoutingModule } from './modal-valoration-routing.module';

import { ModalValorationPage } from './modal-valoration.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalValorationPageRoutingModule
  ],
  declarations: [ModalValorationPage]
})
export class ModalValorationPageModule {}
