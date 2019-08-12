import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { AlertService } from './services/alert.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ UserService, AlertService]
})

export class AppComponent {
  title = 'SNapp';
  public search: string;
  public auth;
  constructor(
    private router: Router,
    private userService: UserService) {}

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {
    this.auth = this.userService.getUser();
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngDoCheck() {
    this.auth = this.userService.getUser();
  }

  logout() {
    localStorage.clear();
    this.auth = null;
    this.router.navigate(['/login']);
  }

    searchUser(searchForm: NgForm) {

    if (!this.search) {
      return;
    }
    if (this.search.trim() !== '') {
      this.router.navigate(['/search/u', this.search]);
    }
  }
}
