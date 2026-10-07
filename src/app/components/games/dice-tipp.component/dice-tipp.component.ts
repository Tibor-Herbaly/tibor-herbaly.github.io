import {AfterViewChecked, Component, ElementRef, ViewChild} from '@angular/core';

interface Uzenet {
  szoveg: string;
  szin: string;
}

@Component({
  selector: 'app-dice-tipp.component',
  standalone: false,
  templateUrl: './dice-tipp.component.html',
  styleUrl: './dice-tipp.component.css'
})

export class DiceTippComponent implements AfterViewChecked {
  @ViewChild('chatDiv') chatDiv!: ElementRef;

  korokSzama = 15;
  aktualisKor = 1;

  jatekosNev1: string = 'Te';
  jatekosNev2: string = 'Számítógép';
  gepEllen: boolean = true;

  tipp1: number | null = null;
  tipp2: number | null = null;

  utolsoDobas: number = 0;
  pont1: number = 0;
  pont2: number = 0;

  uzenetek: Uzenet[] = [];
  vege: boolean = false;

  constructor() { }

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
    if (this.vege || this.tipp1 === null) return;

    // --- Kör kiírása ---
    this.uzenetek.push({ szoveg: `=== ${this.aktualisKor}. kör ===`, szin: 'text-dark fw-bold' });

    let jatekosEloszor = this.aktualisKor % 2 !== 0;

    if (jatekosEloszor) {
      // Játékos kezd
      this.uzenetek.push({ szoveg: `${this.jatekosNev1} tipped: ${this.tipp1}`, szin: 'text-primary' });
      await this.delay(500);

      // Gép gondolkodik
      let gepTipp = this.gepValasztas(this.tipp1!);
      await this.gepGondolkodik();
      this.tipp2 = gepTipp;
      this.uzenetek.push({ szoveg: `Számítógép tippje: ${gepTipp}`, szin: 'text-danger' });
    } else {
      // Gép kezd
      let gepTipp = this.gepValasztas(0);
      await this.gepGondolkodik();
      this.tipp2 = gepTipp;
      this.uzenetek.push({ szoveg: `Számítógép tippje: ${gepTipp}`, szin: 'text-danger' });
      await this.delay(500);

      // Játékos tipp
      this.uzenetek.push({ szoveg: `${this.jatekosNev1} tipped: ${this.tipp1}`, szin: 'text-primary' });
    }

    // --- Dobás késleltetve ---
    await this.delay(700);
    this.utolsoDobas = Math.floor(Math.random() * 6) + 1;

    const pontKor1 = this.kiSzamitottPontok(this.tipp1!, this.utolsoDobas);
    this.pont1 += pontKor1;
    const pontKor2 = this.kiSzamitottPontok(this.tipp2!, this.utolsoDobas);
    this.pont2 += pontKor2;

    this.uzenetek.push({
      szoveg: `Dobás: ${this.utolsoDobas} → ${this.jatekosNev1}: +${pontKor1}, Számítógép: +${pontKor2}`,
      szin: 'text-black fw-bold'
    });

    this.uzenetek.push({
      szoveg: `Állás: ${this.jatekosNev1}: ${this.pont1} pont | Számítógép: ${this.pont2} pont`,
      szin: 'text-black fw-bold'
    });

    if (this.aktualisKor >= this.korokSzama) {
      this.vege = true;
      let nyertes: string;
      if (this.pont1 > this.pont2) nyertes = this.jatekosNev1;
      else if (this.pont2 > this.pont1) nyertes = this.jatekosNev2;
      else nyertes = 'Döntetlen';
      this.uzenetek.push({ szoveg: `=== JÁTÉK VÉGE === Nyertes: ${nyertes} ===`, szin: 'text-success' });
    } else {
      this.aktualisKor++;
      this.tipp1 = null;
      this.tipp2 = null;
    }

  }

  ujJatek(gepEllen: boolean) {
    this.gepEllen = gepEllen;
    this.aktualisKor = 1;
    this.pont1 = 0;
    this.pont2 = 0;
    this.tipp1 = null;
    this.tipp2 = null;
    this.utolsoDobas = 0;
    this.uzenetek = [];
    this.vege = false;

    this.uzenetek.push({ szoveg: '=== Új játék kezdődött ===', szin: 'text-success fw-bold' });
  }

  // --- Segédfüggvények itt jönnek ---
  gepValasztas(tiltott: number): number {
    let tipp: number;
    if (this.aktualisKor >= 8) {
      do { tipp = Math.floor(Math.random() * 6) + 1; } while (tipp === tiltott);
    } else {
      tipp = Math.floor(Math.random() * 6) + 1;
    }
    return tipp;
  }

  async gepGondolkodik() {
    for (let i = 1; i <= 3; i++) {
      this.uzenetek.push({ szoveg: `Számítógép gondolkodik${'.'.repeat(i)}`, szin: 'text-secondary' });
      await this.delay(400);
    }
  }

  kiSzamitottPontok(guess: number, roll: number): number {
    if (guess === roll) return 3;
    if (Math.abs(guess - roll) === 1 || (guess === 1 && roll === 6) || (guess === 6 && roll === 1)) return 1;
    return 0;
  }
}
