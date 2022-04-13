import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { EventsService } from '../../services/events.service';

import { QrCPage } from '../qr-c/qr-c.page';
import { QrOkPage } from '../qr-ok/qr-ok.page';

@Component({
  selector: 'app-reserves',
  templateUrl: './reserves.page.html',
  styleUrls: ['./reserves.page.scss'],
})
export class ReservesPage implements OnInit {

  query;

  user = JSON.parse(localStorage.getItem('ELuser'));

  reserves:any = [];

  loaded = false;

  constructor(public api: ApiService, public modal: ModalController, public events: EventsService, public alert: AlertController, public loading: LoadingController) { }

  ngOnInit() {
    // this.events.destroy('openQrOk');
    this.events.destroy('getMyReservations');

    this.events.subscribe('getMyReservations',()=>{
      this.getMyReservations();
    })

    // this.events.subscribe('openQrOk',(e)=>{
    //   setTimeout(()=>{
    //     this.openQrOk(e);
    //   },500)
    // })

    this.getMyReservations();
  }

  getMyReservations()
  {
    this.api.getMyReservations(this.user.id).subscribe(data=>{
      let new_data = [];
      let obj = Object.keys(data);

      obj = obj.sort();

      for (let i of obj)
      {
        new_data.push({date:i, data: data[i]});
      }
      this.reserves = new_data;
      this.loaded = true;
    })
  }

  async openQr(e = null) {
    if (e.status == 0) {
      return false;
    }
    const modal = await this.modal.create({
      componentProps: {
        'reservation': e,
      },
      cssClass:'finalPayment',
      component: QrCPage
    });
    return await modal.present();
  }

  anular(id)
  {
    this.alert.create({message:"¿Desea anular la reserva seleccionada?",buttons: [{
      text:"Si",
      handler: ()=>{
        this.loading.create().then(l=>{
          l.present();

          this.api.anular(id).subscribe(data=>{
            this.getMyReservations();
            l.dismiss();
          })
        })
      }
    },{
      text:"No"
    }]}).then(a=>a.present());
  }

}
