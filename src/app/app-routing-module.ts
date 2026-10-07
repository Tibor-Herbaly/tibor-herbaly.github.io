import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './components/home.component/home.component';
import {
  RegistrationFormComponent
} from './components/registerInOutDelete/registration-form.component/registration-form.component';
import {LoginFormComponent} from './components/registerInOutDelete/login-form.component/login-form.component';
import {DrivingLicenceComponent} from './components/driving-licence.component/driving-licence.component';
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

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  //Be/logout, register, delete user
  { path: 'register', component: RegistrationFormComponent },
  { path: 'login', component: LoginFormComponent },
  { path: 'driving-licence', component: DrivingLicenceComponent },
  { path: 'armory-video', component: ArmoryVideoComponent },
  // Games
  { path: 'game1', component: NumberTippGameComponent},
  { path: 'dice-tipp2', component: DiceTippComponent },
  { path: 'big-throw', component: BigThrowComponent },
  { path: 'memory-game', component: MemoryGameComponent },
  { path: 'donation', component: DonationComponent},
  { path: 'american-music', component: VideosComponent},
  { path: 'music', component: MusicComponent },
  { path: 'ford-promotion', component: FordPromotionComponent},
  { path: 'contact', component: ContactComponent },
  { path: 'page', component: PageRatingComponent},
  { path: 'images', component: PicturesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
