import { Component, OnInit, Input } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-qr-ok',
  templateUrl: './qr-ok.page.html',
  styleUrls: ['./qr-ok.page.scss'],
})
export class QrOkPage implements OnInit {

  @Input() reservation:any;
  
  constructor(public nav: NavController, public api: ApiService, public modal: ModalController, public events: EventsService) { }

  ngOnInit() {
  }

  closeModal()
  {
    this.modal.dismiss();

    setTimeout(()=>{
      this.events.publish('openValoration',this.reservation);
    },2000)
  }

}
