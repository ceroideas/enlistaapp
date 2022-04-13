import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';

import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  providers: [CallNumber]
})
export class DetailsPage implements OnInit {

  e:any;
  loaded = false;

  constructor(public api: ApiService, public route: ActivatedRoute,private callNumber: CallNumber, public loading: LoadingController) { }

  ngOnInit() {
    this.loading.create().then((l)=>{
      l.present();

      this.api.getSpaces(this.route.snapshot.params.id).subscribe(data=>{
        this.e = data;
        this.loaded = true;
        l.dismiss();
      })

    })
  }

  addParam(a)
  {

  }

  call(n)
  {
    this.callNumber.callNumber(n, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  openMap(e)
  {
    window.open('https://www.google.com/maps/@'+e.lt+','+e.ln+',15z','_blank');
  }

}
