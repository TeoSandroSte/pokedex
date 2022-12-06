import { Component, OnInit } from '@angular/core';
import { Pokemon } from './pokedex/pokedex.component';
import { PokemonApiService } from './services/pokemon-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Pokedex';
  pokemonList: Array<Pokemon> = [];
  pokemonListCopy: Array<Pokemon> = [];

  constructor(
    private pokemonApi: PokemonApiService,
  ) { }

  ngOnInit() {
    this.pokemonApi.getElementInformation(0);
    this.pokemonApi.getAllrawPokemon();
  }

}
