import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* componentes */
import { LoginComponent } from '../components/login/login.component';
import { HomeComponent } from '../components/home/home.component';
/* guards */
import { LoginGuard } from '../services/guards/login.guard';

const routes: Routes = [
  {                                          // removed square bracket
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [LoginGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
