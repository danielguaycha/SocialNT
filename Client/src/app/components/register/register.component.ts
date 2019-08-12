import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  providers: [ UserService ]
})
export class RegisterComponent implements OnInit {

  public user: User;
  public message: string;
  public type: string;

  constructor(public userService: UserService, private router: Router) {
      if (this.userService.getUser() && this.userService.getToken()) {
          this.router.navigate(['/home']);
      }
      this.user = new User('', '', '', '', '', '', '');
  }

  ngOnInit() {
  }

  onSubmit() {
      // console.log(`Submitted...`);
      this.userService.register(this.user).subscribe(resp => {
        if (resp.ok) {
            if (resp.message) {
              this.message = resp.message;
              this.type = 'success';
              this.user =  new User('', '', '', '', '', '', '');
            } else {
              this.message = 'No se pudo registrar el usuario! Reintente';
              this.type = 'danger';
            }
        }
      }, err => {
          console.log(err);
          this.message = err.error.message;
          this.type = 'warning';
      });
  }

}
