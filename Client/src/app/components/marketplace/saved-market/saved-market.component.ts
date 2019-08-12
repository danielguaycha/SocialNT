import { Component, OnInit } from '@angular/core';
import {MarketplaceService} from '../../../services/marketplace.service';

@Component({
  selector: 'app-saved-market',
  templateUrl: './saved-market.component.html',
  styleUrls: ['./saved-market.component.css']
})
export class SavedMarketComponent implements OnInit {

  private marketList;
  private page;
  private readonly limitPerPage;
  private loader;
  private showMore;
  constructor(private marketService: MarketplaceService) {
    this.marketList = [];
    this.page = 0;
    this.loader = false;
    this.limitPerPage = 9;
    this.showMore = true;
  }

  ngOnInit() {
    this.loadSavedMarkets();
  }

  loadSavedMarkets() {
    this.page ++;
    this.loader = true;
    this.marketService.getItems('save', this.page, 20).subscribe(res => {
      console.log(res);
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
    }, err => {
      console.log(err);
    });
  }

}
