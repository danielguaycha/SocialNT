import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})

export class ConfirmComponent implements OnInit {
  public id;
  public token;
  public canInit;

  constructor(private userService: UserService,
              private router: Router,
              private alert: AlertService,
              private route: ActivatedRoute) {
      if (this.userService.getUser() && this.userService.getToken()) {
          this.router.navigate(['/home']);
      }
      this.canInit = false;
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.token = this.route.snapshot.paramMap.get('token');
    this.confirmMail();
  }

  confirmMail() {

    this.userService.confirmMail(this.id, this.token).subscribe(res => {
      console.log(res);
      if (res.ok) {
        if (res.message) {
          this.alert.success(res.message);
          this.canInit = true;
        }
      }
    }, err => {
      this.alert.error(err);
      console.log(err);
    });
  }

}
