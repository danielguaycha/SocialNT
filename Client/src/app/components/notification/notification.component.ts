import { Component, OnInit } from '@angular/core';
import {NotificationService} from '../../services/notification.service';
import {Config} from '../../services/config';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  private page;
  private showMore;
  private readonly limitPerPage;
  private loader;
  private notifies;
  private avatarUrl;
  constructor(private notifyService: NotificationService) {
    this.page = 0;
    this.showMore = true;
    this.loader = false;
    this.limitPerPage = 10;
    this.notifies = [];
    this.avatarUrl = Config.avatar;
  }

  ngOnInit() {
    this.getNotifications();
  }

  getNotifications() {
    this.page ++;
    this.loader = true;
    this.notifyService.getAllNotifies(this.page, this.limitPerPage).subscribe(res => {
      console.log(res);
      if (res.ok) {
        for (let i = 0; i < res.data.length; i++) {
          this.notifies.push(res.data[i]);
        }

        if (res.data.length < this.limitPerPage ) {
          this.showMore = false;
        }
      }
      this.loader = false;
    }, err => {
      console.log(err);
    });
  }

}
