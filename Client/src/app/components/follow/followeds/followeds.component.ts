import { Component, OnInit } from '@angular/core';
import { FollowService } from 'src/app/services/follow.service';
import { Config } from 'src/app/services/config';
import { UserService } from 'src/app/services/user.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-followeds',
  templateUrl: './followeds.component.html',
  styleUrls: ['./followeds.component.css'],
  providers: [FollowService]
})
export class FollowedsComponent implements OnInit {

  public follow;
  public avatar;
  public auth;
  public page;
  public userId;
  public userData;
  public viewMore;

  constructor(private followService: FollowService,
              private userService: UserService,
              private router: ActivatedRoute) {

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
      this.follow = [];
      this.viewMore = true;
  }
  ngOnInit() {
    this.loadFollowed();
    this.avatar = Config.avatar;
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

  loadFollowed() {
      this.page++;
      this.followService.followeds(this.userId, this.page, 20).subscribe(res => {
          // console.log(res);
          if (res.ok) {
              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < res.followed.length; i++) {
                  this.follow.push(res.followed[i]);
              }

              if (res.followed.length < 20) {
                 this.viewMore = false;
              }
            // this.follow = res.followed;
            // console.log(this.follow);
          }
      }, err => {
        console.log(err);
      });
  }

  unfollow(id) {
      this.followService.unfollow(id).subscribe(res => {
        if (res.ok) {
            this.reset();
            this.loadFollowed();
        }
      }, err => {
        console.log(err);
      });
  }

}
