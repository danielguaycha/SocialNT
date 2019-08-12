import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {Config} from '../../services/config';
import {SocketService} from '../../services/socket.service';
import {MessageService} from '../../services/message.service';
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [MessageService]
})
export class ChatComponent implements OnInit {

  private users;
  public auth;
  public querySearch;
  public avatarUrl;
  public messageEmitters;
  public title;

  public userId;

  constructor(private userService: UserService,
              private messageService: MessageService,
              private router: ActivatedRoute) {
    this.auth = userService.getUser();
    this.users = [];
    this.messageEmitters = [];
    this.avatarUrl = Config.avatar;
    this.title = 'Mensajes';
  }

  ngOnInit() {
    this.getMessagesUser();
    this.router.params.subscribe(routeParams => {
       this.userId = routeParams.id;
    });
  }

  getMessagesUser() {
    this.users = [];
    this.messageService.getUsersMessages().subscribe(res => {
        if (res.ok) {
          this.messageEmitters = res.users.reverse();
        }
    }, err => {
        console.log(err);
    });
  }

  // buscar un usuario para comenzar chat
  findUser() {
    if (!this.querySearch) {
      this.users = [];
      this.title = 'Mensajes';
      return;
    }

    this.title = 'Búsqueda';
    this.userService.search(this.querySearch).subscribe(res => {
        if (res.ok) {
          this.users = res.users;
        }
    }, err => {
        console.log(err);
    });
  }

}
