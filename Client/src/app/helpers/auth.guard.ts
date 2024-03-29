import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private userService: UserService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) {

        const user = this.userService.getUser();
        const token = this.userService.getToken();

        if (user && token) { return true; }

        localStorage.clear();
        this.router.navigate(['/login'], {queryParams: { returnUrl: state.url } });
        return false;
    }
}
