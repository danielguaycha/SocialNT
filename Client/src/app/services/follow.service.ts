import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './config';
import { Observable } from 'rxjs';

@Injectable()
export class FollowService {
    url: string;
    constructor(private http: HttpClient) {
        this.url = Config.url;
    }
    // Seguir a un usuario
    follow(userId): Observable<any> {
        return this.http.post(`${this.url}/follow`, {user_follow: userId});
    }

    // Dejar de Seguir
    unfollow(userId): Observable<any> {
        return this.http.post(`${this.url}/unfollow`, {user_follow: userId});
    }

    // Obtener usuarios que siguo, o que sigue un usuario
    followeds(userId= '', page = 1, limit = 20): Observable<any> {
        return this.http.get(`${this.url}/followed/${userId}?page=${page}&limit=${limit}`);
    }

    // Obtener los usuarios que me siguien o siguen a un usuario x
    followers(userId= '', page = 1, limit = 20): Observable<any> {
        return this.http.get(`${this.url}/follower/${userId}?page=${page}&limit=${limit}`);
    }

}
