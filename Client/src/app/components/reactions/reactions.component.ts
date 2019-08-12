import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ReactionsService} from '../../services/reactions.service';
import {CommentComponent} from '../comment/comment.component';
import {ViewReactionsComponent} from './view-reactions/view-reactions.component';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.css']
})
export class ReactionsComponent implements OnInit, OnChanges {

  @Input() pubId !: any;
  @Input() type !: string;
  @Input() showComments: boolean;

  @ViewChild(CommentComponent, { static: true }) commentComponent: CommentComponent;
  @ViewChild(ViewReactionsComponent, { static: true }) viewReactionComponent: ViewReactionsComponent;
  public reactions;
  public id;
  constructor(private reactionService: ReactionsService) {
    this.type = 'pub';
    this.reactions = 0;
    this.id = this.pubId;
  }

  ngOnInit() {
    this.loadReactions();
  }

  loadReactions() {
    this.reactionService.getReactions(this.pubId, this.type).subscribe(res => {
      // console.log(res);
      if (res.ok) {
        this.reactions = res.total;
      }
    },  err => {});
  }

  addReaction() {
    let request = null;
    if (this.type === 'pub') {
      request = this.reactionService.addReaction(this.pubId, null);
    } else {
      request = this.reactionService.addReaction(null, this.pubId);
    }
    request.subscribe(res => {
      console.log(res);
      if (res.ok) {
        this.loadReactions();
      }
    }, err => {
      console.log(err);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  loadComments() {
    this.commentComponent.loadAll();
  }

  loadReactionsChild() {
    this.viewReactionComponent.getUsersReactions();
  }

}
