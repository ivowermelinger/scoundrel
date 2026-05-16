export type Card = {
    id: string;
    suit: 'HEARTS' | 'DIAMONDS' | 'CLUBS' | 'SPADES';
    value: number;
    display: 'J' | 'Q' | 'K' | 'A' | number;
    image?: string;
};
