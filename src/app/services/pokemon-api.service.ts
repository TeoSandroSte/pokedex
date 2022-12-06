import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { Pokemon } from '../pokedex/pokedex.component';

@Injectable({
  providedIn: 'root'
})
export class PokemonApiService {

  pokemonList$ = new BehaviorSubject<Array<Pokemon>>([]);
  pokemonList: Array<Pokemon> = [];
  rawPokemonList$ = new BehaviorSubject<Array<any>>([]);
  initialUrl: string = 'https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0';
  elements = 20;
  offset = 0;

  constructor(
    private http: HttpClient
  ) { }

  getAllrawPokemon() {
    this.http.get<any>(this.initialUrl).pipe(
      map(i => i)
    )
      .subscribe(data => {
        this.rawPokemonList$.next(data.results)
        console.log('raw data: ', data)
      })
  }

  getElementInformation(increase: number) {
    // VERSIONE CON L'INFINITE SCROLL CHE CREA PROBLEMI CON IL SEARCH
    this.offset = this.offset + increase;
    this.http.get<any>(`https://pokeapi.co/api/v2/pokemon?limit=${this.elements}&offset=${this.offset}`).pipe(
      // this.http.get<any>(this.initialUrl).pipe(
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
        // this.pokemonList$.next([])
        this.findAndWaitForAllPokemons(data.results);
      }
    }
    else {
      console.log('data è undefined');
    }
  }

  findAndWaitForAllPokemons(results: any) {
    for (let i = 0; i < results.length; i++) {
      const element = results[i];
      console.log(i)
      this.http.get<any>(element.url).subscribe(data => {
        this.pokemonList.push(data)
      })
    }
    this.pokemonList$.next(this.pokemonList);
  }

  getSpecificPokemon(url: string) {
    return this.http.get<any>(url)
  }

}
