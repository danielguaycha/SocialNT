import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgForm} from '@angular/forms';
import {UserService} from '../../../services/user.service';
import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-reset-password-confirm',
  templateUrl: './reset-password-confirm.component.html',
  styleUrls: ['./reset-password-confirm.component.css']
})
export class ResetPasswordConfirmComponent implements OnInit {
  private email;
  private token;
  private password;
  constructor(private router: ActivatedRoute,
              private userService: UserService,
              private alert: AlertService) {
    this.token = router.snapshot.paramMap.get('token');
  }

  ngOnInit() {

  }

  sendConfirmResetPassword(resetPassworForm: NgForm) {
    this.userService.sendConfirmResetPassword(this.email, this.token, this.password).subscribe(res => {
      if (res.ok) {
        this.alert.success('Confirmación realizada con éxito ya puede iniciar sesión');
        resetPassworForm.reset();
      }
    }, error => {
        this.alert.error(error);
        console.log(error);
    });
  }

}
