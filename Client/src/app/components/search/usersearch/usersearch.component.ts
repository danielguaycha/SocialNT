import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FollowService } from 'src/app/services/follow.service';
import {Config} from '../../../services/config';

@Component({
  selector: 'app-usersearch',
  templateUrl: './usersearch.component.html',
  styleUrls: ['./usersearch.component.css'],
  providers: [FollowService]
})
export class UsersearchComponent implements OnInit {

  users: any;
  public auth;
  public avatarUrl;
  constructor(private route: ActivatedRoute,
              private userService: UserService, private followService: FollowService) {
    this.avatarUrl = Config.avatar;
  }

  ngOnInit() {
    this.auth = this.userService.getUser();
    this.route.queryParams.subscribe(queryParams => {
      // do something with the query params
    });
    this.route.params.subscribe(routeParams => {
        this.searchUsers(routeParams.data);
      // this.loadUserDetail(routeParams.id);
    });
  }

  searchUsers(data) {
    if (!data) {
      return;
    }
    this.userService.search(data).subscribe(res => {
      if (res.ok) {
          this.users = res.users;
          console.log(this.users);
      }
      // console.log(res);
    }, err => {
      console.log(err);
    });
  }

  follow(id) {
      this.followService.follow(id).subscribe(res => {
        if (res.ok) {
          this.searchUsers(this.route.snapshot.paramMap.get('data'));
        }
      }, err => {
        console.log(err);
      });
  }

  unfollow(id) {
      this.followService.unfollow(id).subscribe(res => {
        if (res.ok) {
          this.searchUsers(this.route.snapshot.paramMap.get('data'));
        }
      }, err => {
        console.log(err);
      });
  }
}
