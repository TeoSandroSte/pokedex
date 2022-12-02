import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pokemon } from './pokedex/pokedex.component';

@Injectable({
  providedIn: 'root'
})
export class PokemonApiService {

  pokemonList: Array<Pokemon> = [];

  constructor(
    private http: HttpClient
  ) { }

  getElementInformation(url: string) {
    return this.http.get<any>(url);
  }

  getSinglePokemonInformation(url: string) {
    return this.http.get<any>("https://pokeapi.co/api/v2/pokemon/" + url);
  }

  setPokemonList(list: Array<Pokemon>) {
    this.pokemonList = list;
    console.log('set: ', this.pokemonList)
  }

  getPokemonList() {
    console.log('get: ', this.pokemonList)
    return this.pokemonList;
  }

}
