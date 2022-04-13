import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-reserves-l',
  templateUrl: './reserves-l.page.html',
  styleUrls: ['./reserves-l.page.scss'],
})
export class ReservesLPage implements OnInit {

  query:any;

  user = JSON.parse(localStorage.getItem('ELuser'));

  reserves:any = [];

  loaded = false;

  constructor(public nav: NavController, public api: ApiService, public events: EventsService, public alert: AlertController, public loading: LoadingController) { }

  ngOnInit() {
    this.events.destroy('getAllReservations');
    this.events.subscribe('getAllReservations',()=>{
      this.getAllReservations();
    });
    this.getAllReservations();
  }

  removePreload()
  {
    localStorage.removeItem('preloadSpace');
  }

  getAllReservations()
  {
    this.api.getAllReservations(this.user.establishment.id).subscribe(data=>{
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

  selectOption(s)
  {
    this.alert.create({message:"Elija que hacer", buttons: [{
      text:"Lector de QR",
      handler:()=>{
        this.nav.navigateForward(['/qr']);
      }
    },{
      text:"Ingresar código de usuario",
      handler:()=>{
        this.openPrompt(s);
      }
    }]}).then(a=>a.present());
  }

  acceptReserve(s)
  {
    this.alert.create({message:"¿Desea cambiar el status de la reserva?", buttons: [{
      text:"Si",
      handler:()=>{
        this.loading.create().then(l=>{

          l.present();

          this.api.llegadaInvitado({code:s.code}).subscribe(data=>{
            l.dismiss();
            this.alert.create({message:"La reserva ha sido canjeada"}).then(a=>{a.present();this.getAllReservations();})
          },err=>{
            l.dismiss();
            var arr = Object.keys(err.error.errors).map(function(k) { return err.error.errors[k] });
            let errorMessage = arr[0][0];
            this.alert.create({message:errorMessage}).then(al=>{al.present()});
          })
        })
      }
    },{
      text:"No",
      handler:()=>{
        
      }
    }]}).then(a=>a.present());
  }

  openPrompt(s)
  {
    console.log(s);

    this.alert.create({message:"Ingrese el código de usuario",inputs:[
    {type:"text",name:"user_id",placeholder:"Código de usuario"}
    ], buttons: [{text:"Aceptar", handler:(a)=>{
      if (s.user_id == a.user_id) {
        console.log('okok',a.user_id,s.code);
        this.loading.create().then(l=>{

          l.present();

          this.api.llegadaManual({code:s.code,user_id:this.user.id}).subscribe(data=>{
            l.dismiss();
            this.alert.create({message:"La reserva ha sido canjeada"}).then(a=>{a.present();this.getAllReservations();})
          },err=>{
            l.dismiss();
            var arr = Object.keys(err.error.errors).map(function(k) { return err.error.errors[k] });
            let errorMessage = arr[0][0];
            this.alert.create({message:errorMessage}).then(al=>{al.present()});
          })
        })
      }else{
        this.alert.create({message:"El código de usuario ingresado no corresponde con el usuario que ha reservado"}).then(a=>a.present());
      }
    }},{text:"Cancelar"}]}).then(a=>a.present());
  }

  anular(id)
  {
    this.alert.create({message:"¿Desea anular la reserva seleccionada?",buttons: [{
      text:"Si",
      handler: ()=>{
        this.loading.create().then(l=>{
          l.present();

          this.api.anularAdmin(id).subscribe(data=>{
            this.getAllReservations();
            l.dismiss();
          })
        })
      }
    },{
      text:"No"
    }]}).then(a=>a.present());
  }

  aceptar(id)
  {
    this.alert.create({message:"¿Desea aceptar la reserva seleccionada?",buttons: [{
      text:"Si",
      handler: ()=>{
        this.loading.create().then(l=>{
          l.present();

          this.api.aceptarAdmin(id).subscribe(data=>{
            this.getAllReservations();
            l.dismiss();
          })
        })
      }
    },{
      text:"No"
    }]}).then(a=>a.present());
  }

}
