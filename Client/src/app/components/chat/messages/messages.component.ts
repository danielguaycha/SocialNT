import {Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Config} from '../../../services/config';
import {UserService} from '../../../services/user.service';
import {NgForm} from '@angular/forms';
import {MessageService} from '../../../services/message.service';
import {SocketService} from '../../../services/socket.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnChanges {

  @Input() user !: any;

  private selectedUser;
  public avatarUrl;
  public messagesList;
  public auth;
  public message;
  constructor(private userService: UserService,
              private messageService: MessageService,
              private socketService: SocketService) {
    this.avatarUrl = Config.avatar;
    this.messagesList = [];
    this.auth = userService.getUser();
    this.message = {text: ''};
  }

  ngOnInit() {
    if (!this.user) {return}
    this.loadChat(this.user);
    this.socketService.getMessages().subscribe((data: any) => {
      this.messagesList.push(data);
      this.scrollBottom();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.user = changes.user.currentValue;
    this.loadChat(this.user);
  }

  sendMessage(sendMessageForm: NgForm) {
    if (!this.message.text) {
      return;
    }
    this.messageService.sendMessage(this.selectedUser.id, this.message.text).subscribe(res => {
      if (res.ok) {

        res.data.user_receiver = this.selectedUser.username;
        res.data.user_emitter = {
          avatar: this.auth.avatar,
          lastname: this.auth.lastname,
          name: this.auth.name,
          username: this.auth.username
        };

        // newMessage.user_emitter.avatar  = this.auth.avatar;        console.log('Nuevo mensaje', newMessage);
        this.messagesList.push(res.data);
        this.socketService.sendMessage(res.data);
        sendMessageForm.reset();
        this.scrollBottom();
        this.reloadUser();
        // this.getMessagesUser();
      }
    } , err => {
      console.log(err);
    });
  }

  scrollBottom(time = 100) {
    setTimeout( () => {
      const el  = document.getElementById('message-content');
      el.scrollTop = el.scrollHeight;
    }, time);
  }

  loadChat(userId) {
    if (!userId) { return; }
    // this.selectedUser = user;
    this.messageService.getMessageByEmitter(userId).subscribe(res => {
      if (res.ok) {
        this.messagesList = res.messages.reverse();
        console.log(this.messagesList);
        this.selectedUser = res.user;
        this.scrollBottom(0);
      }
    }, err => {
      console.log(err);
    });
  }

  @Output() reload = new EventEmitter();
  reloadUser() {
    this.reload.emit({reload: 'true'});
  }
}
