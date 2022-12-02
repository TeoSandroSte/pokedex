import { Component, OnInit } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { PokemonApiService } from '../pokemon-api.service';
import { FormControl } from '@angular/forms';

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

  initialUrl: string = 'https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0';
  pokemonRawData: Array<any> = [];
  pokemonList: Array<Pokemon> = [];
  pokemonListCopy: Array<Pokemon> = [];
  nextResults!: string;
  pokemonInputName = new FormControl('');

  constructor(
    private pokemonApi: PokemonApiService,
  ) { }

  ngOnInit() {
    this.getElementInfo(this.initialUrl);
  }

  getElementInfo(url: string) {
    this.pokemonApi.getElementInformation(url)
      .pipe(
        map(i => i)
      )
      .subscribe(data => {
        if (data !== undefined && data !== null) {
          console.log('data: ', data)
          this.separateElementData(data)
        }
      });
  }

  separateElementData(data: any) {
    if (data !== undefined) {
      if (data.results !== undefined && data.results !== null) {
        this.pokemonRawData = data.results;
        this.pokemonList = [];
        this.findAndWaitForAllPokemons(data.results);
      }
    }
    else {
      console.log('data è undefined');
    }
  }

  findAndWaitForAllPokemons(results: any) {
    const requests = [];

    for (let i = 0; i < results.length; i++) {
      const element = results[i];
      requests.push(this.pokemonApi.getElementInformation(element.url))
    }

    return forkJoin(requests)
      .subscribe((response) => {
        this.pokemonList = response;
        this.pokemonListCopy = this.pokemonList;
      })
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


  avvistamento() {

  }


}
