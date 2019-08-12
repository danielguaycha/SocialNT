import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Config } from './config';
import { Observable } from 'rxjs';


@Injectable()
export class UserService {
    public url: string; // http://localhost:3000/api
    public authUser;
    public token;
    // Servicios: Ejecutan las peticiones http
    constructor(public http: HttpClient) {
        this.url = Config.url;
    }

    // registrar un usuario
    register(user: User): Observable<any> {
        return this.http.post(`${this.url}/user`, user);
    }

    // Login users
    login(user: any): Observable<any> {
        return this.http.post(`${this.url}/login`, user);
    }

    // obtener datos estadisticos, seguidores y seguidos
    getStats(userId): Observable<any> {
        return this.http.get(`${this.url}/follow/stats/${userId}`);
    }

    // buscar un usuario por username o name
    search(data): Observable<any> {
        return this.http.get(`${this.url}/users/${data}`);
    }

    // Buscar usuario por id
    findById(data): Observable<any> {
        return this.http.get(`${this.url}/user/${data}`);
    }

    // Actualizar los datos del usuario
    updateUser(user): Observable<any> {
        return this.http.put(`${this.url}/user`, user );
    }

    // actualizar avatar de un usuario
    updateAvatar(data): Observable<any> {
        return this.http.post(`${this.url}/user/avatar`, data );
    }

    // cambiar contraseña

    updatePassword(data): Observable<any> {
        return this.http.put(`${this.url}/user/password`, data);
    }

    // confirmar email
    confirmMail(id, token): Observable<any> {
        return this.http.get(`${this.url}/user/confirm/${id}/${token}`);
    }

    // ============================
    // 	    Auth
    // ============================

    // obtener usuario del localStorage
    getUser() {
        const user = JSON.parse(localStorage.getItem('user'));


        if (user !== undefined) {
            this.authUser = user;
        } else {
            this.authUser = null;
        }

        return this.authUser;
    }

    // obtener el token del usuario logeado
    getToken() {
        const token = localStorage.getItem('token');

        if (token !== undefined) {
            this.token = token;
        } else {
            this.token = null;
        }

        return this.token;
    }

    //
    getUserForOnline(username): Observable<any> {
        return this.http.get(`${this.url}/user/online/${username}`);
    }

    //
    getUsersForOnline(users): Observable<any> {
        return this.http.post(`${this.url}/users/online`, { users })
    }
}
