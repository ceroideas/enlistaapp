import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoadingController, NavController, AlertController, Platform, MenuController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { EventsService } from '../services/events.service';

import { ConfirmedValidator } from './confirmed.validator';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.page.html',
  styleUrls: ['./recover.page.scss'],
})
export class RecoverPage implements OnInit {
  
  validations_form: FormGroup;
  validation_messages: any;

  validations_form1: FormGroup;
  validation_messages1: any;

  validations_form2: FormGroup;
  validation_messages2: any;

  errorMessage: string = '';

  show_password_0 = 'password';
  show_password_1 = 'password';

  step = 1;

  remember;

  rememberUser;

  constructor(public auth: AuthService, public formBuilder: FormBuilder, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public nav: NavController, public menu: MenuController,
    public api: ApiService, public events: EventsService, public toast: ToastController) {
    function makeid() {
      var text = "";
      var possible = "0123456789";

      for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }

    localStorage.setItem('ELcode', makeid());
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
      'email': [
        { type: 'required', message: 'El campo email es requerido' },
        { type: 'pattern', message: 'El email debe tener un formato correcto' }
      ],
    };

    this.validations_form = this.formBuilder.group({
      code: new FormControl(localStorage.getItem('ELcode')),
      email: new FormControl((this.rememberUser ? this.rememberUser.email : null), Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
    });

    this.validation_messages1 = {
      'code': [
        { type: 'required', message: 'El campo código es requerido' }
      ],
    };

    this.validations_form1 = this.formBuilder.group({
      code: new FormControl(null, Validators.compose([
        Validators.required
      ])),
    });

    this.validation_messages2 = {
       'password': [
        { type: 'required', message: 'El campo contraseña es requerido' }
      ],
      'repeat_password': [
        { type: 'required', message: 'El campo repetir contraseña es requerido' },
        { type: 'confirmedValidator', message: "Las contraseás deben ser iguales" },
      ],
    };

    this.validations_form2 = this.formBuilder.group({
      id: new FormControl(null),
      password: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      repeat_password: new FormControl(null, Validators.compose([
        Validators.required
      ])),
    },{
      validator: ConfirmedValidator('password', 'repeat_password')
    });

  }

  // loginUser(value)
  // {
  //   this.loadingCtrl.create().then(l=>{
  //     l.present();
  //     this.api.login(value).subscribe((data:any)=>{

  //       if (this.remember) {
  //         localStorage.setItem('rememberUser',JSON.stringify(value));
  //       }else{
  //         localStorage.removeItem('rememberUser');
  //       }
  //       localStorage.setItem('ELuser',JSON.stringify(data));
  //       localStorage.setItem('role',data.role_id);

  //       this.events.publish('changeMenu');

  //       if (data.role_id == 2){
  //         this.nav.navigateRoot('home-c');
  //       }
  //       else{
  //         this.nav.navigateRoot('home-l');
  //       }
  //       this.auth.login();
  //       this.menu.enable(true);
  //       //

  //       let onesignal_id = localStorage.getItem('onesignal_id');
  //       this.api.saveOneSignalId({id:this.auth.user.id,onesignal_id:onesignal_id})
        
  //       .subscribe(
  //         data => {console.log('ok');},
  //         err => {console.log(err);}
  //       );

  //       l.dismiss();

  //     },err=>{
  //       l.dismiss();
  //       console.log(err);
  //       var arr = Object.keys(err.error.errors).map(function(k) { return err.error.errors[k] });
  //       this.errorMessage = arr[0][0];
  //       this.alertCtrl.create({message:this.errorMessage}).then(al=>{al.present()});
  //     })
  //   })
  // }

  sendCode(value)
  {
    console.log(value);
    
    this.loadingCtrl.create().then((a)=>{
      a.present();

      this.api.sendCode(value).subscribe((data:any)=>{

        this.validations_form2.patchValue({
          id: data.id
        })
          this.step = 2;

          this.toast.create({message:'Código enviado al correo',duration: 3000}).then(t=>t.present());
        a.dismiss();
      },err=>{
        console.log(err);
        // var arr = Object.keys(err.error.errors).map(function(k) { return err.error.errors[k] });
        // this.errorMessage = arr[0][0];
        // this.alertCtrl.create({message:this.errorMessage}).then(al=>{al.present()});
        this.alertCtrl.create({message:'Usuario no encontrado'}).then(al=>{al.present()});
        a.dismiss();
      })
    })
  }

  checkCode(value){
    if (value.code == localStorage.getItem('ELcode')) {
      this.step = 3;
    }else{
      this.alertCtrl.create({message:"El código ingresado no es igual al código enviado, por favor, verifique!"}).then(a=>a.present());
    }
  }

  changePassword(value)
  {
    this.loadingCtrl.create().then((a)=>{
      a.present();

      this.api.changePassword(value).subscribe(data=>{

          this.toast.create({message:'Contraseña modificada satisfactoriamente',duration: 3000}).then(t=>t.present());

          this.nav.back();
        a.dismiss();
      },err=>{
        console.log(err);
        var arr = Object.keys(err.error.errors).map(function(k) { return err.error.errors[k] });
        this.errorMessage = arr[0][0];
        this.alertCtrl.create({message:this.errorMessage}).then(al=>{al.present()});
        a.dismiss();
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
