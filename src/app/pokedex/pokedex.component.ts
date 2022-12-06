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
  subscriptionAllPokemons!: Subscription;
  pokemonList!: Array<Pokemon>;
  pokemonListCopy: Array<Pokemon> = [];
  pokemonListSearch!: Array<Pokemon>;
  pokemonInputName = new FormControl('');

  constructor(
    private pokemonApi: PokemonApiService,
  ) {
    this.subscription = pokemonApi.pokemonList$.subscribe(data => {
      this.pokemonList = data;
      this.pokemonListCopy = data
    });
    // this.subscriptionAllPokemons = pokemonApi.allPokemonList$.subscribe(data => {
    //   this.pokemonListSearch = data;
    // });
  }

  ngOnInit() {
  }

  submitPokemonName(pokemonInputName: any) {
    pokemonInputName = pokemonInputName.trim().split(' ').join('').toLowerCase()
    this.pokemonList = this.pokemonListCopy.filter(x => x.name.toLocaleLowerCase().includes(pokemonInputName))
  }

  resetSearch() {
    this.pokemonInputName.reset();
    this.pokemonList = this.pokemonListCopy;
  }

  capitalizePokemonName(pokemonName: string) {
    return pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
  }


  // VERSIONE CON L'INFINITE SCROLL CHE CREA PROBLEMI CON IL SEARCH
  // @HostListener('scroll', ['$event']) onScroll(event: any) {
  //   // console.log(event.target.offsetHeight, event.target.scrollTop, event.target.offsetHeight + event.target.scrollTop, event.target.scrollHeight);
  //   if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
  //     console.log('bottom', event.target.offsetHeight + event.target.scrollTop, event.target.scrollHeight)
  //     this.pokemonApi.getElementInformation(20)
  //     return
  //   }
  //   else {
  //     if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 0.5) {
  //       console.log('bottom 0.5', event.target.offsetHeight + event.target.scrollTop, event.target.scrollHeight)
  //       this.pokemonApi.getElementInformation(20)
  //       return
  //     }
  //   }
  // }

}
