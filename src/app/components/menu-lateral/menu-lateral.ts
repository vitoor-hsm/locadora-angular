import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-lateral',
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-lateral.html',
  styleUrl: './menu-lateral.css',
})
export class MenuLateral implements OnInit{
  isOpens = false; // controla se o menu está visível (true) ou escondido (false)
  perfilUsuario: string = '';// armazena se o usuário é 'ADM' ou 'USER'

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit() { // é oque faz o menu mudar para cada perfil, guardando em perfilUsuario
    this.perfilUsuario = this.authService.getPerfil().toString();
  }
  
  toggleMenu() {
    this.isOpens = !this.isOpens; //! liga e desliga, o ! muda o valor que inicialmente era false
  }
  executarNovidades() {
    this.toggleMenu(); //fecha o menu
    this.router.navigate(['/user'], { queryParams: { ordem: 'novidades' } });//filmes novos primeiro
  } //queryParams: adc ?ordem=novidades na URL, é um sinal para a Home do user entender q deve mostrar os 
  alternarContraste() {
    document.body.classList.toggle('high-contrast');
  }

  sair() {
    this.isOpens = false;

    this.authService.logout();

    this.router.navigate(['/login'])
  }

    
  }
