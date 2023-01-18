export class PlayingCard {
    id:number;
    //suit:CardSuit;
    value:number;

    constructor(id:number) {
        this.id = id;
        this.value = id % 13;
        if(this.value === 0)
            this.value = 13;
    }
}

export class Deck {
    #cards:PlayingCard[];

    constructor(size:number = 52) {
        this.#cards = [];
        for(let i = 0; i < size; i++)
            this.#cards.push(new PlayingCard(i));
        
    }

    get cards():PlayingCard[] {
        return this.#cards;
    }

    get size():number {
        return this.#cards.length;
    }

    shuffle(times:number = 1):void {
        for(let i = 0; i < times; i++)
        {
            const shufflerDeck:PlayingCard[] = this.#cards;
            this.#cards = [];
            
            while(shufflerDeck.length > 0)
            {
                const index = Math.floor(Math.random() * shufflerDeck.length);
                const removed = shufflerDeck.splice(index, 1);
                this.#cards.push(removed[0]);
            }
        }
    }

    /**
     * Splits the deck evenly into smaller decks.
     * @param times Number of times the deck should be split
     * @returns An array of decks containing the cards (including the initial deck)
     */
    split(times:number = 1):Deck[] {
        const count = Math.floor(this.#cards.length / (times + 1));
        const decks:Deck[] = [this];
        for(let i = 0; i < times; i++)
        {
            const deck = new Deck(0);
            deck.add(this.draw(count));
            decks.push(deck);
        }
        return decks;
    }

    draw(count:number = 1):PlayingCard[] {
        if(this.#cards.length === 0)
            return [];
        if(count > this.#cards.length)
            count = this.#cards.length;
        return this.#cards.splice(0, count);
    }
    
    add(cards:PlayingCard[]):void {
        this.#cards.push(...cards);
    }
}

