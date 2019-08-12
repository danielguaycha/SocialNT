import { Component, OnInit } from '@angular/core';
import {FormBuilder, NgForm} from '@angular/forms';
import { PublicationService } from 'src/app/services/publication.service';
import {SocketService} from '../../services/socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [PublicationService]
})
export class HomeComponent implements OnInit {

  constructor(private socketService: SocketService) {
  }

  ngOnInit() {

  }





}
