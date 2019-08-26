import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) {}
  loggedIn = false;
  ngOnInit() {
    this.loggedIn = this.auth.loggedIn();
    if (this.loggedIn) { this.router.navigate(['/panel/' + localStorage.getItem('_id')]); }
  }

}
