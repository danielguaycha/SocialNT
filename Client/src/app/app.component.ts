import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { AlertService } from './services/alert.service';
import {NgForm} from '@angular/forms';
import {SocketService} from './services/socket.service';
import * as $ from 'jquery';
import * as actions from './store/online.actions';
import {Store} from '@ngrx/store';
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
  private notify;
  private newNotify;
  private newMessage;
  

  constructor(
      private socketService: SocketService,
      private router: Router,
      private userService: UserService, private store: Store<{number: number, users: any}>) {
    this.newNotify = false;
    this.newMessage = false;
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {
    this.auth = this.userService.getUser();
    this.notifySubscribe();
    this.messageSubscribe();
  }

  messageSubscribe() {
    this.socketService.getNewMessage().subscribe( (data: any) => {
      this.newMessage = true;
    });
  }

  notifySubscribe() {
    this.socketService.getNotifications().subscribe( (data: any) => {
      this.notify = data;
      this.newNotify = true;
      // console.log(this.notify);
      $('.popup').css('display', 'block').show('fast');
      setTimeout( () => {
        this.closeNotify();
      }, 6000);
    });
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

  closeNotify() {
    $('.popup').hide('fast');
    this.notify = null;
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
