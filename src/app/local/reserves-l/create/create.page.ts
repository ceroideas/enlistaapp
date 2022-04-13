import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ModalOkPage } from '../../../client/home/schedule/modal-ok/modal-ok.page';
import { ModalValorationPage } from '../../../client/home/schedule/modal-valoration/modal-valoration.page';
import { ApiService } from '../../../services/api.service';
import { EventsService } from '../../../services/events.service';

declare var moment:any;
@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  validations_form: FormGroup;
  validation_messages: any;
  errorMessage: string = '';

  schedules:any = [];
  step;
  establishment:any;
  details:any;
  space:any;
  loaded = false;

  date;
  hour:any;
  notification;
  hours: any = [];

  allHours:any = [];

  min;
  max;

  minY = moment().format('Y-MM-DD');
  maxY = moment().add(3,'years').format('Y');

  dni;

  user = JSON.parse(localStorage.getItem('ELuser'));

  showDni = false;

  px;
  search;
  user_id;

  preloaded = false;

  createUser;
  new_user:any;

  show_password_0 = 'password';

  constructor(public api: ApiService, public formBuilder: FormBuilder, public modal: ModalController, public events: EventsService, public route: ActivatedRoute, public toast: ToastController, public alert: AlertController, public loading: LoadingController) { }

  ngOnInit() {

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
      password: new FormControl("1", Validators.compose([
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
      new_user: new FormControl(null),
      type: new FormControl('admin'),
    });

    if (localStorage.getItem('preloadSpace')) {
      
      this.preloaded = true;
      this.space = localStorage.getItem('preloadSpace');
      this.getSpace();
    }

    this.loading.create().then(l=>{
      
      l.present();

      this.api.getSpaces(this.user.establishment.id).subscribe(data=>{

        // console.log(data);
        this.establishment = data;
        this.loaded = true;

        l.dismiss();
      })
    })
  }

  changeNewUser(a)
  {
    console.log(a.detail.checked);
    this.validations_form.patchValue({
      new_user: a.detail.checked
    })
  }

  getSpace()
  {
    this.loading.create().then(l=>{
      
      l.present();

      this.api.getSpace(this.space).subscribe(data=>{

        this.details = data;
        this.loaded = true;
        this.step = 1;

        l.dismiss();
      })
    })
  }

  reserve()
  {
    var nifRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
    var nieRegex = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;

    if (this.showDni) {
      if (!this.dni.match(nifRegex) && !this.dni.match(nieRegex)) {
        return this.alert.create({message:"Ingrese un DNI correcto", buttons:[{text:"Ok"}]}).then(a=>a.present());
      }
    }

    this.alert.create({message:"¿Desea crear la reserva en la fecha y hora seleccionados?", buttons:[
    {
      text:"Confirmar",
      handler:()=>{

        this.loading.create().then(l=>{
          l.present();

          this.api.saveReservation2({

            id:this.hour.value,
            hour:this.hour.show,
            date: moment(this.date).format('Y-MM-DD'),
            px:this.px,
            reservation_id:this.details.id,
            notification:this.notification,
            user_id:this.user_id,
            new_user:this.new_user,
            // dni:this.dni

          }).subscribe(data=>{

            l.dismiss();

            localStorage.setItem('fromType','admin');

            this.reserveModal({e:data});

            this.date = null;
            this.hours = [];
            this.allHours = [];
            this.hour = null;
            this.notification = null;
            this.step = null;
            this.showDni = false;

          }, err=>{
            
            l.dismiss();

            this.alert.create({message:err.error}).then(a=>a.present());
          })
        })

      }
    },{
      text:"Cancelar"
    }]}).then(a=>a.present());
  }

  async reserveModal(data) {
    const modal = await this.modal.create({
      componentProps: data,
      cssClass:'finalPayment',
      component: ModalOkPage
    });
    return await modal.present();
  }

  getHours()
  {
    this.showDni = false;
    this.hours = [];
    this.hour = null;

    // console.log(this.date);

    let day = new Date(this.date);
    let d = day.getDay();

    this.api.getHours({id:this.details.id, day: d, date: moment(this.date).format('Y-MM-DD')}).subscribe((data:any)=>{

      this.allHours = data;

      if (data.message) {
        return this.toast.create({message:data.message, duration:3000}).then(t=>t.present());
      }
      if (!data.length) {
        return this.toast.create({message:"No se han obtenido resultados para el día seleccionado", duration:3000}).then(t=>t.present());
      }
      for (let i of data)
      {

        let now = moment().format("HH:mm");
        let today1 = moment().format("Y-MM-DD");
        let to = moment("2021-01-01 "+i.hour_to).format("Y-MM-DD HH:mm");

        let start = moment("2021-01-01 "+i.hour_from).startOf('hour');

        do {
          
          let today = start.format("HH:mm");
          console.log(today);

          if (today1 == moment(this.date).format('Y-MM-DD')) {

            if (today > now) {
              this.hours.push(
                {value:i.id, show:start.format("HH:mm")}
              );
            }

          } else {

            this.hours.push(
              {value:i.id, show:start.format("HH:mm")}
            );

          }

          start = start.add(15,'minutes');
        }
        while(start.format("Y-MM-DD HH:mm") <= to)

      }

      console.log(this.hours);

    })
  }

  setValues()
  {
    console.log(this.hours,this.hour);

    this.min = moment().format('Y-MM-DD');
    this.max = moment(this.date).format("Y-MM-DD")

    console.log(this.min, this.max)
  }
  users:any;
  findUser()
  {
    this.users = [];
    if (this.search != "" && this.search) {
      this.api.findUsers({search:this.search}).subscribe(data=>{
        console.log(data)
        this.users = data;
      })
    }
  }

  selectUser(id,name)
  {
    this.user_id = id;
    this.new_user = null;
    this.users = [];
    this.search = name;
    this.step = 2;
  }

  registerUser(value)
  {
    if (value.new_user) {
      this.loading.create().then(l=>{
        l.present();
        this.api.register(value).subscribe((data:any)=>{
          this.alert.create({message:'Usuario registrado correctamente'}).then(a=>a.present());
          // this.api.nav.navigateRoot('login');
          this.createUser = null;

          this.user_id = data.id;
          this.new_user = null;
          this.users = [];
          this.search = data.name+' ('+data.phone+')';
          this.step = 2;
          l.dismiss();

        },err=>{
          l.dismiss();
          console.log(err);
          var arr = Object.keys(err.error.errors).map(function(k) { return err.error.errors[k] });
          this.errorMessage = arr[0][0];
          this.alert.create({message:this.errorMessage}).then(al=>{al.present()});
        })
      })
    }else{

      this.createUser = null;

      this.user_id = null;
      this.new_user = value;
      this.users = [];
      this.search = value.name+' ('+value.phone+')';
      this.step = 2;

      console.log(this.new_user);

    }
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
