import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { liveQuery } from 'dexie';
import { forkJoin, map } from 'rxjs';
import { db } from '../db';
import { Pokemon } from '../pokedex/pokedex.component';
import { PokemonApiService } from '../pokemon-api.service';

@Component({
  selector: 'app-sightings',
  templateUrl: './sightings.component.html',
  styleUrls: ['./sightings.component.scss']
})
export class SightingsComponent implements OnInit {

  initialUrl: string = 'https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0';
  pokemonList: Array<Pokemon> = [];
  pokemonListCopy: Array<Pokemon> = [];
  pokemonSimpleData = [];
  pokemonSelected!: Pokemon;
  imgBase64: any;
  note = new FormControl('');
  lat: any;
  lng: any;
  pokemonList$ = liveQuery(() => db.pokemonLists
    .toArray()
  )

  constructor(
    private pokemonApi: PokemonApiService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.getLocation();
    console.log('api: ', this.pokemonApi.pokemonList);
    if (JSON.stringify(this.pokemonApi.pokemonList) == '[]') {
      this.getElementInfo(this.initialUrl);
    }
    else {
      this.pokemonList = this.pokemonApi.pokemonList;
      this.pokemonListCopy = this.pokemonList;
    }
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
        this.pokemonList = [];
        this.pokemonListCopy = [];
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
        this.pokemonApi.pokemonList = response;
        this.pokemonList = response;
        this.pokemonListCopy = this.pokemonList;
      })
  }

  fileChangeEvent() {
    this.http.get('https://avatars0.githubusercontent.com/u/5053266?s=460&v=4', { responseType: 'blob' })
      .subscribe(blob => {
        const reader = new FileReader();
        const binaryString = reader.readAsDataURL(blob);
        reader.onload = (event: any) => {
          console.log('Image in Base64: ', event.target.result);
          this.imgBase64 = event.target.result;
        };

        reader.onerror = (event: any) => {
          console.log("File could not be read: " + event.target.error.code);
          return event.target.error.code
        };
      });
  }

  async submit() {
    console.log('values: ', this.note.value, this.imgBase64, this.lat, this.lng, this.getDate(), this.pokemonSelected.name, this.pokemonSelected.id)
    if (this.pokemonSelected.name !== null && this.note.value !== null) {

      let existing = await db.pokemonLists
        .where({
          id: this.pokemonSelected.id
        })
        .modify(pokemon => {
          if (this.note.value !== null && this.imgBase64 !== undefined) {
            pokemon.appearance.push({
              note: this.note.value,
              date: this.getDate(),
              place: this.lat + ' ' + this.lng,
              image: this.imgBase64
            })
          }
        })


      if (existing == 0) {
        db.pokemonLists.add({
          id: this.pokemonSelected.id,
          name: this.pokemonSelected.name,
          appearance: [{
            note: this.note.value,
            date: this.getDate(),
            place: this.lat + ' ' + this.lng,
            image: this.imgBase64
          }]
        })
      }
      console.log('existing', existing)
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

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        }
      },
        (error) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  checkAll() {
    if (this.imgBase64 !== undefined && this.pokemonSelected.name !== '') {
      return false
    }
    else {
      return true
    }
  }

  async resetDatabase() {
    await db.resetDatabase();
  }

}
