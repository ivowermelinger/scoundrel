export type Card = {
    id: string;
    suit: 'HEARTS' | 'DIAMONDS' | 'CLUBS' | 'SPADES';
    value: number;
    display: string;
    image?: string;
};
