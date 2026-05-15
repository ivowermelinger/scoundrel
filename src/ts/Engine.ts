import type { Card } from '../types/Card';
import { cards } from '../data/cards';

export type GameState = ReturnType<typeof getInitialState>;

export const getInitialState = () => ({
    cards: cards as Card[],
    health: 20,
    score: 0,
    selectedWeapon: null as Card | null,
    room: [] as Card[],
    discardPile: [] as Card[],
    slayedEnemies: [] as Card[],
    lastSlayedValue: null as null | number,
    skippedRoom: false,
    isFinished: false,
    potionUsed: false,
});

export const shuffle = (array: Card[]) => {
    let currentIndex = array.length;

    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
};


export const saveGameState = (element: GameState) => {
    const state = Object.fromEntries(
        Object.keys(getInitialState()).map(k => [k, element[k as keyof GameState]])
    );
    localStorage.setItem('gameState', JSON.stringify(state));
};

export const loadGameState = (element: GameState) => {
    const gameState = localStorage.getItem('gameState');
    const loadedState = gameState ? JSON.parse(gameState) : null;

    if (!loadedState) {
        return false;
    }

    Object.assign(element, loadedState);

    return true;
};