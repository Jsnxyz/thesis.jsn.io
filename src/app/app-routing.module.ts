import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AppComponent} from './app.component'
const routes: Routes = [
    { path: '',   component: AppComponent },
    { path: '**', component: PageNotFoundComponent }
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }