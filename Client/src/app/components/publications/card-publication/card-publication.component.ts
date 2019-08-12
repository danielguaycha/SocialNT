import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Config} from '../../../services/config';
import {UserService} from '../../../services/user.service';
import {PublicationService} from '../../../services/publication.service';

@Component({
  selector: 'app-card-publication',
  templateUrl: './card-publication.component.html',
  styleUrls: ['./card-publication.component.css'],
  providers: [PublicationService]
})
export class CardPublicationComponent implements OnInit {

  @Input() publication;
  @Output() deletedPublication = new EventEmitter();

  public avatar;
  public auth;
  public imgPublic;
  constructor(private userService: UserService,
              private publicationService: PublicationService) {
    this.avatar = Config.avatar;
    this.auth = userService.getUser();
    this.imgPublic = Config.publication;
  }

  ngOnInit() {
  }

  removePublication(id) {
    if (confirm('Estas seguro que deseas eliminar esta publicación')) {
      this.publicationService.destroy(id).subscribe(res => {
        console.log(res);
        if (res.ok) {
          this.deletedPublication.emit({ id });
        }
      }, err => {
        console.log(err);
      });
    }
  }

}
