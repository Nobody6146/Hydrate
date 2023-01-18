import { Deck } from "./card.js";
export class War {
    #players;
    constructor(playerCount) {
        //Setup the game state
        const startingDeck = this.#createDeck();
        this.#players = this.#initializePlayers(playerCount, startingDeck);
    }
    get players() {
        return this.#players;
    }
    #createDeck() {
        const deck = new Deck();
        deck.shuffle(5);
        return deck;
    }
    #initializePlayers(playerCount, startingDeck) {
        const players = [];
        const decks = startingDeck.split(playerCount - 1);
        for (let i = 0; i < decks.length; i++) {
            players.push({
                name: `Player ${i + 1}`,
                deck: decks[i],
                hand: []
            });
        }
        return players;
    }
    determineWinner() {
        let winningScore = -1;
        let winner = null;
        let maxHand = 0;
        const cards = [];
        for (let player of this.#players) {
            if (player.hand.length === 0)
                continue;
            const score = player.hand[player.hand.length - 1].value;
            cards.push(...player.hand);
            if (score > winningScore || player.hand.length > maxHand) {
                winningScore = score;
                winner = player;
                maxHand = player.hand.length;
            }
        }
        if (winner === null)
            return null;
        return {
            player: winner,
            cards: cards
        };
    }
    fight() {
        //If we had a winner from last round, add the cards back to decks and reset the round
        const winner = this.determineWinner();
        if (winner) {
            for (let player of this.#players)
                player.hand = [];
            winner.player.deck.add(winner.cards);
        }
        this.#battle();
        return {
            players: this.#players,
            winner: this.determineWinner()
        };
    }
    #battle() {
        const draws = [];
        let tie = false;
        for (let player of this.#players) {
            if (player.deck.size === 0)
                continue;
            const card = player.deck.draw()[0];
            if (draws.some(x => x.value === card.value))
                tie = true;
            player.hand.push(card);
            draws.push(card);
        }
        if (tie)
            this.#battle();
    }
}
