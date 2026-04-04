import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  //essa parte é pra ver se realmente ta logado
  if (!authService.estaAutenticado()) {
    router.navigate(['/login']);
    return false;
  }
  // e essa é pra ver o nivel do acesso
  const perfilUsuario = authService.getPerfil();
  const perfilExigido = route.data['papelOriginal']; //pega oq definimos na rota

  // console.log('Perfil do Usuário Logado:', perfilUsuario);
  // console.log('Perfil Exigido por esta Rota:', perfilExigido); testei mas n funcionou

  if (perfilExigido && perfilUsuario !== perfilExigido) {
    //Se o perfil não bate, manda para a página correta dele ou login
    alert('Acesso negado! Você não tem permissão para essa área!');
    router.navigate([perfilUsuario === 'ADM' ? '/admin' : '/user']);
    return false;
  }
  return true; // se passou tudo permite o acesso

};
