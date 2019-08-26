import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../_services/api.service';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private route: ActivatedRoute, private api: ApiService, private alertify: AlertifyService) { }
  username: string;
  cols: any[];
  userFiles: any;
  ngOnInit() {
     this.username = this.route.snapshot.paramMap.get('user');
     this.getFiles(this.username);
  }

  getFiles(username) {
    this.api.getFiles(username).subscribe((res: any) => {
      this.userFiles = res.Response;
    }, err => this.alertify.error(err.error.Response));

    this.cols = [
      { field: 'filename', header: 'Filename' },
      { field: 'size', header: 'Size' },
      { field: 'date', header: 'Upload Date' },
      { field: 'filename', header: 'Action'}
  ];

  }

  copyToClipboard(filename) {
    const username = localStorage.getItem('username');
    const link = `https://api.nodetransfer.com/get/publicFile/${username}/${filename}`;
    const tempInput = document.createElement('input');
    tempInput.value = link;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    this.alertify.success('Link copied to the clipboard!');
  }

}
