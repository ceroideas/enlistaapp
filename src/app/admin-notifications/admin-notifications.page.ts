import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, NavController, AlertController, Platform, MenuController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { EventsService } from '../services/events.service';
import { MysubscriptionsPage } from '../mysubscriptions/mysubscriptions.page';

@Component({
  selector: 'app-admin-notifications',
  templateUrl: './admin-notifications.page.html',
  styleUrls: ['./admin-notifications.page.scss'],
})
export class AdminNotificationsPage implements OnInit {

  user = JSON.parse(localStorage.getItem('ELuser'));
  notifications;

  subs = [];

  constructor(public api: ApiService, public modal: ModalController, public alertCtrl: AlertController, public loading: LoadingController, public events:  EventsService) { }

  ngOnInit() {
    this.getAdminNotifications();

    this.events.subscribe('getAdminNotifications',()=>{
      this.getAdminNotifications();
    });

    this.api.getAdminSubscriptions(this.user.establishment.id).subscribe((data:any)=>{
      this.subs = data;
    })
  }
  getAdminNotifications()
  {
    this.api.getAdminNotifications(this.user.establishment.id).subscribe((data:any)=>{
      this.notifications = data;
      // console.log(data);
      this.events.publish('menuCounts', 0);
    })
  }

  viewNotification(n)
  {
    this.alertCtrl.create({header:n.title, message:n.message, buttons:
      [{text:"Ok"},{
        text:"Ocultar Notificación",
        handler:()=>{
          this.alertCtrl.create({message:"Ocultar la notificación seleccionada", buttons: [{text:"Si", handler:()=>{

            this.loading.create().then(l=>{
              l.present();

              this.api.hideNotification(n.id).subscribe(data=>{
                l.dismiss();
                this.getAdminNotifications();
              });
              //
            });

          }},{text:"Cancelar"}]}).then(a=>a.present());
        }
      }]}).then(a=>a.present());
  }

  async subsModal() {
    const modal = await this.modal.create({
      componentProps: {subs: this.subs},
      cssClass:'finalPayment',
      component: MysubscriptionsPage
    });
    return await modal.present();
  }

}
