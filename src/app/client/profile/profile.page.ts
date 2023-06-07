import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoadingController, NavController, AlertController, Platform, MenuController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

import { ConfirmedValidator } from './confirmed';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  providers: [FileTransfer, Camera]
})
export class ProfilePage implements OnInit {
  
  validations_form: FormGroup;
  validation_messages: any;
  errorMessage: string = '';

  show_password_0 = 'password';
  show_password_1 = 'password';
  user = JSON.parse(localStorage.getItem('ELuser'));

  constructor(public auth: AuthService, public formBuilder: FormBuilder, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public nav: NavController, public menu: MenuController,
    public api: ApiService, private camera: Camera, private transfer: FileTransfer, public toast: ToastController) { }

  ngOnInit() {
    this.validation_messages = {
      'password': [
        { type: 'required', message: 'El campo contraseña es requerido' },
      ],
      'repeat_password': [
        { type: 'required', message: 'Las contraseñas no coinciden' },
      ],
      'name': [
        { type: 'required', message: 'El campo nombre es requerido' },
      ],
      'email': [
        { type: 'required', message: 'El campo email es requerido' },
        { type: 'pattern', message: 'El email debe tener un formato correcto' }
      ],
    };

    this.validations_form = this.formBuilder.group({
      id: new FormControl(this.user.id),
      password: new FormControl(null),
      repeat_password: new FormControl(null),
      email: new FormControl(this.user.email, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      avatar: new FormControl(this.user.avatar),
      name: new FormControl(this.user.name, Validators.compose([
        Validators.required
      ])),
    },{
      validator: ConfirmedValidator('password', 'repeat_password')
    });
  }

  registerUser(value)
  {
    this.loadingCtrl.create().then(l=>{
      l.present();
      this.api.register(value).subscribe(data=>{
        this.alertCtrl.create({message:'Datos guardados satisfactoriamente'}).then(a=>a.present());

        localStorage.setItem('ELuser',JSON.stringify(data));
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

  loadImage()
  {
    console.log('seleccionar imagen')
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      // allowEdit: true
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):

     this.uploadImage(imageData);

    }, (err) => {
     // Handle error
    });
  }

  uploadImage(uri)
  {
    this.toast.create({message: "Subiendo imagen, espere un momento", duration: 4000}).then(t=>{
      t.present();
    });

    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
        fileKey: 'image',
        fileName: 'name.jpg',
        chunkedMode: false,
        mimeType: "image/form-data",
        httpMethod: 'POST',
        headers: {}
    }

    fileTransfer.upload(uri, this.api.url+'uploadImage', options)
     .then((data) => {

      console.log(data);

      this.validations_form.patchValue({
        avatar: JSON.parse(data['response'])[0]
      });

     }, (err) => {

       console.log(err);
       // error
     })
  }

  prompt1()
  {
    this.alertCtrl.create({message:"¿Deseas eliminar tu cuenta?", buttons: [
    {
      text:"Si",
      handler:()=>{
        this.prompt2();
      }
    },{
      text:"No"
    }
    ]}).then(a=>a.present());
  }

  prompt2()
  {
    this.alertCtrl.create({message:'Al presionar en "continuar" se eliminará tu cuenta permanentemente y no habrá manera de recuperar ningún tipo de información.', buttons: [
    {
      text:"Continuar",
      handler:()=>{
        this.loadingCtrl.create().then(l=>{

          l.present();

          this.api.deleteAccount(this.user.id).subscribe(data=>{

            this.auth.logOut();
            this.nav.navigateRoot('login');

            this.alertCtrl.create({message:"Tu cuenta ha sido eliminada permanentemente. Si quieres crear otra cuenta puedes presionar en \"Regístrate\".", buttons: ["Ok"]}).then(a=>a.present());

            l.dismiss();
          })

        })
      }
    },{
      text:"Cancelar"
    }
    ]}).then(a=>a.present()); 
  }

}
