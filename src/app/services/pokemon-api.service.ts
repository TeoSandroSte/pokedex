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
  allPokemons$ = new BehaviorSubject<Array<any>>([]);
  allPokemons: Array<any> = [];
  initialUrl: string = 'https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0';
  elements = 40;
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
      })
  }

  getElementInformation(increase: number) {
    this.offset = this.offset + increase;
    this.http.get<any>(`https://pokeapi.co/api/v2/pokemon?limit=${this.elements}&offset=${this.offset}`).pipe(
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
      this.http.get<any>(element.url).subscribe(data => {
        this.pokemonList.push(data)
      })
    }
    // A quanto pare non serve
    this.pokemonList.sort(function (a, b) {
      return a.id - b.id
    });
    this.pokemonList$.next(this.pokemonList);
    console.log(this.pokemonList$)
  }

  getSpecificPokemon(url: string) {
    return this.http.get<any>(url)
  }

  getAllPokemons() {
    this.http.get<any>(this.initialUrl).pipe(
      map(i => i)
    )
      .subscribe(data => {
        if (data !== undefined && data !== null) {
          console.log('all: ', data)
          if (data !== undefined) {
            if (data.results !== undefined && data.results !== null) {
              for (let i = 0; i < data.results.length; i++) {
                const element = data.results[i];
                this.http.get<any>(element.url).subscribe(data => {
                  this.allPokemons.push({ name: data.name, id: data.id })
                })
              }
              // console.log('all post', this.allPokemons)
              // console.log('all ord', this.allPokemons)
              this.allPokemons$.next(this.allPokemons);
              // console.log('all$', this.allPokemons$)
            }
          }
          else {
            console.log('all è undefined');
          }
        }
      });
  }

}
