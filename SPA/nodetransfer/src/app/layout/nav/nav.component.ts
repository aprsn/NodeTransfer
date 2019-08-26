import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { AlertifyService } from '../../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public auth: AuthService, private alertify: AlertifyService, private router: Router) { }

  username: string;
  ngOnInit() {

  }

  loggedIn() {
    return this.auth.loggedIn();
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('_id');
    this.alertify.message('Successfully logged out!');
    this.router.navigate(['/']);
  }

  route(location) {
    const id = localStorage.getItem('_id');
    this.router.navigate(['/panel/' + id + '/' + location]);
  }
  isActive(instruction: string): boolean {
    const path = this.router.url.split('/')[3];
    if (instruction === path) { return true; }
    return false;
  }

}
