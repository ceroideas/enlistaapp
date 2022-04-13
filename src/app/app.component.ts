import { Component } from '@angular/core';
import { AlertController, NavController, MenuController, ModalController, Platform } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { EventsService } from './services/events.service'
;
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import { OneSignal } from '@ionic-native/onesignal/ngx';

import { ApiService } from './services/api.service';

import { QrOkPage } from './client/qr-ok/qr-ok.page';
import { ModalValorationPage } from './client/home/schedule/modal-valoration/modal-valoration.page';

import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [Geolocation,StatusBar,GoogleAnalytics]
})
export class AppComponent {
  selectedIndex;
  appPages = [];
  user = JSON.parse(localStorage.getItem('ELuser'));

  showQr = false;

  public policyPages = [
    {
      title: 'Política de Privacidad',
      url: '/policy',
      // icon: 'mail'
    },
    {
      title: 'Soporte y FAQs',
      url: '/support',
      // icon: 'paper-plane'
    }
  ];
  constructor(public alert: AlertController, public nav: NavController, public auth: AuthService, public events: EventsService, public platform: Platform, public ga: GoogleAnalytics,
    private geolocation: Geolocation, private oneSignal: OneSignal, public api: ApiService, public menu: MenuController, public modal: ModalController, public statusBar: StatusBar) {
    this.events.subscribe('changeMenu',()=>{
      this.user = JSON.parse(localStorage.getItem('ELuser'));

      if (this.user) {
        if (this.user.role_id == 2) {
          this.appPages = [
            {
              title: 'HOME',
              url: '/home-c',
              withLogin: false,
              // icon: 'mail'
            },
            {
              title: 'PERFIL',
              url: '/profile',
              withLogin: true,
              // icon: 'mail'
            },
            {
              title: 'MIS RESERVAS',
              url: '/reserves',
              withLogin: true,
              // icon: 'paper-plane'
            },
            {
              title: 'CONTACTO',
              url: '/contact',
              withLogin: true,
              // icon: 'heart'
            }/*,
            {
              title: 'BUZON DE SUGERENCIAS',
              url: '/suggestions',
              // icon: 'heart'
            }*/
          ];

          this.showQr = false;
        }else{
          this.appPages = [
            {
              title: 'PERFIL',
              url: '/home-l',
              // icon: 'mail'
            },
            {
              title: 'GESTIÓN DE ESPACIOS',
              url: '/spaces',
              // icon: 'paper-plane'
            },
            {
              title: 'RESERVAS',
              url: '/reserves-l',
              // icon: 'heart'
            },
            /*{
              title: 'CLIENTES',
              url: '/customers',
              // icon: 'heart'
            },*/
            {
              title: 'CONTACTO',
              url: '/contact',
              // icon: 'heart'
            }
          ];

          this.showQr = true;
        }
      }
    });

    this.ga.startTrackerWithId("G-0TDJP33BFT")
    .then(() => {
        this.ga.trackView('home-c');
    })
    .catch(e => console.log('Error starting GoogleAnalytics', e));

    this.initializeApp();

  }

  toLogin()
  {
    this.auth.logOut();
    this.nav.navigateRoot('login');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.show();
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#1f1f1f');

      this.geolocation.getCurrentPosition().then((resp) => {
        localStorage.setItem('lat',resp.coords.latitude.toString());
        localStorage.setItem('lon',resp.coords.longitude.toString());
      }).catch((error) => {
        console.log('Error getting location', error);
      });
      
      this.events.publish('changeMenu');
      this.events.subscribe('openValoration',(r)=>{
        this.valoration(r);
      })

      this.initializeOnesignal();
    });
  }

  async valoration(e = null) {
    const modal = await this.modal.create({
      componentProps: {
        'reservation': e,
      },
      cssClass:'finalPayment',
      component: ModalValorationPage,
      backdropDismiss: false
    });
    return await modal.present();
  }

  logout()
  {
    this.api.logout();
    // this.alert.create({message:"Desea salir de la sesión?", buttons: [{
    //   text:"Si",
    //   handler: ()=>{
    //     this.auth.logOut();
    //     this.nav.navigateRoot('start');
    //   }
    // },{
    //     text:"No"
    //   }]}).then(a=>a.present());
  }

  async openQrOk(e = null) {
    const modal = await this.modal.create({
      componentProps: {
        'reservation': e,
      },
      cssClass:'finalPayment',
      component: QrOkPage,
      backdropDismiss: false
    });
    return await modal.present();
  }

  test()
  {
    this.api.llegada({id:2}).subscribe(data=>{
        this.alert.create({message:"La reserva ha sido canjeada"}).then(a=>{a.present();})
      },err=>{
    })
  }

  checkLogin(check,url)
  {
    if (check) {
      if (this.auth.isLoggedIn && this.auth.user.id != -1) {
        this.nav.navigateRoot(url);
      }else{
        this.api.loginMessage();
      }
    }else{
      this.nav.navigateRoot(url);
    }
  }

  initializeOnesignal()
  {
    this.oneSignal.startInit('d20e94e2-5622-472d-a77d-ed9b46752b9d', '320184418784');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe((jsondata) => {
     // do something when notification is received saveOneSignalId
     // console.log('received',jsondata,jsondata.payload.additionalData)
     let data = jsondata.payload.additionalData;

     this.events.publish('getAllReservations');
     this.events.publish('getMyReservations');
     this.events.publish('getReservations');

      if (this.user.role == 2) {
        switch (data.type) {

          case "llegada":
           
           this.events.publish('goQROk');
            this.api.getReservation(data.id).subscribe(data=>{
              this.openQrOk(data);
            });
            break;
          
          default:
            // code...
            console.log('notificación por defecto')
            break;
        }
      }else if (this.user.role == 3) {
        switch (data.type) {

          case "llegada":
           
            this.api.getReservation(data.id).subscribe(data=>{
              // this.openQrOk(data);
            });
            break;
          
          default:
            // code...
            console.log('notificación por defecto')
            break;
        }
      }
    });

    this.oneSignal.handleNotificationOpened().subscribe((jsondata) => {
      // do something when a notification is opened
      let data = jsondata.notification.payload.additionalData;
    });

    this.oneSignal.endInit();

    this.oneSignal.getIds().then((ids)=> {
      localStorage.setItem('onesignal_id',ids.userId);

      if (localStorage.getItem('ELuser')) {
        let onesignal_id = localStorage.getItem('onesignal_id');

        this.api.saveOneSignalId({id:this.user.id,onesignal_id:onesignal_id})
        .subscribe(
          data => {console.log('ok');},
          err => {console.log(err);}
        );
      }

    });
  }
}
