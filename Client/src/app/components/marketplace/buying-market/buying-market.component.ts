import { Component, OnInit } from '@angular/core';
import {MarketplaceService} from '../../../services/marketplace.service';

@Component({
  selector: 'app-buying-market',
  templateUrl: './buying-market.component.html',
  styleUrls: ['./buying-market.component.css']
})
export class BuyingMarketComponent implements OnInit {

  private marketList;
  private page;
  private readonly limitPerPage;
  private loader;
  private showMore;
  constructor(private marketService: MarketplaceService) {
    this.page = 0;
    this.marketList = [];
    this.limitPerPage = 9;
    this.loader = false;
    this.showMore = true;
  }

  ngOnInit() {
    this.loadItemsSaved();
  }

  loadItemsSaved() {
    this.page ++;
    this.loader = true;
    this.marketService.getItems('shop', this.page, this.limitPerPage).subscribe(res => {
      if (res.ok) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < res.data.length; i++) {
          this.marketList.push(res.data[i]);
        }
        if (res.data.length < this.limitPerPage) {
          this.showMore = false;
        }
        this.loader = false;
      }
      // console.log(res);
    }, err => {
      console.log(err);
    });
  }

}
