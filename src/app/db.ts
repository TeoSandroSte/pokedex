import Dexie, { Table } from 'dexie';

export interface Pokemons {
    id: number,
    name: string,
    appearance: Array<Appearance>,
}

export interface Appearance {
    image?: any,
    place?: any,
    date?: string,
    note: string
}

export class AppDB extends Dexie {

    pokemonLists!: Table<Pokemons>;

    constructor() {
        super('PokemonDb');
        this.version(1).stores({
            pokemonLists: 'id, name'
        });
        this.on('populate', () => this.populate())
    }

    async populate() {
        await db.pokemonLists.bulkAdd([{
            id: 1,
            name: 'bulbasaur',
            appearance: [{
                note: 'è una prova',
                date: '67/52/9173'
            }]
        },
        ])
    }

    async resetDatabase() {
        await db.transaction('rw', 'pokemonLists', () => {
            this.pokemonLists.clear();
            this.populate();
        });
    }
}

export const db = new AppDB();