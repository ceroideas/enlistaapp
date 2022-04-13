import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoadingController, NavController, AlertController, Platform, MenuController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { EventsService } from '../../../services/events.service';

declare var moment:any;

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  validations_form: FormGroup;
  validation_messages: any;
  errorMessage: string = '';

  user = JSON.parse(localStorage.getItem('ELuser'));

  constructor(public formBuilder: FormBuilder, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public nav: NavController, public menu: MenuController,
    public api: ApiService, public events: EventsService, public route: ActivatedRoute) {
    console.log(this.route.snapshot.params.id);

    this.api.getSpacePrice(this.route.snapshot.params.id).subscribe(data=>{
      console.log(data);
      this.validations_form.patchValue({
        price:data[0]
      })
    })
  }

  ngOnInit() {
    this.validation_messages = {
      'name': [
        { type: 'required', message: 'El campo nombre es requerido' },
      ],
      'description': [
        { type: 'required', message: 'El campo descripción es requerido' },
      ],
      'image': [
        { type: 'required', message: 'La imagen es requerida' },
      ],
      'price': [
        { type: 'required', message: 'El precio base es requerido' },
      ],
      // 'px': [
      //   { type: 'required', message: 'El campo clientes es requerido' },
      // ],
      // 'table': [
      //   { type: 'required', message: 'El campo mesa es requerido' },
      // ],
    };

    this.validations_form = this.formBuilder.group({
      date: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      hour_from: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      hour_to: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      price: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      // px: new FormControl(null, Validators.compose([
      //   Validators.required
      // ])),
      // table: new FormControl(null, Validators.compose([
      //   Validators.required
      // ])),
      reservation_id: new FormControl(this.route.snapshot.params.id),
      require_dni: new FormControl(null),
    });
  }

  registerSchedule(value)
  {
    // value.date = moment(value.date).format('Y-MM-DD 00:00:00');
    value.hour_from = moment(value.hour_from).format('HH:mm');
    value.hour_to = moment(value.hour_to).format('HH:mm');

    console.log(value);

    this.loadingCtrl.create().then(l=>{
      l.present();
      this.api.addReservation(value).subscribe((data:any)=>{

        this.api.back();

        this.alertCtrl.create({message:"El horario ha sido guardado"}).then(a=>a.present());

        l.dismiss();

        this.events.publish('getAllSchedules');

      },err=>{
        l.dismiss();
        console.log(err);
        var arr = Object.keys(err.error.errors).map(function(k) { return err.error.errors[k] });
        this.errorMessage = arr[0][0];
        this.alertCtrl.create({message:this.errorMessage}).then(al=>{al.present()});
      })
    })
  }

}
