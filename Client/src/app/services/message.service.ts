import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from './config';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly url;
  constructor(private http: HttpClient) {
    this.url = Config.url;
  }

  getUsersMessages(): Observable<any> {
    return this.http.get(`${this.url}/messages`);
  }

  getMessageByEmitter(emitterId): Observable<any> {
    return this.http.get(this.url + '/message/list/' + emitterId);
  }

  sendMessage(receiverId, message): Observable<any> {
    return this.http.post(`${this.url}/message`, {receiver: receiverId, text: message});
  }
}
