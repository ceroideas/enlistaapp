import { Component, OnInit, Input } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { ApiService } from '../../../../services/api.service';
import { EventsService } from '../../../../services/events.service';

@Component({
  selector: 'app-modal-ok',
  templateUrl: './modal-ok.page.html',
  styleUrls: ['./modal-ok.page.scss'],
})
export class ModalOkPage implements OnInit {

  @Input() e:any;
  type;

  constructor(public nav: NavController, public api: ApiService, public modal: ModalController, public events: EventsService) { }

  ngOnInit() {
    if (localStorage.getItem('fromType')) {
      this.type = 1;
      localStorage.removeItem('fromType');
    }
  }

  goHome()
  {
    this.api.dismiss();
    if (this.type) {
      this.events.publish('getAllReservations');
      return this.nav.navigateRoot('/reserves-l');
    }
    this.nav.navigateRoot('/home-c');
  }

}
