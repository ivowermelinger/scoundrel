import type { Card } from '../types/Card';
import { cards } from '../data/cards';

export default () => ({
    cards: cards as Card[],
    maxHealth: 20,
    currentWeaponPool: [] as Card[],
    health: 20,
    score: 0,
    selectedWeapon: null,
    room: [] as Card[],
    discard: [] as Card[],


    init() {
        this.cards = this.shuffle(this.cards);
        this.fillRoom();
    },

    fillRoom() {
        const needed = 4 - this.room.length;
        this.room.push(...this.cards.splice(0, needed));
    },

    pickCard(e: Event) {
        if (this.room.length <= 1) return;

        const card = this.getCardById(e.currentTarget as HTMLElement);
        if (!card) return;

        if (['CLUBS', 'SPADES'].includes(card.suit)) {
            return;
        }

        // Remove card from room
        this.room = this.room.filter((c: Card) => c.id !== card.id);

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

        if (this.room.length === 1) {
            this.fillRoom();
        }
    },


    fightBareHanded(e: Event) {
        const card = this.getCardById(e.currentTarget as HTMLElement);
        if (!card) return;

        console.log('Bare handed fight', card);
        this.health -= card.value;
    },

    fightWithWeapon(e: Event) {
        const card = this.getCardById(e.currentTarget as HTMLElement);
        if (!card) return;

        console.log('Weapon fight', card);
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