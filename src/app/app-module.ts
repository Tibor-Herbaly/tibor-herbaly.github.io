import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { Navbar } from './components/navbar/navbar';
import { RegistrationFormComponent } from './components/registerInOutDelete/registration-form.component/registration-form.component';
import { LoginFormComponent } from './components/registerInOutDelete/login-form.component/login-form.component';
import { LogoutFormComponent } from './components/registerInOutDelete/logout-form.component/logout-form.component';
import { DeleteFormComponent } from './components/registerInOutDelete/delete-form.component/delete-form.component';
import { DrivingLicenceComponent } from './components/driving-licence.component/driving-licence.component';
import { BigThrowComponent } from './components/games/big-throw.component/big-throw.component';
import { DiceTippComponent } from './components/games/dice-tipp.component/dice-tipp.component';
import { MemoryGameComponent } from './components/games/memory-game.component/memory-game.component';
import { NumberTippGameComponent } from './components/games/number-tipp-game.component/number-tipp-game.component';
import { WritingsComponent } from './components/others/writings.component/writings.component';
import { PicturesComponent } from './components/others/pictures.component/pictures.component';
import { GiftComponent } from './components/others/gift.component/gift.component';
import { VideosComponent } from './components/videos/videos.component/videos.component';
import { ArmoryVideoComponent } from './components/videos/armory-video.component/armory-video.component';
import { HomeComponent } from './components/home.component/home.component';
import {GoogleMapsModule} from '@angular/google-maps';
import { DonationComponent } from './components/donation.component/donation.component';
import { Footer } from './components/footer/footer';
import { FordPromotionComponent } from './components/promotions/ford-promotion.component/ford-promotion.component';
import { ContactComponent } from './components/contact.component/contact.component';
import { PageRatingComponent } from './components/page-rating.component/page-rating.component';
import { MusicComponent } from './components/videos/music.component/music.component';

@NgModule({
  declarations: [
    App,
    Navbar,
    RegistrationFormComponent,
    LoginFormComponent,
    LogoutFormComponent,
    DeleteFormComponent,
    DrivingLicenceComponent,
    BigThrowComponent,
    DiceTippComponent,
    MemoryGameComponent,
    NumberTippGameComponent,
    WritingsComponent,
    PicturesComponent,
    GiftComponent,
    VideosComponent,
    ArmoryVideoComponent,
    HomeComponent,
    DonationComponent,
    Footer,
    FordPromotionComponent,
    ContactComponent,
    PageRatingComponent,
    MusicComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    GoogleMapsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [App]
})
export class AppModule { }
