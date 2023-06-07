import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, AlertController, Platform, MenuController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { EventsService } from '../services/events.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  user = JSON.parse(localStorage.getItem('ELuser'));
  e;

  constructor(public api: ApiService, public alertCtrl: AlertController, public loading: LoadingController, public events:  EventsService) { }

  ngOnInit() {
    this.getSubscriptions();

    this.events.subscribe('getSubscriptions',()=>{
      console.log('getSubscriptions')
      this.api.getSubscriptions(this.user.id).subscribe((data:any)=>{
        this.e = data;
        // console.log(data);
        // this.events.publish('menuCounts', 0);
      })
    })
  }
  getSubscriptions()
  {
    this.api.getSubscriptions(this.user.id).subscribe((data:any)=>{
      this.e = data;
      // console.log(data);
      this.events.publish('menuCounts', 0);
    })
  }

  viewNotification(n)
  {

    this.api.setViewed(n.id).subscribe(data=>{
      n.viewed = true;
    });
    this.alertCtrl.create({header:n.title, message:n.message, buttons:
      [{text:"Ok"},{
        text:"Borrar Notificación",
        handler:()=>{
          this.alertCtrl.create({message:"Borrar la notificación seleccionada", buttons: [{text:"Si", handler:()=>{

            this.loading.create().then(l=>{
              l.present();

              this.api.viewNotification(n.id).subscribe(data=>{
                this.e = data;
                l.dismiss();
              });
              //
            });

          }},{text:"Cancelar"}]}).then(a=>a.present());
        }
      }]}).then(a=>a.present());
  }

  desubscriptionPrompt(n)
  {
    this.alertCtrl.create({message: "¿Quiere quitar la suscripción a las ofertas de \""+n.name+"\"?", buttons: [
    {
      text:"Si, desuscribirme",
      handler:()=> {
        this.loading.create().then(l=>{
          l.present();

          this.api.deleteSubscription2({user_id: this.user.id, establishment_id: n.id}).subscribe(data=>{

            this.e = data;

            l.dismiss();

            this.alertCtrl.create({message:"Te has desuscrito de \""+n.name+"\""}).then(a=>a.present());

          })
        });
      }
    },{
      text:"No"
    }
    ]}).then(a=>a.present());
  }

}
