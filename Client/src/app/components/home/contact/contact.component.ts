import { Component, OnInit } from '@angular/core';
import {FollowService} from '../../../services/follow.service';
import {UserService} from '../../../services/user.service';
import {Config} from '../../../services/config';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  providers: [FollowService]
})
export class ContactComponent implements OnInit {
  private auth;
  private avatarUrl;
  private contactList;
  constructor(private followService: FollowService,
              private userService: UserService) {
      this.auth = userService.getUser();
      this.avatarUrl = Config.avatar;
  }

  ngOnInit() {
    this.loadLastFollow();
  }

  loadLastFollow() {
    this.followService.followeds(this.auth.id, 1, 5).subscribe(res  => {
        if (res.ok) {
          console.log(res);
          this.contactList = res.followed;
        }
    }, err => {
      console.log(err);
    });
  }

}
