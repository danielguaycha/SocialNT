import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';

import 'moment/locale/es';

// rutas
import { FeatureRoutingModule } from './app.routes';

// componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './helpers/auth.guard';
import { UserService } from './services/user.service';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/err.interceptor';
import { AlertComponent } from './components/_partials/alert.component';
import { SpinerComponent } from './components/_partials/spiner.component';
import { SidebarComponent } from './components/home/sidebar/sidebar.component';
import { UsersearchComponent } from './components/search/usersearch/usersearch.component';
import { FollowedsComponent } from './components/follow/followeds/followeds.component';
import { FollowersComponent } from './components/follow/followers/followers.component';
import { ProfileConfigComponent } from './components/profile/profile-config/profile-config.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import {SocketService} from './services/socket.service';
import { ChatComponent } from './components/chat/chat.component';
import { MessagesComponent } from './components/chat/messages/messages.component';
import { PublicationsComponent } from './components/publications/publications.component';
import { ReactionsComponent } from './components/reactions/reactions.component';
import { ViewReactionsComponent } from './components/reactions/view-reactions/view-reactions.component';
import { CommentComponent } from './components/comment/comment.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FormPublicationComponent } from './components/publications/form-publication/form-publication.component';
import { CardPublicationComponent } from './components/publications/card-publication/card-publication.component';
import { FormMarketComponent } from './components/marketplace/form-market/form-market.component';
import { CardMarketComponent } from './components/marketplace/card-market/card-market.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';
import { SidebarMarketComponent } from './components/marketplace/sidebar-market/sidebar-market.component';
import { ItemMarketComponent } from './components/marketplace/item-market/item-market.component';
import { BuyingMarketComponent } from './components/marketplace/buying-market/buying-market.component';
import { SellMarketComponent } from './components/marketplace/sell-market/sell-market.component';
import { SavedMarketComponent } from './components/marketplace/saved-market/saved-market.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ViewPublicationComponent } from './components/publications/view-publication/view-publication.component';
import { OnlineComponent } from './components/home/online/online.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    SpinerComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    SidebarComponent,
    UsersearchComponent,
    FollowedsComponent,
    FollowersComponent,
    ProfileConfigComponent,
    ConfirmComponent,
    ChatComponent,
    MessagesComponent,
    PublicationsComponent,
    ReactionsComponent,
    ViewReactionsComponent,
    CommentComponent,
    ProfileComponent,
    FormPublicationComponent,
    CardPublicationComponent,
    FormMarketComponent,
    CardMarketComponent,
    MarketplaceComponent,
    SidebarMarketComponent,
    ItemMarketComponent,
    BuyingMarketComponent,
    SellMarketComponent,
    SavedMarketComponent,
    NotificationComponent,
    ViewPublicationComponent,
    OnlineComponent,
  ],
  imports: [
    BrowserModule,
    FeatureRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthGuard, UserService, SocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
