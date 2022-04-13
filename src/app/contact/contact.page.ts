import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoadingController, NavController, AlertController, Platform, MenuController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  
  validations_form: FormGroup;
  validation_messages: any;
  errorMessage: string = '';

  user = JSON.parse(localStorage.getItem('ELuser'));

  constructor(public auth: AuthService, public formBuilder: FormBuilder, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public nav: NavController, public menu: MenuController,
    public api: ApiService) {
  }

  ngOnInit() {
    this.validation_messages = {
      'name': [
        { type: 'required', message: 'El campo nombre es requerido' },
      ],
      'email': [
        { type: 'required', message: 'El campo email es requerido' },
        { type: 'pattern', message: 'El email debe tener un formato correcto' }
      ],
      'message': [
        { type: 'required', message: 'El mensaje es requerido' }
      ],
    };

    this.validations_form = this.formBuilder.group({
      name: new FormControl(this.user.name, Validators.compose([
        Validators.required
      ])),
      email: new FormControl(this.user.email, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      message: new FormControl(null, Validators.compose([
        Validators.required])),
    });
  }

  contact(value)
  {
    this.loadingCtrl.create().then(l=>{
      l.present();
      this.api.contact(value).subscribe((data:any)=>{

        l.dismiss();

        this.alertCtrl.create({message:"Muchas gracias por contactar con nosotros, en breve te daremos una respuesta!"}).then(a=>{a.present()});

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
