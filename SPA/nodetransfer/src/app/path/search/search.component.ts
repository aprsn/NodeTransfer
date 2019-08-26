import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../_services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private api: ApiService, private router: Router) { }
  result: any;
  ngOnInit() {
  }

  searchUser(q) {
    if (q.replace(/\s/g, '') === '' || q === null) {
      this.result = [];
    } else {
      this.api.searchUser(q).subscribe(res => {
        this.result = res;
      });
    }
  }

  route(username) {
    const id = localStorage.getItem('_id');
    this.router.navigate(['/panel/' + id + '/user/' + username]);
  }


}
