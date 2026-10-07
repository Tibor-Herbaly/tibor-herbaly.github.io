import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {

  footerVisible = true;

  hideFooter() {
    this.footerVisible = false;
  }

  showFooter() {
    this.footerVisible = true;
  }
  public currentYear: number = new Date().getFullYear();

}
