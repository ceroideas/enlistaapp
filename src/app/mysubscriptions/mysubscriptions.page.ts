import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-mysubscriptions',
  templateUrl: './mysubscriptions.page.html',
  styleUrls: ['./mysubscriptions.page.scss'],
})
export class MysubscriptionsPage implements OnInit {

  @Input() subs:any;

  constructor(public api: ApiService) { }

  ngOnInit() {
    console.log(this.subs);
  }

}
