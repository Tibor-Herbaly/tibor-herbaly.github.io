import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './components/home.component/home.component';
import {ArmoryVideoComponent} from './components/videos/armory-video.component/armory-video.component';
import {NumberTippGameComponent} from './components/games/number-tipp-game.component/number-tipp-game.component';
import {DiceTippComponent} from './components/games/dice-tipp.component/dice-tipp.component';
import {MemoryGameComponent} from './components/games/memory-game.component/memory-game.component';
import {BigThrowComponent} from './components/games/big-throw.component/big-throw.component';
import {DonationComponent} from './components/donation.component/donation.component';
import {VideosComponent} from './components/videos/videos.component/videos.component';
import {FordPromotionComponent} from './components/promotions/ford-promotion.component/ford-promotion.component';
import {ContactComponent} from './components/contact.component/contact.component';
import {PageRatingComponent} from './components/page-rating.component/page-rating.component';
import {MusicComponent} from './components/videos/music.component/music.component';
import {PicturesComponent} from './components/others/pictures.component/pictures.component';
import {RegisterComponent} from './components/register.component/register.component';
import {LoginOutDeleteComponent} from './components/login-out-delete.component/login-out-delete.component';
import {Profile} from './components/profile/profile';
import {SpaceScienceComponent} from './components/space-science.component/space-science.component';
import {NewsComponent} from './components/news.component/news.component';
import {SettingsComponent} from './components/settings.component/settings.component';
import {WeatherDetailsComponent} from './components/weather-details.component/weather-details.component';
import {AdminTibberComponent} from './components/others/admin-tibber.component/admin-tibber.component';
import {AndroidAppComponent} from './components/android-app.component/android-app.component';
import {BlackjackComponent} from './components/games/blackjack.component/blackjack.component';
import {WritingsComponent} from './components/others/writings.component/writings.component';
import {
  HekrilonHerzonalyComponent
} from './components/others/hekrilon-herzonaly.component/hekrilon-herzonaly.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  //Be/logout, register, delete user
  { path: 'register', component: RegisterComponent }, // Ez nincs bekötve a Navbar -ba.
  { path: 'login-out-delete', component: LoginOutDeleteComponent },
  { path: 'android-app', component: AndroidAppComponent },
  { path: 'armory-video', component: ArmoryVideoComponent },
  { path: 'profile', component: Profile },
  { path: 'settings', component: SettingsComponent },
  // Games
  { path: 'game1', component: NumberTippGameComponent},
  { path: 'dice-tipp2', component: DiceTippComponent },
  { path: 'big-throw', component: BigThrowComponent },
  { path: 'memory-game', component: MemoryGameComponent },
  { path: 'blackjack', component: BlackjackComponent },

  { path: 'donation', component: DonationComponent},
  { path: 'american-music', component: VideosComponent},
  { path: 'music', component: MusicComponent },
  { path: 'ford-promotion', component: FordPromotionComponent},
  { path: 'contact', component: ContactComponent },
  { path: 'page-rating', component: PageRatingComponent},
  { path: 'images', component: PicturesComponent },
  { path: 'space-science', component: SpaceScienceComponent },
  // Hírek – kategóriaválasztó és kategóriaoldalak
  { path: 'news/:category', component: NewsComponent },
  { path: 'news', component: NewsComponent },
  { path: 'weather', component: WeatherDetailsComponent },
  { path: 'admin-tibber', component: AdminTibberComponent },
  { path: 'writings', component: WritingsComponent },
  { path: 'hekrilon', component: HekrilonHerzonalyComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
