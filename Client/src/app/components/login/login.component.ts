import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import {NgForm} from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public user: any;
  public loginUser: any;
  public token: any;
  public loader: boolean;

  constructor(public userService: UserService,
              public alert: AlertService,
              public router: Router) {
      if (this.userService.getUser() && this.userService.getToken()) {
          this.router.navigate(['/home']);
      }
      this.user = {};
  }

  ngOnInit() {
  }

  onSubmit(loginForm: NgForm) {
    this.loader = true;
    this.userService.login(this.user).subscribe(res => {
      if (res.ok) {
          this.loginUser = res.data.user;
          this.token = res.data.token;

          // guardando datos de sesion
          localStorage.setItem('user', JSON.stringify(this.loginUser));
          localStorage.setItem('token', this.token);
          this.loader = true;
          this.router.navigate(['/home']);
      }

    }, err => {
      console.log(err);
      this.alert.error(err);
      this.loader = false;
    });
  }


}
