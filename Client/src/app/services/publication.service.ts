import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './config';
import { Observable } from 'rxjs';

@Injectable()
export class PublicationService {
    public url: string;
    constructor(public http: HttpClient) {
        this.url = Config.url;
    }

    store(publication): Observable<any> {
        return this.http.post(`${this.url}/publication`, publication);
    }

    list(page = 1): Observable<any> {
        return this.http.get(`${this.url}/publication?page=${page}`);
    }

    destroy(id): Observable<any> {
        return this.http.delete(`${this.url}/publication/${id}`, {} );
    }

    listById(userId, page = 1): Observable<any> {
        return this.http.get(`${this.url}/publication/user/${userId}?page=${page}`);
    }

    view(pubId): Observable<any> {
        return this.http.get(`${this.url}/publication/${pubId}`);
    }
}
