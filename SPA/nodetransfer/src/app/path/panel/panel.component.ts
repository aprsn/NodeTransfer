import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../_services/alertify.service';
import { ApiService } from '../../_services/api.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  constructor(private alertify: AlertifyService, private api: ApiService, private activatedRoute: ActivatedRoute) { }

  userFiles: any;
  cols: any[];
  uniqId: string;
  userData: any = [];
  ngOnInit() {
    this.uniqId = this.activatedRoute.snapshot.paramMap.get('id');
    this.userInfo();
  }

  userInfo() {
    this.api.getUserInfo(this.uniqId).subscribe((res: any) => {
      this.userData = res.Response[0];
    }, err => {
      this.alertify.error('There is an undefined error. Please try again! ');
    });

    this.api.listUserFiles(this.uniqId).subscribe((res: any) => this.userFiles = res.Response, err =>
                           this.alertify.error('There is an undefined error. Please try again! '));

    this.cols = [
        { field: 'filename', header: 'Filename' },
        { field: 'size', header: 'Size' },
        { field: 'date', header: 'Upload Date' },
        { field: 'filename', header: 'Action'}
    ];


  }


  setFilePrivacy(filename, privacy, el, order) {
    const priv = +privacy;
    const linkElem = document.getElementById(`link_${order}`);
    this.api.setFilePrivacy(this.uniqId, priv, filename).subscribe(res => {
      if (priv) { this.alertify.success('File set as public!'); el.classList.remove('no'); el.classList.add('yes');
                  el.setAttribute('data-priv', 0 ); linkElem.classList.remove('disabled'); linkElem.classList.add('download'); } else {
        this.alertify.success('File set as private!'); el.classList.remove('yes'); el.classList.add('no');
        linkElem.classList.remove('download'); linkElem.classList.add('disabled');
        el.setAttribute('data-priv', 1 );
      }
    }, err => {
      this.alertify.error('Undefined error!');
      console.log(err);
    });
  }

  deleteFile(filename, fileCol) {
    if (!confirm(`Do you really want to delete ${filename} ? `)) { return false; }
    this.api.deleteFile(this.uniqId, filename).subscribe(res => {
      fileCol.remove();
      this.alertify.success('File is successfully deleted');
    }, err => this.alertify.error(err.error.Response));
  }

  downloadFile(filename) {
    const wait = document.querySelector('.wait');
    const bodyElem = document.querySelector('body');
    wait.classList.add('display-block');
    bodyElem.classList.add('noscroll');
    this.api.downloadFile(this.uniqId, filename).subscribe(res => {
      wait.classList.remove('display-block');
      bodyElem.classList.remove('noscroll');
      this.alertify.success('Download successfull');
      saveAs(res, filename);
    } ,
    err =>  console.log(err));
  }

  copyToClipboard(filename, status) {
    if (status.classList[1] === 'disabled') { this.alertify.warning('This file is not public, make it public to share '); return false; }
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
