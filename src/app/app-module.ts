import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { Navbar } from './components/navbar/navbar';

import { BigThrowComponent } from './components/games/big-throw.component/big-throw.component';
import { DiceTippComponent } from './components/games/dice-tipp.component/dice-tipp.component';
import { MemoryGameComponent } from './components/games/memory-game.component/memory-game.component';
import { NumberTippGameComponent } from './components/games/number-tipp-game.component/number-tipp-game.component';
import { WritingsComponent } from './components/others/writings.component/writings.component';
import { PicturesComponent } from './components/others/pictures.component/pictures.component';
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
import { LoginOutDeleteComponent } from './components/login-out-delete.component/login-out-delete.component';
import { RegisterComponent } from './components/register.component/register.component';
import { Profile } from './components/profile/profile';
import { SpaceScienceComponent } from './components/space-science.component/space-science.component';
import { NewsComponent } from './components/news.component/news.component';
import { WeatherDetailsComponent } from './components/weather-details.component/weather-details.component';
import { SettingsComponent } from './components/settings.component/settings.component';
import { AdminTibberComponent } from './components/others/admin-tibber.component/admin-tibber.component';
import { AndroidAppComponent } from './components/android-app.component/android-app.component';
import { BlackjackComponent } from './components/games/blackjack.component/blackjack.component';
import { HekrilonHerzonalyComponent } from './components/others/hekrilon-herzonaly.component/hekrilon-herzonaly.component';


@NgModule({
  declarations: [
    App,
    Navbar,
    WeatherDetailsComponent,
    SettingsComponent,
    BigThrowComponent,
    DiceTippComponent,
    MemoryGameComponent,
    NumberTippGameComponent,
    WritingsComponent,
    PicturesComponent,
    VideosComponent,
    ArmoryVideoComponent,
    HomeComponent,
    DonationComponent,
    Footer,
    FordPromotionComponent,
    ContactComponent,
    PageRatingComponent,
    MusicComponent,
    LoginOutDeleteComponent,
    RegisterComponent,
    Profile,
    AdminTibberComponent,
    AndroidAppComponent,
    BlackjackComponent,
    HekrilonHerzonalyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    GoogleMapsModule,
    SpaceScienceComponent,
    NewsComponent
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [App]
})
export class AppModule { }
