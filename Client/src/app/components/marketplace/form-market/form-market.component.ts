import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MarketplaceService} from '../../../services/marketplace.service';
import {NgForm} from '@angular/forms';
import {UserService} from '../../../services/user.service';
import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-form-market',
  templateUrl: './form-market.component.html',
  styleUrls: ['./form-market.component.css'],
  providers: [MarketplaceService]
})
export class FormMarketComponent implements OnInit {

  @Output() addMarket = new EventEmitter();

  private categories;
  private market;
  private imgFile;
  private previewImgUrl;
  private auth;
  constructor(private marketService: MarketplaceService,
              private userService: UserService,
              private alertService: AlertService) {
    this.auth = userService.getUser();
    this.market = {
      title: 'Hola',
      description: 'Desc',
      category_id: 2,
      price: 12.2,
      image: null,
      dir: 'Machala, El Oro'
    };
  }
  ngOnInit() {
    this.allCategories();
  }

  allCategories() {
    this.marketService.getCategories().subscribe(res => {
      console.log(res);
      if (res.ok) {
        this.categories = res.data;
      }
    }, err => {
      console.log('categories', err);
    });
  }

  addMarketPublication(marketForm: NgForm) {
      const formData = new FormData();
      formData.append('image', this.imgFile);
      formData.append('title', this.market.title);
      formData.append('description', this.market.description);
      formData.append('category_id', this.market.category_id);
      formData.append('price', this.market.price);
      formData.append('user_id', this.auth.id);
      formData.append('dir', this.market.dir);

      this.marketService.addMarket(formData).subscribe(res => {
        console.log(res);
        if (res.ok) {
          marketForm.reset();
          this.imgFile = null;
          this.previewImgUrl = null;
          this.addMarket.emit(res.data);
          this.alertService.success('Se publicó tu producto con exito, revisa tus ventas o la sección explorar');
        }
      }, err => {
        console.log(err);
      });
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
      this.previewImgUrl = reader.result;
    };
  }
}
