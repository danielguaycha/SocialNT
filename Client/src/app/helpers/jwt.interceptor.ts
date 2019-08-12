import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private userService: UserService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const user = this.userService.getUser();
        const token = this.userService.getToken();
        if (user && token) {
            req = req.clone({
                setHeaders: {

                    Authorization: token
                }
            });
        }

        return next.handle(req);
    }

}
