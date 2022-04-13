import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit {

  query:any;
  faqs:any = [];

  show = null;

  constructor(public api: ApiService) { }

  ngOnInit() {
    this.api.getFaqs().subscribe(data=>{
      this.faqs = data;
    })
  }

}
