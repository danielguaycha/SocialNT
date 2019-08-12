import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Config} from './config';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly url;
  constructor(private http: HttpClient) {
    this.url = Config.url;
  }

  getAllNotifies(page = 1, limit = 10): Observable<any> {
    return this.http.get(`${this.url}/notifies?page=${page}&limit=${limit}`);
  }

  changeViewStatus(notifyId): Observable<any> {
    return this.http.get(`${this.url}/notify/view/${notifyId}`);
  }

  deleteNotify(notifyId): Observable<any> {
    return this.http.delete(`${this.url}/notify/${notifyId}`);
  }

  notifyMarketPlace(marketId): Observable<any> {
    return this.http.post(`${this.url}/notify/market`, {market_id: marketId});
  }
}
