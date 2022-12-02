import { Component, OnInit } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { PokemonApiService } from '../pokemon-api.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'dexie';

export interface Pokemon {
  name: string,
  height: number,
  weight: number,
  id: number,
  types: Array<any>,
  sprites: {
    other: {
      'official-artwork': {
        front_default: string
      }
    }
  },
}

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss']
})
export class PokedexComponent implements OnInit {

  subscription!: Subscription;
  pokemonList!: any;
  pokemonListCopy: Array<Pokemon> = [];
  pokemonInputName = new FormControl('');

  constructor(
    private pokemonApi: PokemonApiService,
  ) {
    this.subscription = pokemonApi.pokemonList$.subscribe(data => this.pokemonList = data)
  }

  ngOnInit() {
  }

  submitPokemonName(pokemonInputName: any) {
    pokemonInputName = pokemonInputName.trim().split(' ').join('').toLowerCase()
    this.pokemonList = this.pokemonListCopy.filter(x => x.name.toLocaleLowerCase().includes(pokemonInputName))
    console.log(this.pokemonList)
  }

  resetSearch() {
    this.pokemonInputName.reset();
    this.pokemonList = this.pokemonListCopy;
  }

  capitalizePokemonName(pokemonName: string) {
    return pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
  }

}
