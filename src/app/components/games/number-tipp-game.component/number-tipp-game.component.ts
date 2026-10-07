import {AfterViewChecked, Component, ElementRef, ViewChild} from '@angular/core';

interface Uzenet {
  szoveg: string;
  szin: string;
}

@Component({
  selector: 'app-number-tipp-game.component',
  standalone: false,
  templateUrl: './number-tipp-game.component.html',
  styleUrl: './number-tipp-game.component.css'
})
export class NumberTippGameComponent implements AfterViewChecked{

  @ViewChild('chatDiv') chatDiv!: ElementRef;

  celSzam: number = Math.floor(Math.random() * 100) + 1;
  jatekosTipp: number | null = null;
  gepTipp: number | null = null;

  jatekosTippek: number = 0;
  gepTippek: number = 0;

  gepAlso: number = 1;
  gepFelso: number = 100;

  uzenetek: Uzenet[] = [];
  vege: boolean = false;

  constructor() {
    this.uzenetek.push({ szoveg: 'Gondoltam egy számra 1 és 100 között. Ki találja ki előbb: te vagy a számítógép?', szin: 'text-dark' });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.chatDiv) {
      this.chatDiv.nativeElement.scrollTop = this.chatDiv.nativeElement.scrollHeight;
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async tippelj() {
    if (this.vege || this.jatekosTipp === null) return;

    // Játékos tippel
    this.jatekosTippek++;
    if (this.jatekosTipp < this.celSzam) {
      this.uzenetek.push({ szoveg: `Te tippeltél: ${this.jatekosTipp} -> túl alacsony`, szin: 'text-primary' });
      this.gepAlso = Math.max(this.gepAlso, this.jatekosTipp + 1);
    } else if (this.jatekosTipp > this.celSzam) {
      this.uzenetek.push({ szoveg: `Te tippeltél: ${this.jatekosTipp} -> túl magas`, szin: 'text-danger' });
      this.gepFelso = Math.min(this.gepFelso, this.jatekosTipp - 1);
    } else {
      this.uzenetek.push({ szoveg: `Gratulálok! Te nyertél ${this.jatekosTippek} próbálkozással. A szám: ${this.celSzam}`, szin: 'text-success' });
      this.vege = true;
      return;
    }

    await this.delay(500);

    // Számítógép tippel – animált
    if (this.gepAlso > this.gepFelso) {
      this.gepAlso = 1;
      this.gepFelso = 100;
    }

    // animált “gondolkodás” – pl. 3 részlet
    for (let i = 0; i < 3; i++) {
      this.uzenetek.push({ szoveg: `Számítógép gondolkodik${'.'.repeat(i + 1)}`, szin: 'text-secondary' });
      await this.delay(400);
    }

    // végleges tipp
    this.gepTipp = this.gepAlso + Math.floor(Math.random() * (this.gepFelso - this.gepAlso + 1));
    this.gepTippek++;

    if (this.gepTipp < this.celSzam) {
      this.uzenetek.push({ szoveg: `Számítógép tippje: ${this.gepTipp} -> túl alacsony`, szin: 'text-primary' });
      this.gepAlso = Math.max(this.gepAlso, this.gepTipp + 1);
    } else if (this.gepTipp > this.celSzam) {
      this.uzenetek.push({ szoveg: `Számítógép tippje: ${this.gepTipp} -> túl magas`, szin: 'text-danger' });
      this.gepFelso = Math.min(this.gepFelso, this.gepTipp - 1);
    } else {
      this.uzenetek.push({ szoveg: `A számítógép nyert ${this.gepTippek} próbálkozással. A szám: ${this.celSzam}`, szin: 'text-success' });
      this.vege = true;
    }
  }

  ujJatek() {
    this.celSzam = Math.floor(Math.random() * 100) + 1;
    this.jatekosTipp = null;
    this.gepTipp = null;
    this.jatekosTippek = 0;
    this.gepTippek = 0;
    this.gepAlso = 1;
    this.gepFelso = 100;
    this.uzenetek = [{ szoveg: 'Gondoltam egy számra 1 és 100 között. Ki találja ki előbb: te vagy a számítógép?', szin: 'text-dark' }];
    this.vege = false;
  }

}
