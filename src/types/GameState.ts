import type { Card } from "./Card";

export type GameState = {
    health: number;
    score: number;
    cardsInRoom: Card[];
    selectedWeapon: Card | null;
};
