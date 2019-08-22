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
  private auth;
  private users;
  private tempUsers;
  private fistLoad;

  constructor(private socketService: SocketService,
              private userService: UserService,
              private store: Store<{number: number, users: any}>) {
    this.avatarUrl = Config.avatar;
    this.auth = userService.getUser();

    this.tempUsers = [];
    this.users = [];
    this.fistLoad = true;
    this.avatarUrl = Config.avatar;

  }
  ngOnInit() {
    this.store.select('online').subscribe(state => {
        this.users = state.users;
    });

    this.subscribe();
  }

  subscribe() {
    this.socketService.getOnlineUsers().subscribe((data: any) => {
      console.log(data);
      for (const username of Object.keys(data)) {
        const index = this.users.findIndex(user => user.username === username);
        if (index < 0) {
          if (this.fistLoad) {
            this.tempUsers.push(username);
          } else {
            this.loadOneUser(username);
          }
        }
      }
      if (this.fistLoad) {
        this.loadAllUsers();
      }
    });

    this.socketService.setOfflineUser().subscribe( (data: any) => {
      this.store.dispatch(actions.removeUser({username: data.username}));
    });
  }

  loadAllUsers() {
    if (!this.fistLoad) { return; }
    this.userService.getUsersForOnline(this.tempUsers).subscribe(res => {
      if (res.ok) {
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
        // this.onlineUsers.push(res.data);
        this.store.dispatch(actions.newUser({ user: res.data }));
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
