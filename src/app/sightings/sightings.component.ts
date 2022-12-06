import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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
  pokemonList!: any;
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
  ) {
    this.subscription = pokemonApi.pokemonList$.subscribe(data => this.pokemonList = data)
  }

  ngOnInit() {
    this.getLocation();
  }

  // fileChangeEvent(event: Event) {
  // this.http.get('https://avatars0.githubusercontent.com/u/5053266?s=460&v=4', { responseType: 'blob' })
  //   .subscribe(blob => {
  // const reader = new FileReader();
  // const binaryString = reader.readAsDataURL(blob);
  // reader.onload = (event: any) => {
  //   console.log('Image in Base64: ', event.target.result);
  //   this.imgBase64 = event.target.result;
  // };

  // reader.onerror = (event: any) => {
  //   console.log("File could not be read: " + event.target.error.code);
  //   return event.target.error.code
  // };
  // });
  // }
  base64textString: String = "";

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
    console.log('immagine: ', this.base64textString)
  }

  _handleReaderLoaded(readerEvt: any) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    console.log(btoa(binaryString));
  }

  async submit() {
    // console.log('values: ', this.note.value, this.imgBase64, this.lat, this.lng, this.getDate(), this.pokemonSelected.name, this.pokemonSelected.id)
    if (this.pokemonSelected.name !== null && this.note.value !== null) {

      let existing = await db.pokemonLists
        .where({
          id: this.pokemonSelected.id
        }).toArray();
      // .modify(pokemon => {
      //   console.log('in modify')
      //   if (this.note.value !== null && this.base64textString !== undefined) {
      //     pokemon.appearance.push({
      //       note: this.note.value,
      //       date: this.getDate(),
      //       place: this.lat + ' ' + this.lng,
      //       image: 'data:image/png;base64, ' + this.base64textString,
      //     })
      //   }
      // })


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
            console.log('in modify')
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
    console.log(navigator.geolocation)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
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

  checkAll() {
    if (this.base64textString !== undefined && this.pokemonSelected.name !== '') {
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
