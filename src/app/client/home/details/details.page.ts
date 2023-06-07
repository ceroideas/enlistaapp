import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';

import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  providers: [CallNumber]
})
export class DetailsPage implements OnInit {

  e:any;
  loaded = false;
  user = JSON.parse(localStorage.getItem('ELuser'));
  subscribed = false;

  constructor(public api: ApiService, public route: ActivatedRoute, public alertCtrl: AlertController,
    private callNumber: CallNumber, public loading: LoadingController, public nav: NavController) { }

  ngOnInit() {
    this.loading.create().then((l)=>{
      l.present();

      this.api.getSpaces(this.route.snapshot.params.id).subscribe(data=>{
        this.e = data;
        this.loaded = true;
        this.checkSubscription();
        l.dismiss();
      })

    })
  }

  addParam(a)
  {
    if (this.e.anticipation == 0) {
      return this.alertCtrl.create({message: "No puedes realizar reservas en éste establecimiento por los momentos", buttons: ["Ok"]}).then(a=>a.present());
    }
    this.nav.navigateForward('home-c/schedule/'+a);
  }

  call(n)
  {
    this.callNumber.callNumber(n, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  openMap(e)
  {
    window.open('https://www.google.com/maps/@'+e.lt+','+e.ln+',15z','_blank');
  }

  subscriptionPrompt()
  {
    this.alertCtrl.create({message: "¿Quiere suscribirse a las ofertas de \""+this.e.name+"\"?", buttons: [
    {
      text:"Si, suscribirme",
      handler:()=> {
        this.loading.create().then(l=>{
          l.present();

          this.api.createSubscription({user_id: this.user.id, establishment_id: this.e.id}).subscribe(data=>{

            l.dismiss();

            this.e = data;

            this.alertCtrl.create({message:"Te has suscrito a \""+this.e.name+"\""}).then(a=>a.present());

            this.checkSubscription();

          })
        });
      }
    },{
      text:"No"
    }
    ]}).then(a=>a.present());
  }

  desubscriptionPrompt()
  {
    this.alertCtrl.create({message: "¿Quiere quitar la suscripción a las ofertas de \""+this.e.name+"\"?", buttons: [
    {
      text:"Si, desuscribirme",
      handler:()=> {
        this.loading.create().then(l=>{
          l.present();

          this.api.deleteSubscription({user_id: this.user.id, establishment_id: this.e.id}).subscribe(data=>{

            this.e = data;

            l.dismiss();

            this.alertCtrl.create({message:"Te has desuscrito de \""+this.e.name+"\""}).then(a=>a.present());

            this.checkSubscription();

          })
        });
      }
    },{
      text:"No"
    }
    ]}).then(a=>a.present());
  }

  checkSubscription()
  {
    let subs = this.e.subscriptions;

    if (subs.find(x=>x.user_id == this.user.id)) {
      this.subscribed = true;
    }else{
      this.subscribed = false;
    }

    console.log(this.subscribed);
  }

}
