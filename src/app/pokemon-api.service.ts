import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pokemon } from './pokedex/pokedex.component';
import { BehaviorSubject, forkJoin, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonApiService {

  pokemonList$ = new BehaviorSubject<Array<string>>([]);
  initialUrl: string = 'https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0';

  constructor(
    private http: HttpClient
  ) { }

  getElementInformation(url: string) {
    this.http.get<any>(url).pipe(
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
        this.pokemonList$.next([])
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
      requests.push(this.http.get<any>(element.url))
    }

    return forkJoin(requests)
      .subscribe((response) => {
        this.pokemonList$.next(response)
      })
  }

  getSinglePokemonInformation(url: string) {
    return this.http.get<any>("https://pokeapi.co/api/v2/pokemon/" + url);
  }

}
