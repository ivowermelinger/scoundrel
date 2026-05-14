import type { Card } from '../types/Card';

import { getInitialState, shuffle, saveGameState, loadGameState } from '../ts/Engine';

export default () => ({
    ...getInitialState(),
    maxHealth: 20,

    init() {
        const loaded = loadGameState(this);

        if (!loaded) {
            this.cards = shuffle(this.cards);
            this.fillRoom();
            saveGameState(this);
        }

        if (this.isFinished && this.health <= 0) {
            this.$refs.gameOverDialog.showModal();
        }
    },


    fillRoom() {
        if (this.isFinished) {
            return;
        }

        if (this.cards.length === 0) {
            if (this.room.length === 0) {
                this.isFinished = true;
            }
            return;
        }

        const needed = 4 - this.room.length;
        this.room.push(...this.cards.splice(0, needed));
    },


    getCardById(el: HTMLElement) {
        const id = el.closest<HTMLElement>('[data-card-id]')?.dataset.cardId;
        return this.room.find((c: Card) => c.id === id);
    },

    pickCard(e: Event) {
        if (this.isFinished) return;
        if (this.room.length <= 1 && this.cards.length > 0) return;

        const card = this.getCardById(e.currentTarget as HTMLElement);
        if (!card) return;

        if (['CLUBS', 'SPADES'].includes(card.suit)) {
            return;
        }

        switch (card.suit) {
            case 'DIAMONDS':
                this.selectedWeapon && this.discardCards(this.selectedWeapon);
                this.discardCards(this.slayedEnemies);

                this.slayedEnemies = [];
                this.selectedWeapon = card;
                break;
            case 'HEARTS':
                if (this.potionUsed) {
                    break;
                }

                this.potionUsed = true;

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
        if (this.isFinished) return;

        const card = this.getCardById(e.currentTarget as HTMLElement);
        if (!card) return;

        this.health -= card.value;
        this.discardCards(card);
        this.checkGameEnd();
    },

    fightWithWeapon(e: Event) {
        if (this.isFinished) return;

        const card = this.getCardById(e.currentTarget as HTMLElement);
        if (!card) return;

        if (this.lastSlayedValue && this.lastSlayedValue < card.value) {
            return;
        }

        const damageToDeal = this.selectedWeapon.value - card.value;

        if (damageToDeal < 0) {
            this.health += damageToDeal;
        }

        this.room = this.room.filter((c: Card) => c.id !== card.id);
        this.slayedEnemies.push(card);
        this.checkGameEnd();
    },

    discardCards(cards: Card[] | Card) {
        const cardsArray = Array.isArray(cards) ? cards : [cards];
        this.room = this.room.filter((c: Card) => !cardsArray.some((card: Card) => card.id === c.id));
        this.discardPile.push(...cardsArray);
    },

    skipRoom() {
        if (this.room.length !== 4 || this.skippedRoom) {
            return;
        }

        this.skippedRoom = true;
        const shuffled = shuffle(this.room);
        this.cards.push(...shuffled);

        this.room = [];
        this.fillRoom();
        this.checkGameEnd();
    },

    checkGameEnd() {
        const lastSlayed = this.slayedEnemies[this.slayedEnemies.length - 1];
        this.lastSlayedValue = lastSlayed?.value || null;

        if (this.health > 0 && this.room.length === 1) {
            this.skippedRoom = false;
            this.potionUsed = false;
            this.fillRoom();
            saveGameState(this);
            return;
        }

        if (this.health > 0 && this.cards.length === 0) {
            this.isFinished = true;
            saveGameState(this);
            return;
        }

        if (this.health <= 0) {
            this.$refs.gameOverDialog.showModal();
            this.isFinished = true;
            this.health = 0;
        }

        saveGameState(this);
    },


    restart() {
        localStorage.removeItem('gameState');
        window.location.reload();
    },
});