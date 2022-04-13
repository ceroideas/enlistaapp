import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrOkPageRoutingModule } from './qr-ok-routing.module';

import { QrOkPage } from './qr-ok.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrOkPageRoutingModule
  ],
  declarations: [QrOkPage]
})
export class QrOkPageModule {}
