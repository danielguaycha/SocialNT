import { Component, OnInit } from '@angular/core';
import {MarketplaceService} from '../../../services/marketplace.service';
import {ActivatedRoute} from '@angular/router';
import {Config} from '../../../services/config';
import {MessageService} from '../../../services/message.service';
import {NgForm} from '@angular/forms';
import {AlertService} from '../../../services/alert.service';
import {UserService} from '../../../services/user.service';
import {NotificationService} from '../../../services/notification.service';

@Component({
  selector: 'app-item-market',
  templateUrl: './item-market.component.html',
  styleUrls: ['./item-market.component.css']
})
export class ItemMarketComponent implements OnInit {

  private readonly itemID;
  private item;
  private readonly imageUrl;
  private textMessage;
  private avatarUrl;
  private auth;

  constructor(private marketService: MarketplaceService,
              private chatService: MessageService,
              private router: ActivatedRoute,
              private alert: AlertService,
              private userService: UserService,
              private notifyService: NotificationService) {
    this.itemID = router.snapshot.paramMap.get('id');
    this.auth = userService.getUser();
    this.imageUrl = Config.market;
    this.avatarUrl = Config.avatar;
    this.textMessage = '¿Sigue estando disponible?';
  }

  ngOnInit() {
    this.getItem();
  }

  getItem() {
    if (!this.itemID) { return; }
    this.marketService.getItem(this.itemID).subscribe(res => {
      console.log(res);
      if (res.ok) {
        console.log(res.data);
        this.item = res.data;
      }
    }, err => {
      console.log(err);
    });
  }

  sendMessage(messageForm: NgForm) {
    if (!this.item || !this.textMessage) { return; }
    const message = `<a href="/marketplace/item/${this.item.id}" class="card px-3 py-2 rounded-pill m-1">
          <img src="${this.imageUrl}${this.item.image}" width="45px" class="d-block m-auto"/>
          <p>${this.item.title},  <b>${this.item.price}</b></p>
        </a><small class="d-block">${this.textMessage}</small>
    `;
    this.chatService.sendMessage(this.item.user, message).subscribe(res => {
     if (res.ok) {
        this.textMessage = '';
        this.marketService.shopItem(this.item.id).subscribe();
        this.notifyService.notifyMarketPlace(this.item.id).subscribe();
        this.alert.success('Se ha enviado un mensaje al vendedor, revisa tu bandeja');
        messageForm.resetForm();
     }
    }, err => {
      console.log(err);
    });
  }
}
