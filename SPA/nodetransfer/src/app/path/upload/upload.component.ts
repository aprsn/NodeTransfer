import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../_services/api.service';
import { AlertifyService } from '../../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  file: File = null;
  constructor(private api: ApiService, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
  }

  myUploader(event) {
    this.file = event.files[0];
    const wait = document.querySelector('.wait');
    const bodyElem = document.querySelector('body');
    wait.classList.add('display-block');
    bodyElem.classList.add('noscroll');
    this.api.postFile(this.file).subscribe(data => {
      wait.classList.remove('display-block');
      bodyElem.classList.remove('noscroll');
      this.alertify.success('File successfully uploaded!');
      const id = localStorage.getItem('_id');
      this.router.navigate(['/panel/' + id]);
      }, error => {
      this.alertify.error(error.error.Response);
  });
  }

}
