import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoadingController, NavController, AlertController, Platform, MenuController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { EventsService } from '../services/events.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  validations_form: FormGroup;
  validation_messages: any;
  errorMessage: string = '';

  show_password_0 = 'password';

  remember;

  rememberUser;

  constructor(public auth: AuthService, public formBuilder: FormBuilder, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public nav: NavController, public menu: MenuController,
    public api: ApiService, public events: EventsService) {
    if (localStorage.getItem('rememberUser')) {
      this.rememberUser = JSON.parse(localStorage.getItem('rememberUser'));
    }
  }

  doRemember()
  {
    if (this.remember) {this.remember = false;}
    else {this.remember = true;}

    this.validations_form.patchValue({
      'remember': this.remember
    })
  }

  ngOnInit() {
    this.menu.enable(false);
    this.validation_messages = {
      'password': [
        { type: 'required', message: 'El campo contraseña es requerido' },
        // { type: 'minlength', message: 'La contraseña debe tener al menos 8 caracteres' },
        // { type: 'pattern', message: 'La contraseña debe contener al menos un caracter en mayúscula y un número' }
      ],
      'email': [
        { type: 'required', message: 'El campo email es requerido' },
        { type: 'pattern', message: 'El email debe tener un formato correcto' }
      ],
    };

    this.validations_form = this.formBuilder.group({
      password: new FormControl((this.rememberUser ? this.rememberUser.password : null), Validators.compose([
        // Validators.minLength(8),
        // Validators.pattern('\^.*(?=.{8,})((?=.*[0-9]){1})((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$'),
        Validators.required
      ])),
      remember: new FormControl(null),
      email: new FormControl((this.rememberUser ? this.rememberUser.email : null), Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
    });
  }

  loginUser(value)
  {
    this.loadingCtrl.create().then(l=>{
      l.present();
      this.api.login(value).subscribe((data:any)=>{

        if (this.remember) {
          localStorage.setItem('rememberUser',JSON.stringify(value));
        }else{
          localStorage.removeItem('rememberUser');
        }
        localStorage.setItem('ELuser',JSON.stringify(data));
        localStorage.setItem('role',data.role_id);

        this.events.publish('changeMenu');
        this.events.publish('reloadService1');
        this.events.publish('reloadService2');

        if (data.role_id == 2){
          this.nav.navigateRoot('home-c');
          this.events.publish('getCounts');
        }
        else{
          this.nav.navigateRoot('home-l');
        }
        this.auth.login();
        this.menu.enable(true);
        //

        let onesignal_id = localStorage.getItem('onesignal_id');
        this.api.saveOneSignalId({id:this.auth.user.id,onesignal_id:onesignal_id})
        
        .subscribe(
          data => {console.log('ok');},
          err => {console.log(err);}
        );

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
