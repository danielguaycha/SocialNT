import {Component, Input, OnInit} from '@angular/core';
import {Config} from '../../../services/config';
import * as $ from 'jquery';
import {MarketplaceService} from '../../../services/marketplace.service';
import {AlertService} from '../../../services/alert.service';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-card-market',
  templateUrl: './card-market.component.html',
  styleUrls: ['./card-market.component.css']
})
export class CardMarketComponent implements OnInit {

  @Input() marketList!: any;
  @Input() type!: any;
  private imageUrl;
  private auth;
  constructor(private marketService: MarketplaceService,
              private alert: AlertService,
              private userService: UserService) {
    this.imageUrl = Config.market;
    this.auth = userService.getUser();
  }

  ngOnInit() {

  }

  saveItem(itemId) {
    this.marketService.saveItem(itemId).subscribe(res => {
      console.log(res);
      if (res.ok) {
        this.alert.success('Producto guardado con exito');
      }
    }, err => {
      console.log(err);
    });
  }

  addDiv($event) {
      $($event.target).find('div').addClass('active');
  }

  removeDiv($event) {
    $($event.target).find('div').removeClass('active');
  }

  removeItem(itemId) {

    if (!this.type) { return; }
    if (!confirm('¿ Estás seguro que deseas eliminar este item ?')) { return; }
    let removed;
    if(this.type.toLowerCase() === 'market'){
        removed = this.marketService.deleteMarket(itemId);
    }

    if ( this.type.toLowerCase() === 'marketsave') {
        removed = this.marketService.deleteMarketSave(itemId);
    }

    if (removed) {
      removed.subscribe(res => {
        if (res.ok) {
          this.removeInMarketList(itemId);
          this.alert.success('Eliminado con éxito');
        }
      }, err => {
        console.log(err);
      });
    }
  }

  removeInMarketList(itemId){
    for (let i = 0; i < this.marketList.length ; i++) {
      if(this.type === 'market'){
        if (this.marketList[i].id === itemId ) {
          this.marketList.splice(i, 1);
          break;
        }
      } else {
        if (this.marketList[i].market_save === itemId ) {
          this.marketList.splice(i, 1);
          break;
        }
      }
    }
  }
}
