import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { OneSignal } from '@ionic-native/onesignal/ngx';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { firebaseConfig } from '../environments/environment';

import { GooglePlus } from '@ionic-native/google-plus/ngx';

import { Facebook } from '@ionic-native/facebook/ngx';
import { SignInWithApple } from '@ionic-native/sign-in-with-apple/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [HttpClientModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule,
  
  AngularFireModule.initializeApp(firebaseConfig), //Modulo 1 a importar
  AngularFireAuthModule // Modulo 2 a importar

  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, OneSignal, GooglePlus, Facebook, SignInWithApple],
  bootstrap: [AppComponent],
})
export class AppModule {}
