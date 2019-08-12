import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from './config';
import {Observable} from 'rxjs';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  private readonly url;
  private auth;
  constructor(private http: HttpClient,
              private userService: UserService) {
    this.url = Config.php;
    this.auth = userService.getUser();
  }
  // ``
  getAllMarkets(page = 1, limit = 10, u = null, c = null, q = null): Observable<any> {
    let request = `${this.url}/market/list/${this.auth.id}?page=${page}&limit=${limit}`;

    if (u) { request += '&u=' + u; }
    if (c) { request += '&c=' + c; }
    if (q) { request += '&q=' + q; }

    return this.http.get(request);
  }

  addMarket(data): Observable<any> {
    return this.http.post(`${this.url}/market`, data);
  }

  deleteMarket(id): Observable<any> {
    return this.http.delete(`${this.url}/market/${id}`);
  }

  deleteMarketSave(id): Observable<any> {
    return this.http.delete(`${this.url}/marketsave/${id}`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.url}/category`);
  }

  getItem(id): Observable<any> {
    return this.http.get(`${this.url}/market/view/${id}`);
  }

  saveItem(itemId): Observable<any> {
    return this.http.post(`${this.url}/marketsave`,
        {user_id: this.auth.id, market_id: itemId, type: 'SAVE'});
  }

  shopItem(itemId): Observable<any> {
    return this.http.post(`${this.url}/marketsave`,
        {user_id: this.auth.id, market_id: itemId, type: 'SHOP'});
  }

  getItems(type = 'save', page = 1, limit = 20): Observable<any> {
    return this.http.get(`${this.url}/marketsave/${this.auth.id}/${type}?page=${page}&limit=${limit}`);
  }

}
