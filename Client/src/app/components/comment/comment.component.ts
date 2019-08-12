import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Config} from '../../services/config';
import {CommentService} from '../../services/comment.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() pubId !: any;
  @Input() type !: any;
  @Input() showed !: boolean;

  private auth;
  private avatarUrl;
  private textMessage;
  private page;
  private readonly limitPerPage;
  private commentsList;
  private showComments;
  private showMore;

  constructor(private userService: UserService, private commentService: CommentService) {
    this.auth = userService.getUser();
    this.avatarUrl = Config.avatar;
    this.limitPerPage = 7;
    this.reset();
  }

  ngOnInit() {
    if (this.showed) {
      this.loadAll();
    }
  }

  reset() {
    this.showComments = false;
    this.page = 0;
    this.commentsList = [];
    this.showMore = true;
  }

  loadAll() {
    if (this.showComments) {
      this.reset();
      return;
    }
    this.showComments = true;
    this.getComments();
  }

  // crear nuevo comentario
  addComment(commentForm: NgForm) {
    if (!this.textMessage) { return; }
    if (this.textMessage.trim().length > 200) {
      this.textMessage = this.textMessage.substring(0, 200);
    }
    let request;
    if (this.type === 'pub') {
      request = this.commentService.addComment(this.pubId, null, this.textMessage);
    } else {
      request = this.commentService.addComment(null, this.pubId, this.textMessage);
    }
    request.subscribe(res => {
      console.log(res);
      if (res.ok) {
        const objComment = res.comment;
        objComment.commentor = {
          id: this.auth.id,
          username: this.auth.username,
          name: this.auth.name,
          lastname: this.auth.lastname,
          avatar: this.auth.avatar
        };
        this.commentsList.unshift(objComment);
      }
      commentForm.reset();
    }, err => {
      console.log(err);
    });
  }

  // get comments
  getComments() {
      this.page++;
      this.commentService.getComments(this.pubId, this.type, this.page, this.limitPerPage).subscribe(res => {
          console.log(res);
          if (res.ok && res.comments) {
            for (const c of res.comments) {
              this.commentsList.push(c);
            }
            if (res.comments.length < this.limitPerPage) {
              this.showMore = false;
            }
          }
      }, err => {
          console.log(err);
      });
  }

  deleteComment(id) {
    if (!confirm('Estás seguro de eliminar este mensaje?')) {
      return;
    }
    this.commentService.deleteComment(id).subscribe(res => {
      console.log(res);
      if (res.ok) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.commentsList.length; i++) {
            if (this.commentsList[i].id === res.id) {
                this.commentsList.splice(i, 1);
            }
        }
      }
    }, err => {
      console.log(err);
    });
  }
}
