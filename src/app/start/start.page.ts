import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { EventsService } from '../services/events.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  constructor(public nav: NavController, public menu: MenuController, public api: ApiService, public events: EventsService, public auth: AuthService) { }

  ngOnInit() {
    this.menu.enable(false);
  }

  addGuestUser()
  {
    localStorage.setItem('role','2');
    localStorage.setItem('ELuser',
      JSON.stringify(
      {"id":-1,"role_id":2,"name":"Usuario Invitado","email":"guest@user.com","avatar":"users/default.png","email_verified_at":null,"settings":{"locale":"es"},"onesignal_id":null,"status":1}
      )
      );

    this.events.publish('changeMenu');

    this.auth.login();
    this.menu.enable(true);

    this.nav.navigateRoot('/home-c');
  }

}
