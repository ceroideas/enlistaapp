import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { EventsService } from '../../../services/events.service';

import { DayPipe } from '../../../pipes/day.pipe';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.page.html',
  styleUrls: ['./schedules.page.scss'],
  providers: [DayPipe]
})
export class SchedulesPage implements OnInit {

  query:any;

  user = JSON.parse(localStorage.getItem('ELuser'));

  schedules:any = [];

  loaded = false;

  constructor(public route: ActivatedRoute, public nav: NavController, public api: ApiService, public events: EventsService, public alert: AlertController, public loading: LoadingController, public day: DayPipe) { }

  ngOnInit() {
    this.events.destroy('getAllSchedules');
    this.events.subscribe('getAllSchedules',()=>{
      this.getAllSchedules();
    });
    this.getAllSchedules();
  }

  getAllSchedules()
  {
    this.api.getAllSchedules(this.route.snapshot.params.id).subscribe(data=>{
      console.log(data);
      
      this.schedules = data;
      this.loaded = true;
    })
  }

  deleteSchedule(s)
  {
    this.alert.create({message:"¿Quiere eliminar el horario del día "+this.day.transform(s.date)+"?",buttons:[{
      text:"Si",
      handler: ()=>{
        this.loading.create().then(l=>{
          l.present();

          this.api.deleteSchedule(s.id).subscribe(data=>{
            l.dismiss();
            this.getAllSchedules();
          })
        })
      }
    },{
      text:"No"
    }]}).then(a=>a.present());
  }

}
