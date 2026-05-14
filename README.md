# Scoundrel

A browser-based implementation of [Scoundrel](https://www.lookout-games.de/scoundrel), the single-player card dungeon-crawler by Zach Gage and Kurt Bieg.

## How to play

Each round you are presented with a room of four cards drawn from a shuffled dungeon deck. On each turn you must interact with one card:

- **♠ / ♣ Monsters** — fight bare-handed (take damage equal to the card's value) or use your equipped weapon.
- **♦ Weapons** — equip the weapon. Your previous weapon and its kill stack are discarded.
- **♥ Potions** — heal up to your maximum health of 20.

When only one card remains in the room, the room is cleared and four new cards are dealt. You may skip a room once (its cards are shuffled back into the deck), but not two rooms in a row.

**Win** by clearing the entire dungeon deck while staying alive. **Lose** if your health drops to 0.

### Fighting with a weapon

- Each weapon can only be used against monsters whose value is **lower than or equal to the last monster it killed**.
- If the monster's value exceeds the weapon's value, you absorb the difference as damage.

## Tech stack

- [Alpine.js](https://alpinejs.dev/) — reactivity & component model  
- [Vite](https://vitejs.dev/) — build tooling  
- TypeScript, PostCSS

## Development

```bash
pnpm install
pnpm dev
```

Build for production:

```bash
pnpm build
```

## License

MIT — see [LICENSE](LICENSE).
