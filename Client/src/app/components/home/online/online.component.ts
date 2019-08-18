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

  constructor(private socketService: SocketService,
              private userService: UserService,
              private store: Store<{number: number, users: any}>) {
    this.avatarUrl = Config.avatar;
    this.auth = userService.getUser();

  }
  ngOnInit() {
    this.store.select('online').subscribe(state => {
        this.users = state.users;
    });
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
