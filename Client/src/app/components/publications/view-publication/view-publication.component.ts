import { Component, OnInit } from '@angular/core';
import {Config} from '../../../services/config';
import {ActivatedRoute} from '@angular/router';
import {PublicationService} from '../../../services/publication.service';

@Component({
  selector: 'app-view-publication',
  templateUrl: './view-publication.component.html',
  styleUrls: ['./view-publication.component.css'],
  providers: [PublicationService]
})
export class ViewPublicationComponent implements OnInit {
  public pubId;
  public publication;
  constructor(private router: ActivatedRoute,
              private publicationService: PublicationService) {
    this.pubId = router.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.loadPublication();
  }

  loadPublication(){
    this.publicationService.view(this.pubId).subscribe(res =>{
      if (res.ok) {
        this.publication = res.data;
      }
      console.log(res);
    }, err => console.log(err));
  }
}
