import { getLocaleDateFormat, getLocaleDateTimeFormat } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { liveQuery } from 'dexie';
import { db } from './db';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Pokedex';
  pokemonId = new FormControl<number>(0,);
  pokemonName = new FormControl('');
  pokemonNote = new FormControl('');
  pokemonPic = new FormControl(ImageBitmap);
  lat: any;
  lng: any;
  pokemonList$ = liveQuery(() => db.pokemonLists
    .toArray()
  )
  imgBase64: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getLocation();
  }

  async resetDatabase() {
    await db.resetDatabase();
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
    if (this.pokemonId.value !== null && this.pokemonName.value !== null && this.pokemonNote.value !== null) {

      let existing = await db.pokemonLists
        .where({
          id: this.pokemonId.value
        })
        .modify(pokemon => {
          if (this.pokemonNote.value !== null && this.pokemonPic !== null) {
            pokemon.appearance.push({
              note: this.pokemonNote.value,
              date: this.getDate(),
              place: this.lat + ' ' + this.lng,
              image: this.imgBase64
            })
          }
        })


      if (existing == 0) {
        db.pokemonLists.add({
          id: this.pokemonId.value,
          name: this.pokemonName.value,
          appearance: [{
            note: this.pokemonNote.value,
            date: this.getDate(),
            place: this.lat + ' ' + this.lng,
            image: this.imgBase64
          }]
        })
      }
      console.log('existing', existing)
    }
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

}
