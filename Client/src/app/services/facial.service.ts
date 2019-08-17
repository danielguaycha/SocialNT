import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from './config';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacialService {

  private readonly url;
  constructor(private http: HttpClient) {
    this.url = Config.py;
  }

  registerPhotos(data): Observable<any> {
    return this.http.post(`${this.url}/registerPhotos`, data);
  }

  identify(data): Observable<any> {
    return this.http.post(`${this.url}/identificar`, data);
  }
}
