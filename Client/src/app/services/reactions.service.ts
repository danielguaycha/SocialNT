import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from './config';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReactionsService {
  private readonly url;
  constructor(private http: HttpClient) {
    this.url = Config.url;
  }

  addReaction(pubId = null, marketId = null , type = 'like'): Observable<any> {
    return this.http.post(`${this.url}/reaction`, {
        pub_id: pubId,
        market_id : marketId,
        type
    });
  }

  getReactions(id, type = 'pub'): Observable<any> {
    return this.http.get(`${this.url}/reactions/${type}/${id}`);
  }

  viewUserReactions(pubId, type = 'pub', page = 1): Observable<any> {
    return this.http.get(`${this.url}/reactions/users/${type}/${pubId}?page=${page}`);
  }
}
