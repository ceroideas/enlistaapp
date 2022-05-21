import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ModalOkPage } from './modal-ok/modal-ok.page';
import { ModalValorationPage } from './modal-valoration/modal-valoration.page';
import { ApiService } from '../../../services/api.service';
import { EventsService } from '../../../services/events.service';

declare var moment:any;

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  
  schedules:any = [];
  step;
  details:any;
  loaded = false;

  date;
  hour:any;
  notification;
  hours: any = [];

  allHours:any = [];

  min;
  max;

  minY = moment().format('Y-MM-DD');
  maxY = moment().add(3,'years').format('Y');

  dni;

  user = JSON.parse(localStorage.getItem('ELuser'));

  showDni = false;

  px;

  constructor(public api: ApiService, public modal: ModalController, public events: EventsService, public route: ActivatedRoute, public toast: ToastController, public alert: AlertController, public loading: LoadingController) { }

  ngOnInit() {
    this.loading.create().then(l=>{
      
      l.present();

      this.api.getSpace(this.route.snapshot.params.id).subscribe(data=>{
        this.details = data;
        this.loaded = true;

        l.dismiss();
      })
    })
  }

  reserve()
  {
    var nifRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
    var nieRegex = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;

    if (this.showDni) {
      if (!this.dni.match(nifRegex) && !this.dni.match(nieRegex)) {
        return this.alert.create({message:"Ingrese un DNI correcto", buttons:[{text:"Ok"}]}).then(a=>a.present());
      }
    }

    this.alert.create({message:"¿Desea reservar para la fecha y hora seleccionados?", buttons:[
    {
      text:"Confirmar",
      handler:()=>{

        this.loading.create().then(l=>{
          l.present();

          this.api.saveReservation({

            id:this.hour.value,
            hour:this.hour.show,
            date: moment(this.date).format('Y-MM-DD'),
            px:this.px,
            reservation_id:this.route.snapshot.params.id,
            notification:this.notification,
            user_id:this.user.id,
            // dni:this.dni

          }).subscribe(data=>{

            l.dismiss();

            this.reserveModal({e:data});

            this.date = null;
            this.hours = [];
            this.allHours = [];
            this.hour = null;
            this.notification = null;
            this.step = null;
            this.showDni = false;

          }, err=>{
            
            l.dismiss();

            this.alert.create({message:err.error}).then(a=>a.present());
          })
        })

      }
    },{
      text:"Cancelar"
    }]}).then(a=>a.present());
  }

  async reserveModal(data) {
    const modal = await this.modal.create({
      componentProps: data,
      cssClass:'finalPayment',
      component: ModalOkPage
    });
    return await modal.present();
  }

  getHours()
  {
    this.showDni = false;
    this.hours = [];
    this.hour = null;

    // console.log(this.date);

    let day = new Date(this.date);
    let d = day.getDay();

    this.api.getHours({id:this.details.id, day: d, date: moment(this.date).format('Y-MM-DD')}).subscribe((data:any)=>{

      this.allHours = data;

      if (data.message) {
        return this.toast.create({message:data.message, duration:3000}).then(t=>t.present());
      }
      if (!data.length) {
        return this.toast.create({message:"No se han obtenido resultados para el día seleccionado", duration:3000}).then(t=>t.present());
      }
      for (let i of data)
      {

        let now = moment().format("HH:mm");
        let today1 = moment().format("Y-MM-DD");
        let to = moment("2021-01-01 "+i.hour_to).format("Y-MM-DD HH:mm");

        // if (to == "00:00") {
        //   to = "24:00";
        // }

        let start = moment("2021-01-01 "+i.hour_from).startOf('hour');

        // console.log(start,i.hour_to);
        // console.log(today1,moment(this.date).format('Y-MM-DD'));

        if (start.format("Y-MM-DD HH:mm") > to) {
          console.log('se cierra al otro dia');
          to = moment(to).add(1,'days').format("Y-MM-DD HH:mm");
        }else{
          console.log('se cierra el mismo dia');
        }

        do {

          // if (to == "23:59" && start.format("HH:mm") > to) {
          //   break;
          // }
          
          let today = start.format("HH:mm");
          console.log(today);

          if (today1 == moment(this.date).format('Y-MM-DD')) {
            
            // console.log('es el dia de hoy');

            if (today > now) {
              this.hours.push(
                {value:i.id, show:start.format("HH:mm")}
              );
            }

          } else {

            this.hours.push(
              {value:i.id, show:start.format("HH:mm")}
            );

          }

          /*if (today1 != moment(this.date).format('Y-MM-DD') || today > now)
          {
            this.hours.push(
              {value:i.id, show:start.format("HH:mm")}
            );
          }*/

          start = start.add(15,'minutes');
          // console.log(start.format("HH:mm"),to);
        }
        while(start.format("Y-MM-DD HH:mm") <= to)
        // let today = start.format("HH:mm");
        // if (today1 != moment(this.date).format('Y-MM-DD') || today > now) {
        //   this.hours.push(
        //     {value:i.id, show:start.format("HH:mm")}
        //   );
        // }

        // this.hours.push({value:i.id, show:"De "+i.hour_from+" a "+i.hour_to, dni: i.require_dni, table: i.table, px: i.px});
      }

      console.log(this.hours);

    })
  }

  setValues()
  {
    console.log(this.hours,this.hour);

    // if (this.hour.dni) {
    //   this.showDni = true;
    // }else{
    //   this.showDni = false;
    // }
    this.min = moment().format('Y-MM-DD');
    this.max = moment(this.date).format("Y-MM-DD")

    console.log(this.min, this.max)
  }

}
