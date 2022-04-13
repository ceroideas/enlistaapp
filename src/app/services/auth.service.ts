import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = JSON.parse(localStorage.getItem('ELuser'));
  isLoggedIn = false;
  constructor() {
    if (localStorage.getItem('ELuser')) {
      this.isLoggedIn = true;
    }
  }

  login()
  {
    this.user = JSON.parse(localStorage.getItem('ELuser'));
    this.isLoggedIn = true;
  }

  logOut()
  {
    localStorage.removeItem('role');
    localStorage.removeItem('ELuser');
    localStorage.removeItem('kitchen');
    localStorage.removeItem('restaurant');
    this.isLoggedIn = false;
  }
}
