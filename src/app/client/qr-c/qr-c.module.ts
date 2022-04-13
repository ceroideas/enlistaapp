import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrCPageRoutingModule } from './qr-c-routing.module';

import { QrCPage } from './qr-c.page';

import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QRCodeModule,
    QrCPageRoutingModule
  ],
  declarations: [QrCPage]
})
export class QrCPageModule {}
