import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoadingController, NavController, AlertController, Platform, MenuController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';

declare var moment:any;

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  
  validations_form: FormGroup;
  validation_messages: any;
  errorMessage: string = '';

  user = JSON.parse(localStorage.getItem('ELuser'));

  capability = this.user.establishment.max_notifications;

  showcapability = false;

  minY = moment().format('Y-MM-DDTHH:mm');
  maxY = moment().add(3,'years').format('Y');

  constructor(public auth: AuthService, public formBuilder: FormBuilder, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public nav: NavController, public menu: MenuController,
    public api: ApiService) {
  }

  ngOnInit() {

    this.api.checkCapabilities(this.user.establishment.id).subscribe((data:any)=>{
      console.log(data);
      this.capability = this.user.establishment.max_notifications - data;
      this.showcapability = true;

      if (this.capability < 0) {
        this.capability = 0;
      }
    });


    this.validation_messages = {
      'title': [
        { type: 'required', message: 'El título es requerido' },
      ],
      'message': [
        { type: 'required', message: 'El mensaje es requerido' }
      ],
    };

    this.validations_form = this.formBuilder.group({
      id: new FormControl(this.user.establishment.id),
      title: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      message: new FormControl(null, Validators.compose([
        Validators.required])),
      notification: new FormControl(null)
    });
  }

  contact(value)
  {
    if (this.capability <= 0) {
      return this.alertCtrl.create({message:"Has agotado tus notificaciones por éste mes...", buttons: ['OK']}).then(a=>{a.present()});
    }
    this.loadingCtrl.create().then(l=>{
      l.present();
      this.api.pushOffers(value).subscribe((data:any)=>{

        l.dismiss();

        this.alertCtrl.create({message:"Notificación de oferta enviada!", buttons: ['OK']}).then(a=>{a.present()});

        this.api.checkCapabilities(this.user.establishment.id).subscribe((data:any)=>{
          console.log(data);
          this.capability = this.user.establishment.max_notifications - data;

          if (this.capability < 0) {
            this.capability = 0;
          }

          this.validations_form.patchValue({title: null, message: null});
        });

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
