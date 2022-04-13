import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalOkPageRoutingModule } from './modal-ok-routing.module';

import { ModalOkPage } from './modal-ok.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalOkPageRoutingModule
  ],
  declarations: [ModalOkPage]
})
export class ModalOkPageModule {}
