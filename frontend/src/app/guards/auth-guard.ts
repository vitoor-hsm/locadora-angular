import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); //It uses the authentication service and the router to find out who logged in.
  const router = inject(Router);//and expel if necessary

  //This part is to check if you're actually logged in
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  // And this is to see the level of access
  const perfilUsuario = authService.getRole();// gets the role of the logged-in user
  const perfilExigido = route.data['papelOriginal']; // and here we go to app.routes and compare to see if it matches


  if (perfilExigido && perfilUsuario !== perfilExigido) {
    //If the profile doesn't match, send it to the correct page
    alert('Acesso negado! Você não tem permissão para essa área!');
    router.navigate([perfilUsuario === 'ADM' ? '/admin' : '/user']);
    return false;
  }
  return true; // Everything has passed, allowing access.
};
