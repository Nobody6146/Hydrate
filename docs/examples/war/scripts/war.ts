import { HydrateApp, HydrateAppService} from "../../../hydrate.js";
import { Deck, PlayingCard } from "./card.js";

export interface Player {
    name:string;
    deck:Deck;
    hand:PlayingCard[];
}

export interface FightResult {
    players:Player[];
    winner:Winner;
}

export interface Winner {
    player:Player;
    cards:PlayingCard[];
}

export class War extends HydrateAppService {
    #players:Player[];

    constructor(playerCount:number) {
        super();
        //Setup the game state
        const startingDeck = this.#createDeck();
        this.#players = this.#initializePlayers(playerCount, startingDeck);
    }

    get players() {
        return this.#players;
    }

    #createDeck():Deck {
        const deck = new Deck();
        deck.shuffle(5);
        return deck;
    }

    #initializePlayers(playerCount:number, startingDeck:Deck): Player[] {
        const players:Player[] = [];
        const decks = startingDeck.split(playerCount - 1);
        for(let i = 0; i < decks.length; i++)
        {
            players.push({
                name: `Player ${i + 1}`,
                deck: decks[i],
                hand: []
            });
        }
        return players;
    }

    determineWinner():Winner {
        let winningScore = -1;
        let winner:Player = null;
        let maxHand = 0;
        const cards:PlayingCard[] = [];
        for(let player of this.#players) {
            if(player.hand.length === 0)
                continue;
            const score = player.hand[player.hand.length - 1].value;
            cards.push(...player.hand);
            if(score > winningScore || player.hand.length > maxHand)
            {
                winningScore = score;
                winner = player;
                maxHand = player.hand.length;
            }
        }

        if(winner === null)
            return null;
        
        return {
            player: winner,
            cards: cards
        };
    }

    fight():FightResult {
        //If we had a winner from last round, add the cards back to decks and reset the round
        const winner = this.determineWinner();
        if(winner) {
            for(let player of this.#players) 
                player.hand = [];
            winner.player.deck.add(winner.cards);
        }

        this.#battle();

        return {
            players:this.#players,
            winner:this.determineWinner()
        };
    }

    #battle():void {
        const draws:PlayingCard[] = [];
        let tie = false;
        let highest = -1;
        for(let player of this.#players) {
            if(player.deck.size === 0)
                continue;
            const card = player.deck.draw()[0];
            if(card.value > highest)
                highest =  card.value;
            player.hand.push(card);
            draws.push(card);
        }

        //Check for a tie, if so, keep going!
        if(draws.filter(x => x.value === highest).length > 1)
            this.#battle();
    }
}