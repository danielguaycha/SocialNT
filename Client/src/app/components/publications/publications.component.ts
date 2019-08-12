import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Publication} from '../../models/publication';
import {PublicationService} from '../../services/publication.service';
import {UserService} from '../../services/user.service';
import {Config} from '../../services/config';
import * as $ from 'jquery';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css']
})
export class PublicationsComponent implements OnInit {

  public auth;
  public publication: Publication;
  public publicationList;
  public avatar;
  public imgPublic;
  public page;
  public showMore;


  constructor( private publicationService: PublicationService,
               private userService: UserService) {
    this.auth = this.userService.getUser();
    this.publication = new Publication('', '', null);
    this.avatar = Config.avatar;
    this.imgPublic = Config.publication;
    this.page = 0;
    this.publicationList = [];
    this.showMore = true;
  }

  ngOnInit() {
    this.loadPublications();
  }

  processPublication(publication) {
    this.publicationList.unshift(publication);
  }

  loadPublications(clicked = false) {
    this.page ++;
    this.publicationService.list(this.page).subscribe(res => {
      if (res.ok) {
        // this.publicationList = res.data;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < res.data.length; i++) {
          this.publicationList.push(res.data[i]);
          // console.log(res.data[i])
        }

        if (res.data.length < 7) {
          this.showMore = false;
        }
        if (clicked) {
          $('body, html').animate({ scrollTop: $('body').prop('scrollHeight')}, 500);
        }
        // console.log(this.publicationList);
      }
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

}
