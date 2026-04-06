import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); //pega o serviço de autentificação e o roteador pra saber qm logou 
  const router = inject(Router);// e expusar se precisar

  //essa parte é pra ver se realmente ta logado
  if (!authService.estaAutenticado()) {
    router.navigate(['/login']);
    return false;
  }
  // e essa é pra ver o nivel do acesso
  const perfilUsuario = authService.getPerfil();// pega o cargo de qm ta logado
  const perfilExigido = route.data['papelOriginal']; // e aqui vai la no app.routes ecompara pra ver se bate

  // console.log('Perfil do Usuário Logado:', perfilUsuario);
  // console.log('Perfil Exigido por esta Rota:', perfilExigido); testei mas n funcionou

  if (perfilExigido && perfilUsuario !== perfilExigido) {
    //Se o perfil não bate, manda para a página correta dele 
    alert('Acesso negado! Você não tem permissão para essa área!');
    router.navigate([perfilUsuario === 'ADM' ? '/admin' : '/user']);
    return false;
  }
  return true; // se passou tudo permite o acesso

};
