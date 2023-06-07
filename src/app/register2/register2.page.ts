import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoadingController, NavController, AlertController, Platform, MenuController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';

declare var google:any;

@Component({
  selector: 'app-register2',
  templateUrl: './register2.page.html',
  styleUrls: ['./register2.page.scss'],
})
export class Register2Page implements OnInit {
  
  validations_form: FormGroup;
  validation_messages: any;
  errorMessage: string = '';

  show_password_0 = 'password';

  categories;
  autocomplete;
  marker;
  map;
  address = [];
  lt;
  ln;
  latlng;
  @ViewChild('map') mapElement: ElementRef;

  constructor(public auth: AuthService, public formBuilder: FormBuilder, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public nav: NavController, public menu: MenuController,
    public api: ApiService) {
    this.api.getCategories().subscribe((data:any)=>{
      this.categories = data;
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
      'name': [
        { type: 'required', message: 'El campo nombre es requerido' },
      ],
      'establishment': [
        { type: 'required', message: 'El campo establecimiento es requerido' },
      ],
      'phone': [
        { type: 'required', message: 'El teléfono es requerido' },
      ],
      'email': [
        { type: 'required', message: 'El campo email es requerido' },
        { type: 'pattern', message: 'El email debe tener un formato correcto' }
      ],
    };

    this.validations_form = this.formBuilder.group({
      password: new FormControl(null, Validators.compose([
        // Validators.minLength(8),
        // Validators.pattern('\^.*(?=.{8,})((?=.*[0-9]){1})((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$'),
        Validators.required
      ])),
      auto_accept: new FormControl(null),
      email: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      name: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      establishment: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      category_id: new FormControl([], Validators.compose([
        Validators.required
      ])),
      description: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      address: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      lt: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      ln: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      phone: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      role_id: new FormControl(3),
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
    // console.log(value);

    value.category_id = [value.category_id];
    
    // return alert('función en desarrollo');
    this.loadingCtrl.create().then(l=>{
      l.present();
      this.api.register(value).subscribe(data=>{
        this.alertCtrl.create({message:'Usuario registrado satisfactoriamente'}).then(a=>a.present());
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
 
    let latLng = new google.maps.LatLng(40.416775, -3.703790);

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
}
