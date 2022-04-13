import { Injectable } from '@angular/core';
import { NavController, ModalController, AlertController, MenuController, LoadingController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

import { EventsService } from './events.service';

import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { GooglePlus } from '@ionic-native/google-plus/ngx';

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

import { SignInWithApple, AppleSignInResponse, AppleSignInErrorResponse, ASAuthorizationAppleIDRequest } from '@ionic-native/sign-in-with-apple/ngx';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url;
  baseUrl;

  /**/

  picture;
  name;
  email;

  /**/

  constructor(private http: HttpClient, public nav: NavController, public modal: ModalController, public alert: AlertController, public auth: AuthService, public menu: MenuController, public platform: Platform,
    private afAuth: AngularFireAuth, private googlePlus: GooglePlus, public fb: Facebook, public loading: LoadingController, public events: EventsService, private signInWithApple: SignInWithApple) {
    // this.url = 'http://127.0.0.1:8000/api/';
    this.url = environment.url+'api/';
    this.baseUrl = environment.url;
  }
  //
  back() {
    this.nav.pop();
  }

  dismiss() {
    this.modal.dismiss();
  }

  showmenu()
  {
    this.menu.open();
  }

  loginMessage()
  {
    this.alert.create({message:"Para realizar esta acción debes iniciar sesión",buttons:[{
      text:"Iniciar sesión",
      handler: ()=>{
        this.auth.logOut();
        this.nav.navigateRoot('login');
      }
    },{
      text:"Cancelar"
    }]}).then(a=>a.present());
  }

  logout() {
    this.alert.create({message:"Desea cerrar sesión?", buttons: [
      {text:"Si", handler: ()=>{
        
        if (localStorage.getItem('google_login')) {
          this.googlePlus.logout().then(()=>{
            console.log('cesion google cerrada');
            localStorage.removeItem('google_login')
          });
        }

        if (localStorage.getItem('facebook_login')) {
          this.fb.logout().then(()=>{
            console.log('cesion facebook cerrada');
            localStorage.removeItem('facebook_login')
          })
        }

        this.auth.logOut();
        this.nav.navigateRoot('login');



      }},{
        text:"No"
      }
    ]}).then(a=>a.present());
  }
  //

  sendNotification(data)
  {
    return this.http.post(this.url+'sendNotification',data);
  }
  llegada(data)
  {
    return this.http.post(this.url+'llegada',data);
  }
  llegadaManual(data)
  {
    return this.http.post(this.url+'llegadaManual',data);
  }
  llegadaInvitado(data)
  {
    return this.http.post(this.url+'llegadaInvitado',data);
  }
  anular(id)
  {
    return this.http.get(this.url+'anular/'+id);
  }
  anularAdmin(id)
  {
    return this.http.get(this.url+'anularAdmin/'+id);
  }
  aceptarAdmin(id)
  {
    return this.http.get(this.url+'aceptarAdmin/'+id);
  }
  canComment(data)
  {
    return this.http.post(this.url+'canComment',data);
  }
  login(data)
  {
    return this.http.post(this.url+'login',data);
  }
  contact(data)
  {
    return this.http.post(this.url+'contact',data);
  }
  register(data)
  {
    return this.http.post(this.url+'register',data);
  }
  sendCode(data)
  {
    return this.http.post(this.url+'sendCode',data);
  }
  changePassword(data)
  {
    return this.http.post(this.url+'changePassword',data);
  }
  saveOneSignalId(data)
  {
    return this.http.post(this.url+'saveOneSignalId',data);
  }

  getCategories()
  {
    return this.http.get(this.url+'getCategories');
  }

  getSpacePrice(id)
  {
    return this.http.get(this.url+'get-space-price/'+id);
  }
  getPolicy()
  {
    return this.http.get(this.url+'getPolicy');
  }


  /**/
  getAllEstablishments(data)
  {
    return this.http.post(this.url+'getAllEstablishments',data);
  }
  getEstablishments(data)
  {
    return this.http.post(this.url+'getEstablishments',data);
  }
  getAllEstablishmentsEmpty(data)
  {
    return this.http.post(this.url+'getAllEstablishmentsEmpty',data);
  }
  getEstablishmentsEmpty(data)
  {
    return this.http.post(this.url+'getEstablishmentsEmpty',data);
  }
  getAllSchedules(id)
  {
    return this.http.get(this.url+'getAllSchedules/'+id);
  }
  deleteSchedule(id)
  {
    return this.http.get(this.url+'deleteSchedule/'+id);
  }

  getReservation(id)
  {
    return this.http.get(this.url+'getReservation/'+id);
  }
  getReservations(id)
  {
    return this.http.get(this.url+'getReservations/'+id);
  }
  getMyReservations(id)
  {
    return this.http.get(this.url+'getMyReservations/'+id);
  }
  getAllReservations(id)
  {
    return this.http.get(this.url+'getAllReservations/'+id);
  }

  getSpaces(id)
  {
    return this.http.get(this.url+'getSpaces/'+id);
  }
  getSpace(id)
  {
    return this.http.get(this.url+'getSpace/'+id);
  }

  getHours(data)
  {
    return this.http.post(this.url+'getHours',data);
  }

  addSpace(data)
  {
    return this.http.post(this.url+'addSpace',data);
  }

  addReservation(data)
  {
    return this.http.post(this.url+'addReservation',data);
  }

  saveReservation(data)
  {
    return this.http.post(this.url+'saveReservation',data);
  }
  saveReservation2(data)
  {
    return this.http.post(this.url+'saveReservation2',data);
  }
  getFaqs()
  {
    return this.http.get(this.url+'getFaqs');
  }

  deleteSpace(id)
  {
    return this.http.get(this.url+'deleteSpace/'+id);
  }

  getUser(id)
  {
    return this.http.get(this.url+'getUser/'+id);
  }
  findUsers(data)
  {
    return this.http.post(this.url+'findUsers',data);
  }

  socialLogin(data)
  {
    this.loading.create().then((l)=>{
      l.present();
      this.http.post(this.url+'socialLogin',data).subscribe((data:any)=>{

        localStorage.setItem('ELuser',JSON.stringify(data));
        localStorage.setItem('role',data.role_id);

        this.events.publish('changeMenu');

        if (data.role_id == 2){
          this.nav.navigateRoot('home-c');
        }
        else{
          this.nav.navigateRoot('home-l');
        }
        this.auth.login();
        this.menu.enable(true);
        //

        let onesignal_id = localStorage.getItem('onesignal_id');
        this.saveOneSignalId({id:this.auth.user.id,onesignal_id:onesignal_id})
        
        .subscribe(
          data => {console.log('ok');},
          err => {console.log(err);}
        );

        l.dismiss();
      },e=>{
        l.dismiss();

        alert(JSON.stringify(e));
      })

    })
  }


  /**/


  async loginGoogle() {

    this.googlePlus.login({})
      .then(result => {
        localStorage.setItem('google_login',JSON.stringify(result));
        
        let data = {
          name: result.displayName,
          email: result.email
        }

        // alert(JSON.stringify(result))

        this.socialLogin(data);

      })
      .catch(err => alert(`Error ${JSON.stringify(err)}`));

  }

  loginFacebook(){
    
    let permission = new Array<string>();

    //the permissions your facebook app needs from the user
    const permissions = ["public_profile", "email"];

    this.fb.login(permissions)
    .then(response =>{
      let userId = response.authResponse.userID;

      //Getting name and gender properties
      this.fb.api("/me?fields=name,email", permissions)
      .then(user =>{

        localStorage.setItem('facebook_login',JSON.stringify(user));

        let data = {
          name: user.name,
          email: user.email
        }

        // alert(JSON.stringify(user));

        this.socialLogin(data);

      })
    }, error =>{
      alert(JSON.stringify(error));
      // loading.dismiss();
    });
  }

  loginApple()
  {
    if (this.platform.is('ios')) {

      this.loading.create().then((l)=>{
        l.present();
        this.signInWithApple.signin({
          requestedScopes: [
            ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
            ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
          ]
        })
        .then((res: AppleSignInResponse) => {

          l.dismiss();

          // alert('Send token to apple for verification: ' + res.identityToken);

          let user = {
            name: res.fullName.givenName+' '+res.fullName.familyName,
            email: res.email,
          }

          console.log(res,JSON.stringify(user));
          
          if (!res.email || res.email == "") {
            return this.alert.create({message:"No ha sido posible obtener el email de la cuenta, no puede iniciar sesión"}).then(a=>{a.present();setTimeout(()=>{a.dismiss()},3000)});
          }

          localStorage.setItem('apple_user',JSON.stringify(user))
          this.socialLogin(user);

          //

        })
        .catch((error: AppleSignInErrorResponse) => {
          l.dismiss();
          alert(error.code + ' ' + error.localizedDescription);
          console.error("AppleSignInErrorResponse",error);
        });

      })
    }else{
      this.alert.create({message:"Función solo válida para usuarios de iOS"}).then(a=>{a.present();setTimeout(()=>{a.dismiss()},3000)});
    }
  }


}
