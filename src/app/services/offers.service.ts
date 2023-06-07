import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { EventsService } from './events.service';

@Injectable()
export class OffersService implements CanActivate {

  user = JSON.parse(localStorage.getItem('ELuser'));
  
  constructor(private authService: AuthService, private router: Router, public events: EventsService) {
    this.events.destroy('reloadService2')
    this.events.subscribe('reloadService2',()=>{
      this.user = JSON.parse(localStorage.getItem('ELuser'));;
      console.log(this.user);
    });
  }

  public canActivate(route: ActivatedRouteSnapshot)
  {
    if (!this.authService.isLoggedIn)
    {
      this.router.navigate(['/start']);
      return false;
     }else{
       if (this.user.establishment.max_notifications) {
         return true;
       }
       this.events.publish('openOfferContact');
       return false;
     }
  }

}
