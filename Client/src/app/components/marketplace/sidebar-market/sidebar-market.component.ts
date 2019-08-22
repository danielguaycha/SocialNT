import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MarketplaceService} from '../../../services/marketplace.service';

@Component({
  selector: 'app-sidebar-market',
  templateUrl: './sidebar-market.component.html',
  styleUrls: ['./sidebar-market.component.css']
})
export class SidebarMarketComponent implements OnInit {

  @Output() viewCategory = new EventEmitter();

  private categories;
  constructor(private marketPlaceService: MarketplaceService) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.marketPlaceService.getCategories().subscribe(res => {
      if (res.ok) {
        this.categories = res.data;
        console.log(res.data);
      }
    }, error => console.log(error));
  }

  searchCategory(category) {
    this.viewCategory.emit({category});
  }
}
