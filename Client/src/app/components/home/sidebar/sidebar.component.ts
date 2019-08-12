import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Config } from 'src/app/services/config';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {
  public user;
  public stats;
  public avatar;
  constructor(private userService: UserService) {
    this.stats = {
      followed: 0,
      followers: 0
    };
    this.avatar = Config.avatar;
  }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.loadStats();
  }

  loadStats() {
    this.userService.getStats(this.user.id).subscribe(res => {
      if (res.ok) {
        // console.log(res);
        this.stats.followed = res.followed.count;
        this.stats.followers = res.followers.count;
      }
    }, err => {
      console.log(err);
    });
  }

}
