import { Component, OnInit } from '@angular/core';
import {SocketService} from '../../../services/socket.service';
import {Config} from '../../../services/config';
import {UserService} from '../../../services/user.service';
import {Store} from '@ngrx/store';
import * as actions from './../../../store/online.actions';
@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.css']
})
export class OnlineComponent implements OnInit {

  private avatarUrl;
  private userNames;
  private fistLoad;
  private onlineUsers;
  private auth;
  private counter; // pruebas
  private users;
  constructor(private socketService: SocketService,
              private userService: UserService,
              private store: Store<{number: number,
                users: any}>) {
    this.avatarUrl = Config.avatar;
    this.userNames = [];
    this.auth = userService.getUser();
    this.onlineUsers = [];
    this.counter = 1;
    this.fistLoad = true;
  }
  ngOnInit() {
     this.subscribe();
     this.store.subscribe(state => {
        console.log(this.store.select('users'));
    });
  }

  clicker() {
    const u = {
      id: this.counter,
      name: 'A ' + this.counter,
      lastname: 'B ' + this.counter,
    };
    this.store.dispatch(actions.newUser({user: u}));
    this.counter ++;
    console.log(this.users);
  }

  subscribe() {
    this.socketService.getOnlineUsers().subscribe((data: any) => {
      for (const username of Object.keys(data)) {

      }
    });
  }

  loadAllUsers() {
    if (!this.fistLoad) { return; }
    this.userService.getUsersForOnline(this.userNames).subscribe(res => {
      if (res.ok) {
          this.onlineUsers = res.data;
          for (const u of res.data) {
              this.store.dispatch(actions.newUser({user: u}));
          }
          this.fistLoad = false;
      }
    }, err => console.log(err));
  }

  loadOneUser(username) {
    if (this.fistLoad) { return; }
    this.userService.getUserForOnline(username).subscribe(res => {
      if (res.ok) {
        this.onlineUsers.push(res.data);
      }
    }, err => console.log(err));
  }
}

/*
console.log(data);
console.log(user, data[user]);
const index = this.userNames.findIndex(user => user === username);
if (index < 0 && this.auth.username !== username) {
  this.userNames.push( username );
  this.loadOneUser(username);
}

*/
