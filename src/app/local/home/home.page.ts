import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoadingController, NavController, AlertController, Platform, MenuController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

import { ConfirmedValidator } from '../../client/profile/confirmed';

declare var google:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  providers: [FileTransfer, Camera]
})
export class HomePage implements OnInit {
  
  validations_form: FormGroup;
  validation_messages: any;
  errorMessage: string = '';

  show_password_0 = 'password';
  show_password_1 = 'password';

  categories;
  autocomplete;
  marker;
  map;
  address = [];
  lt;
  ln;
  latlng;
  @ViewChild('map') mapElement: ElementRef;

  user = JSON.parse(localStorage.getItem('ELuser'));

  constructor(public auth: AuthService, public formBuilder: FormBuilder, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public nav: NavController, public menu: MenuController,
    public api: ApiService, private camera: Camera, private transfer: FileTransfer, public toast: ToastController) {
    this.api.getCategories().subscribe((data:any)=>{
      this.categories = data;
    });

    this.api.getUser(this.user.id).subscribe(data=>{
      localStorage.setItem('ELuser',JSON.stringify(data));
      this.user = data;
    });
  }

  ngOnInit() {
    this.menu.enable(true);
    this.validation_messages = {
      'password': [
        { type: 'required', message: 'El campo contraseña es requerido' },
        // { type: 'minlength', message: 'La contraseña debe tener al menos 8 caracteres' },
        // { type: 'pattern', message: 'La contraseña debe contener al menos un caracter en mayúscula y un número' }
      ],
      'name': [
        { type: 'required', message: 'El campo nombre es requerido' },
      ],
      'establishment': [
        { type: 'required', message: 'El campo establecimiento es requerido' },
      ],
      'phone': [
        { type: 'required', message: 'El teléfono es requerido' },
        { type: 'pattern', message: 'El teléfono debe tener un formato correcto' },
      ],
      'email': [
        { type: 'required', message: 'El campo email es requerido' },
        { type: 'pattern', message: 'El email debe tener un formato correcto' }
      ],
    };

    let ids = [];

    for(let e of this.user.establishment.categories) {
      ids.push(e.category_id);
    }

    this.validations_form = this.formBuilder.group({
      id: new FormControl(this.user.id),
      establishment_id: new FormControl(this.user.establishment.id),
      auto_accept: new FormControl(this.user.establishment.auto_accept.toString()),
      password: new FormControl(null, Validators.compose([
        // Validators.minLength(8),
        // Validators.pattern('\^.*(?=.{8,})((?=.*[0-9]){1})((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$'),
        // Validators.required
      ])),
      repeat_password: new FormControl(null),
      avatar: new FormControl(this.user.avatar),
      image: new FormControl(this.user.establishment.image),
      image_2: new FormControl(this.user.establishment.image_2),
      image_3: new FormControl(this.user.establishment.image_3),
      image_4: new FormControl(this.user.establishment.image_4),
      image_5: new FormControl(this.user.establishment.image_5),
      email: new FormControl(this.user.email, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      name: new FormControl(this.user.name, Validators.compose([
        Validators.required
      ])),
      establishment: new FormControl(this.user.establishment.name, Validators.compose([
        Validators.required
      ])),
      category_id: new FormControl(ids, Validators.compose([
        Validators.required
      ])),
      description: new FormControl(this.user.establishment.description, Validators.compose([
        Validators.required
      ])),
      address: new FormControl(this.user.establishment.address, Validators.compose([
        Validators.required
      ])),
      lt: new FormControl(this.user.establishment.lt, Validators.compose([
        Validators.required
      ])),
      ln: new FormControl(this.user.establishment.ln, Validators.compose([
        Validators.required
      ])),
      phone: new FormControl(this.user.establishment.phone, Validators.compose([
        Validators.required,
        Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$')
      ])),
      role_id: new FormControl(3)
    },{
      validator: ConfirmedValidator('password', 'repeat_password')
    });

    

    /*console.log(ids);

    this.validations_form.patchValue({
      category_id: ids
    })*/
  }

  registerUser(value)
  {
    if(value.category_id.length > this.user.establishment.max_categories){
      return this.alertCtrl.create({message:"Solo puedes seleccionar "+this.user.establishment.max_categories+" categorias",buttons: [{text:"Ok"}]}).then(a=>a.present());
    }
    // console.log(value);
    
    // return alert('función en desarrollo');
    this.loadingCtrl.create().then(l=>{
      l.present();
      this.api.register(value).subscribe(data=>{
        this.alertCtrl.create({message:'Datos guardados satisfactoriamente'}).then(a=>a.present());

        localStorage.setItem('ELuser',JSON.stringify(data));

        this.validations_form.patchValue({
          password: "",
          repeat_password: ""
        })
        // this.nav.navigateRoot('login');
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

  /**/

  ionViewDidEnter()
  {
    this.initAutocomplete();
    this.loadMap();
  }

  initAutocomplete()
  {
    var geocoder = new google.maps.Geocoder;
    
    var input = document.querySelector('#address input');
    var countryRestrict = {'country': ['es','it']};
    var options = {
      types: ['geocode']
    };

    this.autocomplete = new google.maps.places.Autocomplete(input, options);

    this.autocomplete.setComponentRestrictions(
          {'country': ['es', 'it']});

    let fillInAddress = ()=> {
      // Get the place details from the autocomplete object.
      var arr = this.autocomplete.getPlace();
      console.log(arr);

      this.latlng = {lat:arr.geometry.location.lat(),lng:arr.geometry.location.lng()};

      this.lt = arr.geometry.location.lat()
      this.ln = arr.geometry.location.lng()

      geocoder.geocode({'location': this.latlng}, (results, status) => {
          if (status === 'OK') {
            if (results[0]) {
              
              // this.address = results[0].formatted_address;
              
              this.getAddress(results);
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });

        this.marker.setMap(null);
        let latLng = new google.maps.LatLng(this.lt, this.ln);

        this.marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: latLng
        });

        this.map.setCenter(latLng);
        this.map.setZoom(12);

    }

    this.autocomplete.addListener('place_changed', fillInAddress);
  }

  getAddress(arr)
  {
    console.log(arr);
    if (arr.length) {

      for (var i = 0; i < arr[0].address_components.length; i++) {

          let comp = arr[0].address_components[i];
          
          var addressType = comp.types[0];

          if (addressType) {
            if (addressType == 'route') {
              this.address.push(comp.long_name);

            }else if(addressType == 'locality'){
              this.address.push(comp.long_name);

            }else if(addressType == 'country'){
              this.address.push(comp.long_name);
            }
          }
      }

      this.validations_form.patchValue({
        address: this.address.join(', '),
        lt: this.lt,
        ln: this.ln
      })
    }

    // this.alert.create({message:"Introduzca el número de la calle para encontrar todos los restaurantes que pueden entregar en tu dirección", inputs: [
    // {
    //   name:"street_number",
    //   placeholder: "Número de la calle",
    //   type: "text"
    // }
    // ], buttons: [{
    //   text:"Ok",
    //   handler: (v)=>{
    //     if (!v.street_number) {
    //       return false;
    //     }

    //     this.address.push(v.street_number);

    //     let ad = this.address;

    //     // this.myAddress = ad[0]+', '+ad[3]+', '+ad[1]+', '+ad[2];

    //     var geocoder = new google.maps.Geocoder;

    //     const address = this.myAddress;

    //     geocoder.geocode({ address: address }, (results, status) => {
    //       if (status === "OK") {
    //         localStorage.setItem('lat',results[0].geometry.location.lat());
    //         localStorage.setItem('lon',results[0].geometry.location.lng());
    //         localStorage.setItem('address',this.myAddress);

    //         this.marker.setMap(null);
    //         let latLng = new google.maps.LatLng(localStorage.getItem('lat'), localStorage.getItem('lon'));

    //         this.marker = new google.maps.Marker({
    //           map: this.map,
    //           animation: google.maps.Animation.DROP,
    //           position: latLng
    //         });

    //         this.map.setCenter(latLng);
    //         this.map.setZoom(12);
    //       } else {
    //         alert("Geocode was not successful for the following reason: " + status);
    //       }
    //     });

    //     console.log(this.address);
    //   }
    // }],backdropDismiss: false}).then(a=>{
    //   a.present();
    // });

  }

  loadMap(){

    // this.loading.dismiss();

    // let load = this.loading.create();
    // load.then((l)=>{l.present();});
 
    let latLng = new google.maps.LatLng(this.user.establishment.lt, this.user.establishment.ln);

    let mapOptions = {
      center: latLng,
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      styles: []
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
   
    let content = localStorage.getItem('address');

    // this.loading.dismiss();
  }

  loadImage(type)
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

     this.uploadImage(imageData,type);

    }, (err) => {
     // Handle error
    });
  }

  uploadImage(uri,type)
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

      if (type == 'avatar') {
        this.validations_form.patchValue({
          avatar: JSON.parse(data['response'])[0]
        });
      }else if (type == 'image') {
        this.validations_form.patchValue({
          image: JSON.parse(data['response'])[0]
        });
      }else if (type == 'image_2') {
        this.validations_form.patchValue({
          image_2: JSON.parse(data['response'])[0]
        });
      }else if (type == 'image_3') {
        this.validations_form.patchValue({
          image_3: JSON.parse(data['response'])[0]
        });
      }else if (type == 'image_4') {
        this.validations_form.patchValue({
          image_4: JSON.parse(data['response'])[0]
        });
      }else if (type == 'image_5') {
        this.validations_form.patchValue({
          image_5: JSON.parse(data['response'])[0]
        });
      }

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
