import type { Card } from "./Card";

export type GameState = {
    health: number;
    score: number;
    selectedWeapon: Card | null;
};
