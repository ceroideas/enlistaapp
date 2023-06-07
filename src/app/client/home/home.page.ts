import { Component, OnInit } from '@angular/core';
import { MenuController, LoadingController, AlertController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { EventsService } from '../../services/events.service';
// import { ParamsService } from '../../services/params.service';

import { Keyboard } from '@ionic-native/keyboard/ngx';

declare var moment:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  providers: [Keyboard]
})
export class HomePage implements OnInit {

  categories:any = [];
  category = 0;

  featured:any = [];
  closer:any = [];
  stars:any = [];

  query;

  disponibility;

  loader;

  date;

  minY = moment().format('Y-MM-DD');
  maxY = moment().add(3,'years').format('Y');

  px;

  user = JSON.parse(localStorage.getItem('ELuser'));

  count;

  constructor(public api: ApiService,
    private keyboard: Keyboard,
    public menu: MenuController,
    public alertCtrl: AlertController,
    public loading: LoadingController,
    public events: EventsService
    // public params: ParamsService, public events: EventsService
    ) {
    this.api.getCategories().subscribe(data=>{
      this.categories = data;

      console.log('home-c')
    })
  }

  ngOnInit() {
    this.menu.enable(true);
    this.getEstablishments(this.category);

    /*this.events.destroy('getCounts');
    this.events.subscribe('getCounts',()=>{
      this.getCounts();
    });*/
  }

  /*ionViewDidEnter()
  {
    this.getCounts();
  }*/
  
  /*getCounts()
  {
    this.api.getCountNotif(this.user.id).subscribe(data=>{
      this.count = data;
      this.events.publish('menuCounts',this.count);
    });
  }*/

  closeKeyboard(event) {
    if (event.key === "Enter") 
      this.keyupEnter();
  }

  keyupEnter() {
    this.keyboard.hide();
  }

  async showLoader()
  {
    this.loader = await this.loading.create();
    this.loader.present();
  }

  stopFilter()
  {
    return this.disponibility = null;
  }

  openPrompt()
  {
    this.alertCtrl.create({message:"¿Para cuántas personas quiere reservar?", inputs:[{
      name:"px",
      type:"text",
      placeholder:"Número de personas"
    }],buttons: [{
      text:"Filtrar",
      handler:(a)=>{

        if (!a.px) {
          return false;
        }

        this.px = a.px;

        this.disponibility = 1;
        this.getEstablishments(this.category);
        this.showLoader();

      }
    },{
      text:"Cancelar"
    }]}).then(a=>a.present());
  }

  getEstablishments(id, e = null)
  {
    let type1 = "";
    let type2 = "";
    if (this.disponibility) {
      type1 = "getAllEstablishmentsEmpty";
      type2 = "getEstablishmentsEmpty";
    }else{
      type1 = "getAllEstablishments";
      type2 = "getEstablishments";
    }
    if (id == 0) {
      this.api[type1]({lat: localStorage.getItem('lat'),lon: localStorage.getItem('lon'), date: this.date, px: this.px}).subscribe(data=>{
        if (e) {
          e.target.complete();
        }
        if (this.loader) {
          this.loader.dismiss();
          this.loader = null;
        }
        this.featured = Object.values(data[0]);
        this.closer = Object.values(data[1]);
        this.stars = Object.values(data[2]);
      })
    }else{
      this.api[type2]({id: id,lat: localStorage.getItem('lat'),lon: localStorage.getItem('lon'), date: this.date, px: this.px}).subscribe(data=>{
        if (e) {
          e.target.complete();
        }
        if (this.loader) {
          this.loader.dismiss();
          this.loader = null;
        }
        this.featured = Object.values(data[0]);
        this.closer = Object.values(data[1]);
        this.stars = Object.values(data[2]);
      })
    }
  }

  addParam(i)
  {
    
  }

  selectCategory(e)
  {
    this.category = e.detail.value;
    console.log(e.detail.value);
    this.getEstablishments(e.detail.value);
  }

  e;

  subscriptionPrompt(e)
  {
    this.e = e;
    this.alertCtrl.create({message: "¿Quiere seguir las ofertas de \""+this.e.name+"\"?", buttons: [
    {
      text:"Si, seguir",
      handler:()=> {
        this.loading.create().then(l=>{
          l.present();

          this.api.createSubscription({user_id: this.user.id, establishment_id: this.e.id}).subscribe(data=>{

            l.dismiss();

            // this.e = data;
            this.featured = [];
            this.closer = [];
            this.stars = [];

            this.alertCtrl.create({message:"Estás siguiendo a \""+this.e.name+"\""}).then(a=>a.present());

            this.getEstablishments(this.category);

          })
        });
      }
    },{
      text:"No"
    }
    ]}).then(a=>a.present());
  }

  desubscriptionPrompt(e)
  {
    this.e = e;
    this.alertCtrl.create({message: "¿Quiere dejar de seguir las ofertas de \""+this.e.name+"\"?", buttons: [
    {
      text:"Si, dejar de seguir",
      handler:()=> {
        this.loading.create().then(l=>{
          l.present();

          this.api.deleteSubscription({user_id: this.user.id, establishment_id: this.e.id}).subscribe(data=>{

            // this.e = data;
            this.featured = [];
            this.closer = [];
            this.stars = [];

            l.dismiss();

            this.alertCtrl.create({message:"Has dejado de seguir a \""+this.e.name+"\""}).then(a=>a.present());

            this.getEstablishments(this.category);

          })
        });
      }
    },{
      text:"No"
    }
    ]}).then(a=>a.present());
  }

}
