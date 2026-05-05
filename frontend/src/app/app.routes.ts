import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { HomeAdm } from './pages/admin/home-adm/home-adm';
import { HomeUserComponent } from './pages/user/home-user/home-user';
import { LoginComponent } from './pages/login/login';
import { authGuard } from './guards/auth-guard';
import { FilmeDetalhesComponent } from './pages/admin/filme-detalhes/filme-detalhes';
import { FilmeFormComponent } from './pages/admin/filme-form/filme-form';
import { UsuariosListaComponent } from './pages/admin/usuarios-lista/usuarios-lista';
import { UsuarioFormComponent } from './pages/admin/usuario-form/usuario-form';
import { DetalhesFilmeComponent } from './pages/detalhes-filme/detalhes-filme';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'admin',
    component: HomeAdm,
    canActivate: [authGuard],
    data: { papelOriginal: 'ADM' }
  },

  {
    path: 'admin/filme/:id', // The ID is the parameter, canActivate autoguard is a security lock, before
    component: FilmeDetalhesComponent, //When the screen loads, Angular calls authGuard
    canActivate: [authGuard],
    data: { papelOriginal: 'ADM' } // Here it checks if the route belongs to the user or the admin.
  },

  {
    path: 'admin/filme/editar/:id',
    component: FilmeFormComponent,
    canActivate: [authGuard],
    data: { papelOriginal: 'ADM' }
  },

  {
    path: 'user',
    component: HomeUserComponent,
    canActivate: [authGuard],
    data: { papelOriginal: 'USER' }
  },
  {
    path: 'admin/usuarios',
    canActivate: [authGuard],
    component: UsuariosListaComponent,
    data: { papelOriginal: 'ADM' }
  },

  {
    path: 'admin/usuarios/form/:id',
    canActivate: [authGuard],
    data: { papelOriginal: 'ADM' },
    component: UsuarioFormComponent
  },
  {
    path: 'detalhes-filme/:id',
    data: { papelOriginal: 'USER' },
    component: DetalhesFilmeComponent,
    canActivate: [authGuard],
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: '**', redirectTo: '/login' } // "catch everything" any route that doesn't exist returns to the login page.

];