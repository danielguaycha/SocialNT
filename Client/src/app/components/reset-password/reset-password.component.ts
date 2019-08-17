import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  private mail;
  constructor(private userService: UserService, private alert: AlertService) { }

  ngOnInit() {
  }

  sendResetPassword(resetPassworForm: NgForm) {
    if (!this.mail) { return; }

    this.userService.sendResetPassword(this.mail).subscribe(res => {
      if (res.ok) {
        this.alert.success(res.message);
        resetPassworForm.reset();
      } else {
        this.alert.error(res.message);
      }
    }, err => {
        this.alert.error(err);
    });
  }

}
