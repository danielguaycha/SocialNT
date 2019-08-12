import {Component, Input, OnInit} from '@angular/core';
import {ReactionsService} from '../../../services/reactions.service';
import {Config} from '../../../services/config';
import * as $ from 'jquery';
@Component({
  selector: 'app-view-reactions',
  templateUrl: './view-reactions.component.html',
  styleUrls: ['./view-reactions.component.css']
})
export class ViewReactionsComponent implements OnInit {

  @Input() pubId;
  @Input() type !: any;
  private page;
  private users;
  private avatarUrl;
  private hideMore;
  private id;
  constructor(private reactionsService: ReactionsService) {
    this.type = 'pub';
    this.page = 1;
    this.avatarUrl = Config.avatar;
    this.hideMore = false;
    this.id = this.pubId;
  }

  ngOnInit() {
    // this.getUsersReactions();
  }

  getUsersReactions() {
    this.reactionsService.viewUserReactions(this.pubId, this.type, this.page).subscribe(
      res => {
        // console.log('view-reactions', res);
        if (res.ok) {
          this.users = res.users;
        }
      }, err => {
        console.log('view-reactions', err);
    });
  }

  viewMore() {
    this.page++;
    this.reactionsService.viewUserReactions(this.pubId, this.type, this.page).subscribe(
      res => {
        console.log('view-reactions', res);
        if (res.ok) {
          if (res.users.length > 0) {
            for (const u of res.users) {
              this.users.push(u);
            }
            if (res.users.length < 5 ) {
              this.hideMore = true;
            }
          } else {
            this.hideMore = true;
          }
        }
      }, err => {
        console.log('view-reactions', err);
      });
  }

  viewProfile() {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    $('body, html').animate({ scrollTop: 0}, 500);
  }
}
