import { Component, OnInit } from '@angular/core';
import {Config} from '../../services/config';
import {UserService} from '../../services/user.service';
import {FollowService} from '../../services/follow.service';
import {ActivatedRoute} from '@angular/router';
import {PublicationService} from '../../services/publication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ FollowService, PublicationService ]
})
export class ProfileComponent implements OnInit {

  public avatarUrl;
  public imgPublic;
  public auth;
  public userId;
  public followData;

  public followedList;
  public followersList;

  public publicationList;
  public showMore;
  public page;
  public user;

  public followMessage;

  constructor(private userService: UserService,
              private publicationService: PublicationService,
              private followService: FollowService,
              private router: ActivatedRoute) {

    this.avatarUrl = Config.avatar;
    this.imgPublic = Config.publication;
    this.auth = userService.getUser();
    this.followData = {
      followers: 0,
      followed: 0
    };
    this.followedList = [];
    this.followersList = [];
    this.publicationList = [];
    this.showMore = true;
    this.page = 0;
    this.user = [];
    this.followMessage = 'Siguiendo';

    this.router.params.subscribe(routeParams => {
        this.userId = routeParams.id;
        this.loadAll();
    });
  }

  ngOnInit() {
  }

  loadAll() {
    this.publicationList = [];
    this.page = 0;
    this.loadUser();
    this.getStats();
    this.getFollowed();
    this.getFollowers();
    this.loadPublications();
  }

  loadUser() {
    this.userService.findById(this.userId).subscribe(res => {
      if (res.ok) {
        this.user = res.user;
      }
    }, err => {
      console.log(err);
    });
  }

  loadPublications() {
    this.page ++;
    this.publicationService.listById(this.userId, this.page).subscribe(res => {

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < res.data.length; i++) {
        this.publicationList.push(res.data[i]);
        // console.log(res.data[i])
      }

      if (res.data.length < 7) {
        this.showMore = false;
      }
    }, err => {
        console.log(err);
    });
  }

  getStats() {
    this.userService.getStats(this.userId).subscribe(res => {
      // console.log(res);
      if (res.ok) {
        this.followData.followers = res.followers.count;
        this.followData.followed = res.followed.count;
      }
    }, err => {
      console.log(err);
    });
  }

  getFollowed() {
    this.followService.followeds(this.userId, 1, 6).subscribe(res => {
      if (res.ok) {
        this.followedList = res.followed;
      }
      // console.log(res);
    }, err => {
      console.log(err);
    });
  }

  getFollowers() {
    this.followService.followers(this.userId, 1, 6).subscribe(res => {
      if (res.ok) {
        this.followersList = res.followed;
      }
      // console.log(res);
    }, err => {
      console.log(err);
    });
  }

  removePublication(id) {
    for (let i = 0; i < this.publicationList.length ; i++) {
      if (this.publicationList[i].id === id ) {
        this.publicationList.splice(i, 1);
      }
    }
  }

  addPublication(publication) {
    this.publicationList.unshift(publication);
  }

  follow() {
    if (this.user.id === this.auth.id ) { return; }
    this.followService.follow(this.user.id).subscribe(res => {
      if (res.ok) {
          this.user.isFollow = true;
      }
    }, err => {
      console.log(err);
    });
  }

  unFollow() {
    if (this.user.id === this.auth.id ) { return; }

    this.followService.unfollow(this.user.id).subscribe(res => {
      if (res.ok) {
        this.user.isFollow = false;
      }
    }, err => {
      console.log(err);
    });
  }
}
