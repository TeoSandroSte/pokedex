import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PokemonApiService {

  constructor(
    private http: HttpClient
  ) { }

  getElementInformation(url: string) {
    return this.http.get<any>(url);
  }

  getSinglePokemonInformation(url: string) {
    return this.http.get<any>("https://pokeapi.co/api/v2/pokemon/" + url);
  }
}
