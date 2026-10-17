import { Component } from '@angular/core';

@Component({
  selector: 'app-android-app',
  standalone: false,
  templateUrl: './adroid-app.component.html',
  styleUrl: './android-app.component.css'
})
export class AndroidAppComponent {
  readonly cards = [
    'Android app kártya1',
    'Android app kártya2',
    'Android app kártya3',
    'Android app kártya4'
  ];
}