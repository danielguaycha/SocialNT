import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Publication} from '../../../models/publication';
import {PublicationService} from '../../../services/publication.service';
import {UserService} from '../../../services/user.service';
import {Config} from '../../../services/config';

@Component({
  selector: 'app-form-publication',
  templateUrl: './form-publication.component.html',
  styleUrls: ['./form-publication.component.css'],
  providers: [PublicationService]
})
export class FormPublicationComponent implements OnInit {
  public auth;
  public publication: Publication;
  public imgUrl: any;
  public imgFile;
  public avatar;

  @Output() publicationEmitter = new EventEmitter();

  constructor(private publicationService: PublicationService,
              private userService: UserService) {
    this.auth = this.userService.getUser();
    this.publication = new Publication('', '', null);
    this.avatar = Config.avatar;
  }

  ngOnInit() {
  }

  previewImage(event) {
    if (event.target.files.length === 0) {
      return;
    }
    this.imgFile = event.target.files[0];
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = ($event) => {
      this.imgUrl = reader.result;
    };
  }

  addPublication(publicationForm: NgForm) {
    const formData = new FormData();
    formData.append('image', this.imgFile);
    formData.append('text', this.publication.text);

    this.publicationService.store(formData).subscribe(res => {
      if (res.ok) {
        this.imgFile = null;
        this.imgUrl = null;
        this.publication = new Publication('', '', null);
        // console.log(res);
        const newPublication = res.data;
        newPublication.user = {
          name: this.auth.name,
          lastname: this.auth.lastname,
          avatar: this.auth.avatar
        };
        this.publicationEvent(newPublication);
        // emit publication
      }
      // console.log(res);
    }, err => {
      console.log(err);
    });
  }
  publicationEvent(newPublication) {
    this.publicationEmitter.emit(newPublication);
  }
}
