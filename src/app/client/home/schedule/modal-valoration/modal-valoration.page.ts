import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-modal-valoration',
  templateUrl: './modal-valoration.page.html',
  styleUrls: ['./modal-valoration.page.scss'],
})
export class ModalValorationPage implements OnInit {

  @Input() reservation:any;
  constructor(public nav: NavController, public api: ApiService) { }

  ngOnInit() {
    console.log(this.reservation);
  }

  goHome()
  {
    this.api.dismiss();
  }

}
