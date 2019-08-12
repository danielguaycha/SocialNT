import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './helpers/auth.guard';
import { UsersearchComponent } from './components/search/usersearch/usersearch.component';
import { FollowedsComponent } from './components/follow/followeds/followeds.component';
import { FollowersComponent } from './components/follow/followers/followers.component';
import { ProfileConfigComponent } from './components/profile/profile-config/profile-config.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import {ChatComponent} from './components/chat/chat.component';
import {ProfileComponent} from './components/profile/profile.component';
import {FormMarketComponent} from './components/marketplace/form-market/form-market.component';
import {MarketplaceComponent} from './components/marketplace/marketplace.component';
import {ItemMarketComponent} from './components/marketplace/item-market/item-market.component';
import {BuyingMarketComponent} from './components/marketplace/buying-market/buying-market.component';
import {SellMarketComponent} from './components/marketplace/sell-market/sell-market.component';
import {SavedMarketComponent} from './components/marketplace/saved-market/saved-market.component';
import {NotificationComponent} from './components/notification/notification.component';
import {ViewPublicationComponent} from './components/publications/view-publication/view-publication.component';




const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent},
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
    { path: 'chat/:id', component: ChatComponent, canActivate: [AuthGuard]},
    { path: 'chat', component: ChatComponent, canActivate: [AuthGuard]},
    { path: 'search/u/:data', component: UsersearchComponent, canActivate: [AuthGuard]},
    { path: 'followeds', component: FollowedsComponent, canActivate: [AuthGuard] },
    { path: 'followeds/:id', component: FollowedsComponent, canActivate: [AuthGuard] },
    { path: 'followers', component: FollowersComponent, canActivate: [AuthGuard] },
    { path: 'followers/:id', component: FollowersComponent, canActivate: [AuthGuard] },
    { path: 'u/:id', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'profile/config', component: ProfileConfigComponent, canActivate: [AuthGuard] },
    // publication
    { path: 'publication/:id', component: ViewPublicationComponent, canActivate: [AuthGuard] },
    // marketplace
    { path: 'marketplace/all', component: MarketplaceComponent, canActivate: [AuthGuard] },
    { path: 'marketplace/sell', component: FormMarketComponent, canActivate: [AuthGuard] },
    { path: 'marketplace/buying', component: BuyingMarketComponent, canActivate: [AuthGuard] },
    { path: 'marketplace/selling', component: SellMarketComponent, canActivate: [AuthGuard] },
    { path: 'marketplace/saved', component: SavedMarketComponent, canActivate: [AuthGuard] },
    { path: 'marketplace/item/:id', component: ItemMarketComponent, canActivate: [AuthGuard] },
    // notification
    { path: 'notify', component: NotificationComponent, canActivate: [AuthGuard] },
    { path: 'confirm/:id/:token', component: ConfirmComponent},
    { path: '**', redirectTo: 'home' },
   // { path: '**', component: PageNotFoundComponent },

    // { path: 'path/:routeParam', component: MyComponent },
    // { path: 'staticPath', component: ... },
    // { path: '**', component: ... },
    // { path: 'oldPath', redirectTo: '/staticPath' },
    // { path: ..., component: ..., data: { message: 'Custom' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class FeatureRoutingModule {}
