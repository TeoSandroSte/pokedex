import { getLocaleDateFormat, getLocaleDateTimeFormat } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { liveQuery } from 'dexie';
import { forkJoin, map } from 'rxjs';
import { db } from './db';
import { Pokemon } from './pokedex/pokedex.component';
import { PokemonApiService } from './pokemon-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Pokedex';
  initialUrl: string = 'https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0';
  pokemonList: Array<Pokemon> = [];
  pokemonListCopy: Array<Pokemon> = [];

  constructor(
    private pokemonApi: PokemonApiService,
  ) { }

  ngOnInit() {
    this.pokemonApi.getElementInformation(this.initialUrl)
  }

}
