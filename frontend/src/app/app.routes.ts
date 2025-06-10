import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { MyPageComponent } from './pages/myPage/myPage';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'my-page', component: MyPageComponent },
  { path: '**', redirectTo: 'home' }
];
