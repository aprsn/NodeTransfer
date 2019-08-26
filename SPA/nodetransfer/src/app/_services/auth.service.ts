import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AlertifyService } from './alertify.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private alertify: AlertifyService, private router: Router) {}

  baseURL = environment.baseURL;
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  checkUser: number;

  register(model: any) {
    return this.http.post(this.baseURL + '/auth/register', model);
  }

  login(model: any) {
    return this.http.post(this.baseURL + '/auth/login', model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token', user.Token);
          this.decodedToken = this.jwtHelper.decodeToken(user.Token);
          localStorage.setItem('username', this.decodedToken.unique_name);
          localStorage.setItem('_id', this.decodedToken._id);
        }
      })
    );
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    const uniqId = localStorage.getItem('_id');
    const linkId = location.href.split('/')[4];
    const onPanel = (location.href.split('/')[3] === 'panel');
    const uniqIdfromToken = this.jwtHelper.decodeToken(token);
    if (uniqId) { if (uniqId !== uniqIdfromToken._id) { return false; } }
    if (onPanel && uniqId) { if (linkId !== uniqIdfromToken._id) { this.router.navigate(['/panel/' + uniqId]); } }
    return !this.jwtHelper.isTokenExpired(token);
  }



  logOutUser() {
    this.alertify.error('Access denied! Please log in again.');
    localStorage.removeItem('token');
    localStorage.removeItem('_id');
    this.router.navigate(['/home']);
  }

}
