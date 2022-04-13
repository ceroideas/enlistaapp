import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service'

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

  validations_form: FormGroup;
  validation_messages: any;

  constructor(public api: ApiService, public formBuilder: FormBuilder, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public route: ActivatedRoute) { }

  ngOnInit() {
    this.validation_messages = {
      'title': [
        { type: 'required', message: 'El campo título es requerido' },
      ],
      'message': [
        { type: 'required', message: 'El campo mensaje es requerido' },
      ],
    };

    this.validations_form = this.formBuilder.group({
      schedule_id: new FormControl(this.route.snapshot.params.id),
      title: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      message: new FormControl(null, Validators.compose([
        Validators.required,
      ])),
      notification: new FormControl(null)
    });
  }

  sendNotification(values)
  {
    console.log(values);
    this.loadingCtrl.create().then(l=>{

      l.present();
      this.api.sendNotification(values).subscribe(data=>{
        
        l.dismiss();
        this.alertCtrl.create({message:"La notificación de oferta ha sido enviada"}).then(a=>a.present());

      },e=>{
        l.dismiss();
        this.alertCtrl.create({message:"Debe seleccionar una fecha en el futuro"}).then(a=>a.present());
      });

    })
  }

}
