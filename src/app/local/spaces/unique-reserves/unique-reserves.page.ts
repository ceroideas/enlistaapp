import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { ApiService } from '../../../services/api.service';
import { EventsService } from '../../../services/events.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-unique-reserves',
  templateUrl: './unique-reserves.page.html',
  styleUrls: ['./unique-reserves.page.scss'],
})
export class UniqueReservesPage implements OnInit {

  query:any;

  user = JSON.parse(localStorage.getItem('ELuser'));

  reserves:any = [];

  loaded = false;

  constructor(public api: ApiService, public route: ActivatedRoute, public events: EventsService, public alert: AlertController, public loading: LoadingController, public nav: NavController) { }

  ngOnInit() {
    this.events.destroy('getReservations');
    this.events.subscribe('getReservations',()=>{
      this.getReservations();
    });
    this.getReservations();
  }

  preloadSpace()
  {
    localStorage.setItem('preloadSpace',this.route.snapshot.params.id);
  }

  getReservations()
  {
    this.api.getReservations(this.route.snapshot.params.id).subscribe(data=>{
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

  anular(id)
  {
    this.alert.create({message:"¿Desea anular la reserva seleccionada?",buttons: [{
      text:"Si",
      handler: ()=>{
        this.loading.create().then(l=>{
          l.present();

          this.api.anularAdmin(id).subscribe(data=>{
            this.getReservations();
            l.dismiss();
          })
        })
      }
    },{
      text:"No"
    }]}).then(a=>a.present());
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
            this.alert.create({message:"La reserva ha sido canjeada"}).then(a=>{a.present();this.getReservations();})
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

  aceptar(id)
  {
    this.alert.create({message:"¿Desea aceptar la reserva seleccionada?",buttons: [{
      text:"Si",
      handler: ()=>{
        this.loading.create().then(l=>{
          l.present();

          this.api.aceptarAdmin(id).subscribe(data=>{
            this.getReservations();
            l.dismiss();
          })
        })
      }
    },{
      text:"No"
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
            this.alert.create({message:"La reserva ha sido canjeada"}).then(a=>{a.present();this.getReservations();})
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

}
