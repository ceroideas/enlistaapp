import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { EventsService } from '../../services/events.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-spaces',
  templateUrl: './spaces.page.html',
  styleUrls: ['./spaces.page.scss'],
})
export class SpacesPage implements OnInit {

  query:any;

  spaces: any = [];

  user = JSON.parse(localStorage.getItem('ELuser'));
  
  constructor(public api: ApiService, public events: EventsService, public alert: AlertController, public loading: LoadingController) { }

  ngOnInit() {
    this.events.destroy('getSpaces');
    this.events.subscribe('getSpaces',()=>{
      this.getSpaces();
    })
    this.getSpaces();
  }

  getSpaces()
  {
    this.api.getSpaces(this.user.establishment.id).subscribe((data:any)=>{
      this.spaces = data.spaces;
    })
  }

  deleteSpace(s)
  {
    this.alert.create({message:"¿Quiere eliminar el espacio "+s.name+"?",buttons:[{
      text:"Si",
      handler: ()=>{
        this.loading.create().then(l=>{
          l.present();

          this.api.deleteSpace(s.id).subscribe(data=>{
            l.dismiss();
            this.getSpaces();
          })
        })
      }
    },{
      text:"No"
    }]}).then(a=>a.present());
  }

}
