import { Component } from '@angular/core';

interface Card {
  id: number;
  image: string;
  flipped: boolean;
  matched: boolean;
}

@Component({
  selector: 'app-memory-game.component',
  standalone: false,
  templateUrl: './memory-game.component.html',
  styleUrl: './memory-game.component.css'
})
export class MemoryGameComponent {

  cards: Card[] = [];
  flippedCards: Card[] = [];
  moves: number = 0;
  gameWon: boolean = false;

  images: string[] = [
    '🍎', '🍌', '🍒', '🍇', '🍉', '🍓', '🍍' // egyszerű szimbólum képek (emoji)
  ];

  constructor() {
    this.startGame();
  }

  startGame() {
    this.moves = 0;
    this.gameWon = false;

    // párok készítése (7 pár = 14 kártya)
    let cardImages = [...this.images, ...this.images];

    // shuffle
    cardImages = cardImages.sort(() => Math.random() - 0.5);

    this.cards = cardImages.map((img, index) => ({
      id: index,
      image: img,
      flipped: false,
      matched: false
    }));
  }

  flipCard(card: Card) {
    if (card.flipped || card.matched || this.flippedCards.length === 2) {
      return;
    }

    card.flipped = true;
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.moves++;

      const [first, second] = this.flippedCards;
      if (first.image === second.image) {
        // egyeznek → bent maradnak
        first.matched = true;
        second.matched = true;
        this.flippedCards = [];
        this.checkWin();
      } else {
        // nem egyeznek → 1 sec múlva visszafordul
        setTimeout(() => {
          first.flipped = false;
          second.flipped = false;
          this.flippedCards = [];
        }, 1000);
      }
    }
  }

  checkWin() {
    if (this.cards.every(c => c.matched)) {
      this.gameWon = true;
    }
  }

}

