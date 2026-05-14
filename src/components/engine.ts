
import { shuffle } from "../ts/Engine";
import type { Card } from '../types/Card';
import type { GameState } from '../types/GameState';
import { cards } from '../data/cards';

export default () => ({
    cards: cards as Card[],
    gameState: {
        health: 20,
        score: 0,
        selectedWeapon: null
    } as GameState,

    start() {
        this.cards = shuffle(this.cards);
    },
});