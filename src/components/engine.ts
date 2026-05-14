import type { Card } from '../types/Card';
import { cards } from '../data/cards';

export default () => ({
    finished: false,
    cards: cards as Card[],
    maxHealth: 20,
    slayedEnemies: [] as Card[],
    health: 20,
    score: 0,
    selectedWeapon: null,
    room: [] as Card[],
    discardPile: [] as Card[],


    init() {
        this.cards = this.shuffle(this.cards);
        this.fillRoom();
    },

    fillRoom() {
        if (this.finished) {
            return;
        }

        if (this.cards.length === 0) {
            this.finished = true;
            return;
        }

        const needed = 4 - this.room.length;
        this.room.push(...this.cards.splice(0, needed));
    },

    pickCard(e: Event) {
        if (this.room.length <= 1 || this.finished) return;

        const card = this.getCardById(e.currentTarget as HTMLElement);
        if (!card) return;

        if (['CLUBS', 'SPADES'].includes(card.suit)) {
            return;
        }

        switch (card.suit) {
            case 'DIAMONDS':
                this.selectedWeapon = card;
                break;
            case 'HEARTS':
                if (this.health + card.value > this.maxHealth) {
                    this.health = this.maxHealth;
                } else {
                    this.health += card.value;
                }

                break;
        }

        this.discardCards(card);
        this.checkGameEnd();
    },


    fightBareHanded(e: Event) {
        if (this.finished) return;

        const card = this.getCardById(e.currentTarget as HTMLElement);
        if (!card) return;

        console.log('Bare handed fight', card);
        this.health -= card.value;
        this.discardCards(card);
        this.checkGameEnd();
    },

    fightWithWeapon(e: Event) {
        if (this.finished) return;

        const card = this.getCardById(e.currentTarget as HTMLElement);
        if (!card) return;

        console.log('Weapon fight', card);
        this.checkGameEnd();
    },

    /**
     * 
     * Helper methods right here
     */
    shuffle(array: Card[]) {
        let currentIndex = array.length;

        while (currentIndex != 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    },

    checkGameEnd() {
        if (this.health > 0 && this.room.length === 1) {
            this.fillRoom();
            return;
        }

        if (this.health > 0 && this.cards.length === 0) {
            console.log('You win!');
            this.finished = true;
            return;
        }

        if (this.health <= 0) {
            console.log('Game over');
            this.finished = true;
            this.health = 0;
        }
    },

    discardCards(cards: Card[] | Card) {
        const cardsArray = Array.isArray(cards) ? cards : [cards];
        this.room = this.room.filter((c: Card) => !cardsArray.some((card: Card) => card.id === c.id));
        this.discardPile.push(...cardsArray);
    },

    getCardById(el: HTMLElement) {
        const id = el.closest<HTMLElement>('[data-card-id]')?.dataset.cardId;
        return this.room.find((c: Card) => c.id === id);
    },

    saveGameState() {
        localStorage.setItem('gameState', JSON.stringify({ health: this.health, score: this.score, selectedWeapon: this.selectedWeapon, room: this.room, discard: this.discard }));
    },

    loadGameState() {
        const gameState = localStorage.getItem('gameState');
        return gameState ? JSON.parse(gameState) : null;
    }
});