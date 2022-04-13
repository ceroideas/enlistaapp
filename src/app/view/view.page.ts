import { Component, OnInit, Input } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { EventsService } from '../services/events.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {

  @Input() data: any;

  constructor(public nav: NavController, public api: ApiService, public modal: ModalController, public events: EventsService) { }

  ngOnInit() {
    console.log(this.data);
  }

  close()
  {
    this.api.dismiss();

    // this.events.publish('openQrOk',this.reservation);
  }

}
