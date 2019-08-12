import { Component, OnInit } from '@angular/core';
import {MarketplaceService} from '../../../services/marketplace.service';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-sell-market',
  templateUrl: './sell-market.component.html',
  styleUrls: ['./sell-market.component.css']
})
export class SellMarketComponent implements OnInit {
  public marketList;
  public page;
  public auth;
  private readonly limitPerPage;
  private loader;
  private showMore;
  constructor(private marketService: MarketplaceService,
              private userService: UserService) {
    this.auth = userService.getUser();
    this.marketList = [];
    this.page = 0;
    this.loader = false;
    this.showMore = true;
    this.limitPerPage = 9;
  }

  ngOnInit() {
    this.loadSellerMarkets();
  }

  loadSellerMarkets() {
    this.page ++;
    this.loader = true;
    this.marketService.getAllMarkets(this.page, 20, this.auth.id, null, null).subscribe(res =>{
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
    }, err =>{
      console.log(err);
    });
  }

}
