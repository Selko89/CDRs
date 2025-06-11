import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { MyPageComponent } from './pages/myPage/myPage';
import { OrganizationComponent } from './pages/organization/organization';
import { Unauthorized } from './pages/unauthorized/unauthorized';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'my-page', component: MyPageComponent },
  { path: 'organizations', component: OrganizationComponent },
  { path: 'unauthorized', component: Unauthorized },
  { path: '**', redirectTo: 'home' }
];
