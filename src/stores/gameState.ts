import type { Card } from '../types/Card';
import { cards } from '../data/cards';

const INITIAL_STATE = {
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
};

export default () => ({
	...INITIAL_STATE,

	shuffle(array: Card[]) {
		let currentIndex = array.length;

		while (currentIndex != 0) {
			let randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		}

		return array;
	},

	saveGameState() {
		const stateToSave = Object.fromEntries(
			Object.keys(INITIAL_STATE).map((k) => [k, this[k as keyof typeof INITIAL_STATE]])
		);

		localStorage.setItem('gameState', JSON.stringify(stateToSave));
	},

	loadGameState() {
		const gameState = localStorage.getItem('gameState');
		const loadedState = gameState ? JSON.parse(gameState) : null;

			if (!loadedState) {
				return null;
			}

			return { ...INITIAL_STATE, ...loadedState };
	},

	getCardById(id: string) {
		return cards.find((card) => card.id === id);
	},
});
