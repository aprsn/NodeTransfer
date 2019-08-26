import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../_services/api.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute, private alertify: AlertifyService) { }
  userData: any = [];
  uniqueId: string;
  ngOnInit() {
    this.uniqueId = this.activatedRoute.snapshot.paramMap.get('id');
    this.userInfo(this.uniqueId);
  }


  userInfo(uniqId) {
    this.api.getUserInfo(uniqId).subscribe((res: any) => this.userData = res.Response[0],
                                           err => this.alertify.error('There is an undefined error, please reload the page.') );
  }

  changePrivacy(privacy) {
    this.api.setPrivacy(this.uniqueId, privacy).subscribe(
      res => {
        this.alertify.success('Your account privacy has been successfully changed!');
        this.userInfo(this.uniqueId);
      }, err => {
        this.alertify.error('There is an undefined error, please try again!');
        console.log(err);
      });
  }


}
