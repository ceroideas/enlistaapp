import { Component, OnInit, Input } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-qr-c',
  templateUrl: './qr-c.page.html',
  styleUrls: ['./qr-c.page.scss'],
})
export class QrCPage implements OnInit {

  data;
  @Input() reservation: any;

  constructor(public nav: NavController, public api: ApiService, public modal: ModalController, public events: EventsService) { }

  ngOnInit() {
    console.log(this.reservation);
    let r = this.reservation;
    this.data = JSON.stringify(
      {id:r.id,user_id:r.user_id,name:r.reservation.name,price:r.price,image:r.reservation.image,type:"reserve"}
      )
    console.log(this.data);

    this.events.destroy('goQROk');
    this.events.subscribe('goQROk',()=>{
      this.goQROk();
    });
  }

  goQROk()
  {
    this.api.dismiss();

    // this.events.publish('openQrOk',this.reservation);
  }

}
