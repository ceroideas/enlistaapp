import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  user = JSON.parse(localStorage.getItem('CLuser'));
  
  constructor(private authService: AuthService, private router: Router) { }

  public canActivate(route: ActivatedRouteSnapshot)
  {
    if (!this.authService.isLoggedIn)
  	{
      this.router.navigate(['/start']);
      return false;
   	}else{
       this.user = JSON.parse(localStorage.getItem('ELuser'));
       const role = route.data.role;
       if (!role) {
         return true;
       }
       if (this.user.role != role) {
         this.router.navigate(['/start']);
         return false;
       }
       return true;
     }
  }

}
