import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'dexie';
import { PokemonApiService } from '../services/pokemon-api.service';

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
  subscriptionRawPokemons!: Subscription;
  pokemonList!: Array<Pokemon>;
  pokemonListCopy: Array<Pokemon> = [];
  pokemonRawList: Array<any> = [];
  pokemonInputName = new FormControl('');

  scroll = true

  constructor(
    private pokemonApi: PokemonApiService,
  ) {
    this.subscription = pokemonApi.pokemonList$.subscribe(data => {
      this.pokemonList = data;
      this.pokemonListCopy = data
    });
    this.subscriptionRawPokemons = pokemonApi.rawPokemonList$.subscribe(data => {
      this.pokemonRawList = data;
    });
  }

  ngOnInit() {
  }

  submitPokemonName(pokemonInputName: any) {
    let listRetrieved: any[] = []
    this.scroll = false;
    pokemonInputName = pokemonInputName.trim().split(' ').join('').toLowerCase();
    let list = this.pokemonRawList.filter(x => x.name.toLocaleLowerCase().includes(pokemonInputName));
    console.log(list)
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      this.pokemonApi.getSpecificPokemon(element.url).subscribe(data => listRetrieved.push(data));
      console.log(element)
    }
    this.pokemonList = listRetrieved;
  }

  resetSearch() {
    this.pokemonInputName.reset();
    this.pokemonList = this.pokemonListCopy;
    this.scroll = true
  }

  capitalizePokemonName(pokemonName: string) {
    return pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
  }


  // VERSIONE CON L'INFINITE SCROLL CHE CREA PROBLEMI CON IL SEARCH
  @HostListener('scroll', ['$event']) onScroll(event: any) {
    // console.log(event.target.offsetHeight, event.target.scrollTop, event.target.offsetHeight + event.target.scrollTop, event.target.scrollHeight);
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      console.log('bottom', event.target.offsetHeight + event.target.scrollTop, event.target.scrollHeight)
      this.pokemonApi.getElementInformation(20)
      return
    }
    else {
      if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 0.5) {
        console.log('bottom 0.5', event.target.offsetHeight + event.target.scrollTop, event.target.scrollHeight)
        this.pokemonApi.getElementInformation(20)
        return
      }
    }
  }

}
