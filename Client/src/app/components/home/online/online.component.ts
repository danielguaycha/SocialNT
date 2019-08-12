import { Component, OnInit } from '@angular/core';
import {SocketService} from '../../../services/socket.service';
import {Config} from '../../../services/config';
import {UserService} from '../../../services/user.service';

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
  constructor(private socketService: SocketService, private userService: UserService) {
    this.avatarUrl = Config.avatar;
    this.userNames = [];
    this.auth = userService.getUser();
    this.onlineUsers = [];
  }

  ngOnInit() {
    this.subscribe();
    this.fistLoad = true;
  }

  subscribe() {
    this.socketService.getOnlineUsers().subscribe((data: any) => {
      for (const username of Object.keys(data)) {
        console.log(data);
        // console.log(user, data[user]);
        const index = this.userNames.findIndex(user => user === username);
        if (index < 0 && this.auth.username !== username) {
          this.userNames.push( username );
          this.loadOneUser(username);
        }
      }
      this.loadAllUsers();
    });

  }

  loadAllUsers() {
    if (!this.fistLoad) { return; }
    this.userService.getUsersForOnline(this.userNames).subscribe(res => {
      if (res.ok) {
          this.onlineUsers = res.data;
          this.fistLoad = false;
      }
    }, err => console.log(err));
  }

  loadOneUser(username) {
    if(this.fistLoad) { return; }
    this.userService.getUserForOnline(username).subscribe(res => {
      if (res.ok) {
        this.onlineUsers.push(res.data);
      }
    }, err => console.log(err));
  }
}
