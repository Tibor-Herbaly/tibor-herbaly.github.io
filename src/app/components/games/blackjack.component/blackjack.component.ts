// FILE: casino-blackjack.component.ts
import { Component, ElementRef, ViewChild } from '@angular/core';

type Suit = '♠' | '♥' | '♦' | '♣';
interface Card { rank: string; suit: Suit; value: number; isAce?: boolean; }

@Component({
  selector: 'app-casino-blackjack',
  standalone: false,
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})
export class BlackjackComponent {
  @ViewChild('chatBox') chatBox!: ElementRef;

  // This balance exists only for the lifetime of the game component.
  balance = 1000;

  // ----- bet -----
  currentBet = 0;
  betLocked = false;

  // ----- game state -----
  deck: Card[] = [];
  playerCards: Card[] = [];
  dealerCards: Card[] = [];
  playerStand = false;
  roundInProgress = false;

  messages: { text: string; color?: string }[] = [];

  // ----- betting -----
  addBet(amount: number) {
    if (this.betLocked || this.roundInProgress) return;
    if (this.currentBet + amount > this.balance) {
      this.addMessage("Nincs elég egyenleg!");
      return;
    }
    this.currentBet += amount;
    this.addMessage(`+${amount} € hozzáadva a tétedhez.`);
  }

  cancelBet() {
    if (this.betLocked) return;
    this.currentBet = 0;
    this.addMessage("A tét törölve.");
  }

  onPlaceBet() {
    if (this.betLocked || this.roundInProgress) return;
    if (this.currentBet <= 0) { this.addMessage("Adj meg egy tétet!"); return; }
    if (this.currentBet > this.balance) { this.addMessage("Nincs elég egyenleg!"); return; }

    this.balance -= this.currentBet;
    this.betLocked = true;
    this.addMessage(`Tét lezárva: ${this.currentBet} €. Kezdődhet a játék!`);
  }

  // ----- deck / cards -----
  buildDeck() {
    const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    const suits: Suit[] = ['♠','♥','♦','♣'];
    this.deck = [];
    for (const s of suits) {
      for (const r of ranks) {
        let v = r === 'A' ? 11 : ['J','Q','K'].includes(r) ? 10 : parseInt(r,10);
        this.deck.push({ rank: r, suit: s, value: v, isAce: r==='A' });
      }
    }
  }

  shuffle() {
    for (let i = this.deck.length-1; i>0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  draw(): Card {
    if (this.deck.length === 0) { this.buildDeck(); this.shuffle(); }
    return this.deck.pop() as Card;
  }

  // ----- game flow -----
  startRound() {
    if (!this.betLocked) { this.addMessage("Előbb zárd le a tétet!"); return; }

    this.roundInProgress = true;
    this.playerStand = false;

    this.buildDeck(); this.shuffle();
    this.playerCards = [this.draw(), this.draw()];
    this.dealerCards = [this.draw(), this.draw()];

    this.addMessage("Kezdő osztás.");
    if (this.score(this.playerCards) === 21 || this.score(this.dealerCards) === 21) {
      setTimeout(()=>this.resolveRound(),1000);
    }
  }

  hit() {
    if (!this.roundInProgress || this.playerStand) return;
    this.playerCards.push(this.draw());
    this.addMessage("Húztál egy lapot.");
    if (this.score(this.playerCards) > 21) {
      this.addMessage("💥 Túlcsordultál!");
      setTimeout(()=>this.resolveRound(),800);
    }
  }

  stand() {
    if (!this.roundInProgress) return;
    this.playerStand = true;
    this.addMessage("Megállsz.");
    setTimeout(()=>this.dealerPlay(),1500);
  }

  dealerPlay() {
    while (this.score(this.dealerCards)<17) {
      this.dealerCards.push(this.draw());
      this.addMessage("A dealer húz...");
    }
    setTimeout(()=>this.resolveRound(),1500);
  }

  // ----- scoring -----
  score(cards: Card[]) {
    let total = cards.reduce((sum,c)=>sum+c.value,0);
    let aces = cards.filter(c=>c.isAce).length;
    while(total>21 && aces>0){ total-=10; aces--; }
    return total;
  }

  isBlackjack(cards: Card[]){ return cards.length===2 && this.score(cards)===21; }

  // ----- round result -----
  resolveRound() {
    if (!this.roundInProgress) return;

    const p = this.score(this.playerCards);
    const d = this.score(this.dealerCards);
    const pBJ = this.isBlackjack(this.playerCards);
    const dBJ = this.isBlackjack(this.dealerCards);

    let payout = 0;
    let msg = "";

    if (pBJ && !dBJ) { payout = Math.floor(this.currentBet*2.5); msg="🃏 BLACKJACK!"; }
    else if (dBJ && !pBJ) { payout=0; msg="❌ Dealer blackjack!"; }
    else if (p>21) { payout=0; msg="💥 Túlcsordultál!"; }
    else if (d>21) { payout=this.currentBet*2; msg="🎉 Dealer túlment !, nyertél !"; }
    else if (p>d) { payout=this.currentBet*2; msg=`🎉 Nyertél: ${p} vs ${d}`; }
    else if (p===d) { payout=this.currentBet; msg="🤝 Döntetlen — tét vissza."; }
    else { payout=0; msg=`❌ Vesztettél: ${p} vs ${d}`; }

    this.addMessage(msg);

    this.balance += payout;

    this.roundInProgress=false;
    this.betLocked=false;
    this.currentBet=0;
  }

  addMessage(t: string, color: string="black"){
    this.messages.push({text:t,color});
    setTimeout(()=>{
      if(this.chatBox && this.chatBox.nativeElement){
        this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
      }
    },10);
  }
}
