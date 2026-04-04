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
  isOpens = false;
  perfilUsuario: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit() {
    this.perfilUsuario = this.authService.getPerfil().toString();
  }
  
  toggleMenu() {
    this.isOpens = !this.isOpens;
  }
  executarNovidades() {
    this.toggleMenu(); //fecha o menu
    this.router.navigate(['/user'], { queryParams: { ordem: 'novidades' } });
  }
  alternarContraste() {
    document.body.classList.toggle('high-contrast');
  }

  sair() {
    this.isOpens = false;

    this.authService.logout();

    this.router.navigate(['/login'])
  }

    
  }
