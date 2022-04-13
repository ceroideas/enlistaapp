import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.page.html',
  styleUrls: ['./policy.page.scss'],
})
export class PolicyPage implements OnInit {

  policy:any; // this.sanitizer.bypassSecurityTrustResourceUrl(this.api.baseUrl+'storage/PrivacyPolicy.pdf');

  constructor(public api: ApiService, public loading: LoadingController, public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.api.getPolicy().subscribe(data=>{
      this.policy = data[0];
    })
  }

}
