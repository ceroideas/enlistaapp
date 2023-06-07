import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { EventsService } from './events.service';

@Injectable()
export class ReservesService implements CanActivate {

  user = JSON.parse(localStorage.getItem('ELuser'));
  
  constructor(private authService: AuthService, private router: Router, public events: EventsService) {
    this.events.destroy('reloadService1')
    this.events.subscribe('reloadService1',()=>{
      this.user = JSON.parse(localStorage.getItem('ELuser'));;
    });
  }

  public canActivate(route: ActivatedRouteSnapshot)
  {
    if (!this.authService.isLoggedIn)
    {
      this.router.navigate(['/start']);
      return false;
     }else{
       if (this.user.establishment.anticipation) {
         return true;
       }
       this.events.publish('openNotificationContact');
       return false;
     }
  }

}
