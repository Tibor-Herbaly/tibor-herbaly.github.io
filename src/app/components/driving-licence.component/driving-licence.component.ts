import { Component } from '@angular/core';

@Component({
  selector: 'app-driving-licence.component',
  standalone: false,
  templateUrl: './driving-licence.component.html',
  styleUrl: './driving-licence.component.css'
})
export class DrivingLicenceComponent {
  zoom = 14;
  center: google.maps.LatLngLiteral = { lat: 47.46168, lng: 19.04165}; // Tigris-t Autósiskola

}
