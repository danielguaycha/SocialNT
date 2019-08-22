import { Component, OnInit } from '@angular/core';
import {MarketplaceService} from '../../services/marketplace.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css'],
  providers: [MarketplaceService]
})
export class MarketplaceComponent implements OnInit {
  private page;
  private marketList;
  private readonly limitPerPage;
  private showMore;
  private loader;
  private querySearch;
  private notResults;
  constructor(private marketService: MarketplaceService) {
    this.limitPerPage = 9;
    this.init();
  }

  init() {
    this.page = 0;
    this.marketList = [];
    this.showMore = true;
    this.loader = false;
  }

  ngOnInit() {
    this.getAllMarkets();
  }

  getAllMarkets() {
    this.page ++;
    this.loader = true;
    this.querySearch = null;
    this.marketService.getAllMarkets(this.page, this.limitPerPage).subscribe(res => {
      // console.log(res);
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
      console.log('marketplace', err);
    });
  }

  search(category) {

    if (!this.querySearch && !category.category) {
      this.init();
      this.getAllMarkets();
      return;
    }


    this.init();
    this.loader = true;
    let request;
    if (category.category && !this.querySearch) {
      request =  this.marketService.getAllMarkets(this.page, this.limitPerPage, null, category.category, null);
    } else {
      request =  this.marketService.getAllMarkets(this.page, this.limitPerPage, null, null, this.querySearch);
    }

    request.subscribe(res => {
      // console.log(res);
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
      console.log('marketplace', err);
    });
  }
}
