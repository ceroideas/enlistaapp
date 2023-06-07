import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoadingController, NavController, AlertController, Platform, MenuController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  
  validations_form: FormGroup;
  validation_messages: any;
  errorMessage: string = '';

  show_password_0 = 'password';

  constructor(public auth: AuthService, public formBuilder: FormBuilder, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public nav: NavController, public menu: MenuController,
    public api: ApiService) { }

  ngOnInit() {
    this.menu.enable(false);
    this.validation_messages = {
      'password': [
        { type: 'required', message: 'El campo contraseña es requerido' },
        // { type: 'minlength', message: 'La contraseña debe tener al menos 8 caracteres' },
        // { type: 'pattern', message: 'La contraseña debe contener al menos un caracter en mayúscula y un número' }
      ],
      'name': [
        { type: 'required', message: 'El campo nombre es requerido' },
      ],
      'email': [
        { type: 'required', message: 'El campo email es requerido' },
        { type: 'pattern', message: 'El email debe tener un formato correcto' }
      ],
      'phone': [
        { type: 'required', message: 'El campo nombre es requerido' },
      ],
    };

    this.validations_form = this.formBuilder.group({
      password: new FormControl(null, Validators.compose([
        // Validators.minLength(8),
        // Validators.pattern('\^.*(?=.{8,})((?=.*[0-9]){1})((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$'),
        Validators.required
      ])),
      email: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      name: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      phone: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      policy: new FormControl(null, Validators.compose([
        Validators.required
      ])),
    });
  }

  nullPolicy()
  {
    setTimeout(()=>{
      if (this.validations_form.value.policy == false) {
        this.validations_form.patchValue({policy: null});
      }
    },10);
  }

  registerUser(value)
  {
    this.loadingCtrl.create().then(l=>{
      l.present();
      this.api.register(value).subscribe(data=>{
        this.alertCtrl.create({message:'Usuario registrado, confirme su correo antes de iniciar sesion'}).then(a=>a.present());
        this.nav.navigateRoot('login');
        l.dismiss();

      },err=>{
        l.dismiss();
        console.log(err);
        var arr = Object.keys(err.error.errors).map(function(k) { return err.error.errors[k] });
        this.errorMessage = arr[0][0];
        this.alertCtrl.create({message:this.errorMessage}).then(al=>{al.present()});
      })
    })
  }

  changeView(i)
  {
    if (this['show_password_'+i] == 'password') {
      this['show_password_'+i] = 'text';
    }else{
      this['show_password_'+i] = 'password';
    }
  }

}
