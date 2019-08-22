import { Injectable } from '@angular/core';
import {Config} from './config';
import * as io from 'socket.io-client';
import {UserService} from './user.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private readonly url;
  private socket;
  private readonly auth;

  constructor(userService: UserService) {
    this.url = Config.server;
    this.auth = userService.getUser();
    this.socket = io(this.url);
    this.newUser();
  }

  newUser() {
    if (this.auth !== null) {
      this.socket.emit('new-user', {nick: this.auth.username }, data => {
        console.log('connecting');
        console.log(data);
      });
    }
  }

  newUserByUsername(username) {
      this.socket.emit('new-user', {nick: username }, data => {
        console.log('connecting');
        console.log(data);
      });
  }

  sendMessage(message) {
    this.socket.emit('chat-message', message);
  }

  writing(data) {
    this.socket.emit('writing', data);
  }

  offline(username) {
    this.socket.emit('offline', {username});
  }

  disconnect(username){
    this.socket.emit('logout', {username});
  }

  getMessages = () => {
    return new Observable(observer => {
      this.socket.on('chat-message', (data) => {
          observer.next(data);
      });
    });
  }

  getOnlineUsers = () => {
    return new Observable(observer => {
      this.socket.on('online', (data) => {
        observer.next(data);
      });
    });
  }

  setOfflineUser = () => {
    return new Observable(observer => {
      this.socket.on('offline', (data) => {
        observer.next(data);
      });
    });
  }

  getNotifications = () => {
    return new Observable(observer => {
      this.socket.on('notify', (data) => {
        observer.next(data);
      });
    });
  }

  getNewMessage = () => {
    return new Observable(observer => {
      this.socket.on('new-message', (data) => {
        observer.next(data);
      });
    });
  }

  getWritingUser = () => {
    return new Observable(observer => {
      this.socket.on('writing', (data) => {
        observer.next(data);
      });
    });
  }
}
