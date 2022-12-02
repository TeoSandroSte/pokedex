import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent } from './container/container.component';
import { PokedexComponent } from './pokedex/pokedex.component';
import { SightingsComponent } from './sightings/sightings.component';

const routes: Routes = [
  {
    path: '', component: ContainerComponent, children:
      [{ path: '', redirectTo: 'pokedex', pathMatch: 'full' },
      { path: 'pokedex', component: PokedexComponent },
      { path: 'sightings', component: SightingsComponent }
      ]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
