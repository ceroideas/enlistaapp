import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoadingController, NavController, AlertController, Platform, MenuController, ToastController } from '@ionic/angular';
import { ApiService } from '../../../services/api.service';
import { EventsService } from '../../../services/events.service';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  providers: [Camera,FileTransfer]
})
export class CreatePage implements OnInit {

  validations_form: FormGroup;
  validation_messages: any;
  errorMessage: string = '';

  user = JSON.parse(localStorage.getItem('ELuser'));

  constructor(public formBuilder: FormBuilder, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public nav: NavController, public menu: MenuController,
    public api: ApiService, public events: EventsService, private camera: Camera, private transfer: FileTransfer, public toast: ToastController, public route: ActivatedRoute) { }

  ngOnInit() {

    if (this.route.snapshot.params.id) {
      this.api.getSpace(this.route.snapshot.params.id).subscribe((data:any)=>{
        console.log(data);

        this.validations_form.patchValue({
          name: data.name,
          description: data.description,
          price: data.price,
          ignore_capacity: data.ignore_capacity,
          id: data.id,
          establishment_id: data.establishment_id,
          image: data.image,
          capacity: data.capacity
        })
      })
    }

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
      'capacity': [
        { type: 'required', message: 'Escriba la capacidad del espacio' },
      ],
    };

    this.validations_form = this.formBuilder.group({
      name: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      description: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      image: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      price: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      capacity: new FormControl(null),
      ignore_capacity: new FormControl(null),
      id: new FormControl(null),
      establishment_id: new FormControl(this.user.establishment.id),
    });
  }

  registerSpace(value)
  {
    this.loadingCtrl.create().then(l=>{
      l.present();
      this.api.addSpace(value).subscribe((data:any)=>{

        this.api.back();

        this.alertCtrl.create({message:"La información ha sido guardada"}).then(a=>a.present());
        this.events.publish('getSpaces');

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

      this.validations_form.patchValue({
        image: JSON.parse(data['response'])[0]
      });

     }, (err) => {

       console.log(err);
       // error
     })
  }

}
