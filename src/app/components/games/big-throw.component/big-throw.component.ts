import {AfterViewChecked, Component, ElementRef, ViewChild} from '@angular/core';

interface Uzenet {
  szoveg: string;
  szin: string;
}

@Component({
  selector: 'app-big-throw.component',
  standalone: false,
  templateUrl: './big-throw.component.html',
  styleUrl: './big-throw.component.css'
})
export class BigThrowComponent implements AfterViewChecked {
  @ViewChild('chatDiv') chatDiv!: ElementRef;

  userWins = 0;
  computerWins = 0;
  jatekVege = false;
  uzenetek: Uzenet[] = [];

  constructor() {
    this.uzenetek.push({ szoveg: '🎲 Dobókocka játék - Az nyer, aki először 5-ször dob nagyobbat!', szin: 'text-primary fw-bold' });
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

  async dobas() {
    if (this.jatekVege) return;

    // játékos dob
    this.uzenetek.push({ szoveg: 'Dobásod...', szin: 'text-info' });
    for (let i = 0; i < 3; i++) {
      this.uzenetek.push({ szoveg: '.'.repeat(i + 1), szin: 'text-secondary' });
      await this.delay(400);
    }
    const userRoll = Math.floor(Math.random() * 6) + 1;
    this.uzenetek.push({ szoveg: `👉 Te dobtál: ${userRoll}`, szin: 'text-primary' });
    await this.delay(700);

    // gép dob
    this.uzenetek.push({ szoveg: 'Számítógép dob...', szin: 'text-info' });
    for (let i = 0; i < 3; i++) {
      this.uzenetek.push({ szoveg: '.'.repeat(i + 1), szin: 'text-secondary' });
      await this.delay(400);
    }
    const computerRoll = Math.floor(Math.random() * 6) + 1;
    this.uzenetek.push({ szoveg: `🤖 Számítógép dobott: ${computerRoll}`, szin: 'text-danger' });
    await this.delay(700);

    // kiértékelés
    if (userRoll > computerRoll) {
      this.userWins++;
      this.uzenetek.push({ szoveg: `✅ Nyertél egy kört! (${this.userWins} - ${this.computerWins})`, szin: 'text-success fw-bold' });
    } else if (computerRoll > userRoll) {
      this.computerWins++;
      this.uzenetek.push({ szoveg: `🤖 A számítógép nyert egy kört! (${this.userWins} - ${this.computerWins})`, szin: 'text-danger fw-bold' });
    } else {
      this.uzenetek.push({ szoveg: `😅 Döntetlen! (${this.userWins} - ${this.computerWins})`, szin: 'text-warning' });
    }

    // játékvége
    if (this.userWins === 5 || this.computerWins === 5) {
      this.jatekVege = true;
      if (this.userWins === 5) {
        this.uzenetek.push({ szoveg: '🎉 Gratulálok! Te nyerted a játékot!', szin: 'text-success fw-bold' });
      } else {
        this.uzenetek.push({ szoveg: '🤖 A számítógép nyerte a játékot. Próbáld újra!', szin: 'text-danger fw-bold' });
      }
    }
  }

  ujJatek() {
    this.userWins = 0;
    this.computerWins = 0;
    this.jatekVege = false;
    this.uzenetek = [];
    this.uzenetek.push({ szoveg: '🎲 Új játék indult! Ki lesz az első 5 győzelemig?', szin: 'text-primary fw-bold' });
  }


}
