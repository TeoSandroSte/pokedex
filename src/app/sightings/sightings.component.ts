import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { liveQuery } from 'dexie';
import { forkJoin, map, Subscription } from 'rxjs';
import { db } from '../db';
import { Pokemon } from '../pokedex/pokedex.component';
import { PokemonApiService } from '../services/pokemon-api.service';

@Component({
  selector: 'app-sightings',
  templateUrl: './sightings.component.html',
  styleUrls: ['./sightings.component.scss']
})
export class SightingsComponent implements OnInit {

  subscription!: Subscription;
  allPokemons!: any;
  lat: any;
  lng: any;
  pokemonList$ = liveQuery(() => db.pokemonLists
    .toArray()
  )
  avvistamento: boolean = false;
  base64textString: String = "";
  pokemonSelected!: any;
  note = new FormControl()

  constructor(
    private pokemonApi: PokemonApiService,
    private http: HttpClient,
  ) {
    this.subscription = pokemonApi.allPokemons$.subscribe(data => this.allPokemons = data)
  }

  ngOnInit() {
    this.getLocation();
    this.pokemonApi.getAllPokemons();
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        }
      },
        (error) => {
          console.log(error);
          this.lat = 35.728909;
          this.lng = 139.719213;
        });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  capitalizePokemonName(pokemonName: string) {
    return pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
  }

  fileChangeEvent(evt: any) {
    if (evt.target !== null) {
      var files = evt.target.files;
      var file = files[0];

      if (files && file) {
        var reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      }
    }
  }

  _handleReaderLoaded(readerEvt: any) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
  }

  cancel() {
    // this.avvistamento = false;
    this.pokemonSelected = {}
    this.base64textString = '';
  }

  checkAll() {
    if (this.base64textString !== undefined && this.base64textString !== ''
      && JSON.stringify(this.pokemonSelected) !== 'undefined' && JSON.stringify(this.pokemonSelected) !== '{}') {
      return false
    }
    else {
      return true
    }
  }

  async submit() {
    let existing = await db.pokemonLists
      .where({
        id: this.pokemonSelected.id
      }).toArray();

    if (existing.length == 0) {
      db.pokemonLists.add({
        id: this.pokemonSelected.id,
        name: this.pokemonSelected.name,
        appearance: [{
          note: this.note.value,
          date: this.getDate(),
          place: this.lat + ' ' + this.lng,
          image: 'data:image/png;base64, ' + this.base64textString
        }]
      })
    }
    if (existing.length == 1) {
      await db.pokemonLists
        .where({
          id: this.pokemonSelected.id
        }).modify(pokemon => {
          if (this.note.value !== null && this.base64textString !== undefined) {
            pokemon.appearance.push({
              note: this.note.value,
              date: this.getDate(),
              place: this.lat + ' ' + this.lng,
              image: 'data:image/png;base64, ' + this.base64textString,
            })
          }
        })
    }
  }

  getDate() {
    let inputDate = new Date()
    let date, month, year;

    date = inputDate.getDate();
    month = inputDate.getMonth() + 1;
    year = inputDate.getFullYear();

    date = date
      .toString()
      .padStart(2, '0');

    month = month
      .toString()
      .padStart(2, '0');

    return `${date}/${month}/${year}`;
  }

  async resetDatabase() {
    await db.resetDatabase();
  }

  cambiaAvvistamento() {
    this.avvistamento = !this.avvistamento;
  }

}
