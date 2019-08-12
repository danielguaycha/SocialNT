import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from './user.service';
import {Config} from './config';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private auth;
  private readonly url;
  constructor(private http: HttpClient, userService: UserService) {
    this.auth = userService.getUser();
    this.url = Config.url;
  }

  addComment(pubId, marketId, text): Observable<any> {
    return this.http.post(`${this.url}/comment`,
      {pub_id: pubId, market_id: marketId, text});
  }

  getComments(pubId, type = 'pub', page = 1, limit = 7): Observable<any> {
    return this.http.get(`${this.url}/comments/${type}/${pubId}?page=${page}&limit=${limit}`);
  }

  deleteComment(id): Observable<any>{
      return this.http.delete(`${this.url}/comment/${id}`);
  }
}
