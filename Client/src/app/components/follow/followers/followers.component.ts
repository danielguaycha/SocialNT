import { Component, OnInit } from '@angular/core';
import { FollowService } from 'src/app/services/follow.service';
import { Config } from 'src/app/services/config';
import { UserService } from 'src/app/services/user.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styles: [],
  providers: [FollowService]
})
export class FollowersComponent implements OnInit {
  public followers;
  public avatar;
  public auth;
  public userId;
  public userData;
  public page;
  public showMore;

  constructor(private followService: FollowService,
              private userService: UserService,
              private router: ActivatedRoute) {
    this.avatar = Config.avatar;
    this.auth = userService.getUser();
    this.reset();
    if (router.snapshot.paramMap.get('id')) {
      this.userId = router.snapshot.paramMap.get('id');
    } else {
      this.userId = this.auth.id;
    }
  }

  reset() {
    this.page = 0;
    this.followers = [];
    this.showMore = true;
  }

  ngOnInit() {
    this.loadFollowers();
    this.setUserData();
  }

  setUserData() {
    this.userService.findById(this.userId).subscribe(res => {
      if (res.ok) {
        this.userData = res.user;
      }
    }, err => {
      console.log(err);
    });
  }

  loadFollowers() {
    this.page++;
    this.followService.followers(this.userId, this.page, 20).subscribe(res => {
      // console.log('followers', res);
      if (res.ok) {
        // this.followers = res.followed;
        for (let i = 0; i < res.followed.length; i++) {
          this.followers.push(res.followed[i]);
        }
        if (res.followed.length < 20) {
          this.showMore = false;
        }
      }
    }, err => {
      console.log(err);
    });
  }

  follow(id) {
    this.followService.follow(id).subscribe(res => {
      if (res.ok) {
        this.reset();
        this.loadFollowers();
      }
    }, err => {
      console.log(err);
    });
}

}
