import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';  // create this component

export const routes: Routes = [
  { path: '', component: Home },         // Root path
  { path: 'login', component: Login },
];
