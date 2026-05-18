import type { Card } from '../types/Card';
import type gameState from '../stores/gameState';

type GameState = ReturnType<typeof gameState>;

export default () => ({
    maxHealth: 20,
    gs: {} as GameState,

    init() {
        this.gs = this.$store.gameState;
        const loaded = this.gs.loadGameState();

        if (loaded) {
            Object.assign(this.gs, loaded);
        } else {
            this.gs.shuffle(this.gs.cards);
            this.fillRoom();
            this.gs.saveGameState();
        }

        if (this.gs.isFinished && this.gs.health <= 0) {
            (this as any).$refs.gameOverDialog.showModal();
        }
    },

    fillRoom() {
        if (this.gs.isFinished) {
            return;
        }

        if (this.gs.cards.length === 0) {
            if (this.gs.room.length === 0) {
                this.gs.isFinished = true;
            }
            return;
        }

        const needed = 4 - this.gs.room.length;
        this.gs.room.push(...this.gs.cards.splice(0, needed));
    },

    getCardById(el: HTMLElement) {
        const id = el.closest<HTMLElement>('[data-card-id]')?.dataset.cardId;
        return this.gs.room.find((c: Card) => c.id === id);
    },

    pickCard(e: Event) {
        if (this.gs.isFinished) return;
        if (this.gs.room.length <= 1 && this.gs.cards.length > 0) return;

        const card = this.getCardById(e.currentTarget as HTMLElement);
        if (!card) return;

        if (['CLUBS', 'SPADES'].includes(card.suit)) {
            return;
        }

        switch (card.suit) {
            case 'DIAMONDS':
                if (this.gs.selectedWeapon) {
                    this.gs.discardPile.push(this.gs.selectedWeapon);
                }

                this.gs.discardPile.push(...this.gs.slayedEnemies);
                this.gs.slayedEnemies = [];
                this.gs.selectedWeapon = card;
                break;
            case 'HEARTS':
                if (this.gs.potionUsed) {
                    break;
                }

                this.gs.potionUsed = true;

                if (this.gs.health + card.value > this.maxHealth) {
                    this.gs.health = this.maxHealth;
                } else {
                    this.gs.health += card.value;
                }

                break;
        }

        this.discardCards(card);
        this.checkGameEnd();
    },

    fightBareHanded(e: Event) {
        if (this.gs.isFinished) return;

        const card = this.getCardById(e.currentTarget as HTMLElement);
        if (!card) return;

        this.gs.health -= card.value;
        this.discardCards(card);
        this.checkGameEnd();
    },

    fightWithWeapon(e: Event) {
        if (this.gs.isFinished) return;

        const card = this.getCardById(e.currentTarget as HTMLElement);
        if (!card) return;

        if (this.gs.lastSlayedValue && this.gs.lastSlayedValue < card.value) {
            return;
        }

        const damageToDeal = this.gs.selectedWeapon!.value - card.value;

        if (damageToDeal < 0) {
            this.gs.health += damageToDeal;
        }

        this.gs.room = this.gs.room.filter((c: Card) => c.id !== card.id);
        this.gs.slayedEnemies.push(card);
        this.checkGameEnd();
    },

    discardCards(cards: Card[] | Card) {
        const cardsArray = Array.isArray(cards) ? cards : [cards];
        this.gs.room = this.gs.room.filter(
            (c: Card) => !cardsArray.some((card: Card) => card.id === c.id)
        );
        this.gs.discardPile.push(...cardsArray);
    },

    skipRoom() {
        if (this.gs.room.length !== 4 || this.gs.skippedRoom) {
            return;
        }

        this.gs.skippedRoom = true;
        const shuffled = this.gs.shuffle(this.gs.room);
        this.gs.cards.push(...shuffled);

        this.gs.room = [];
        this.fillRoom();
        this.checkGameEnd();
    },

    checkGameEnd() {
        const lastSlayed = this.gs.slayedEnemies[this.gs.slayedEnemies.length - 1];
        this.gs.lastSlayedValue = lastSlayed?.value || null;

        if (this.gs.health > 0 && this.gs.room.length === 1) {
            this.gs.skippedRoom = false;
            this.gs.potionUsed = false;
            this.fillRoom();
            this.gs.saveGameState();
            return;
        }

        if (this.gs.health > 0 && this.gs.cards.length === 0 && this.gs.room.length <= 1) {
            this.gs.isFinished = true;
            this.gs.saveGameState();
            return;
        }

        if (this.gs.health <= 0) {
            (this as any).$refs.gameOverDialog.showModal();
            this.gs.isFinished = true;
            this.gs.health = 0;
        }

        this.gs.saveGameState();
    },

    restart() {
        localStorage.removeItem('gameState');
        window.location.reload();
    },
});
