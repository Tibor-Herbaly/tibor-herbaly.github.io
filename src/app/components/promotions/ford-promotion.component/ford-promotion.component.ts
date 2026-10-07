import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-ford-promotion',
  standalone: false,
  templateUrl: './ford-promotion.component.html',
  styleUrl: './ford-promotion.component.css'
})
export class FordPromotionComponent implements OnInit {
  visible: boolean = true;

  constructor() { }

  ngOnInit(): void {
    this.showForSeconds(5);
  }

  showForSeconds(seconds: number) {
    this.visible = true;
    setTimeout(() => {
      this.visible = false;
    }, seconds * 1000);
  }

}
