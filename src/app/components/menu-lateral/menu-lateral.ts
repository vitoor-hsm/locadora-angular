import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { IconeComponent } from '../icone/icone';
import { ModalService } from '../../services/modal';

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  // IMPORTANTE: ModalComponent removido daqui para usar o Modal Global
  imports: [CommonModule, RouterModule, IconeComponent],
  templateUrl: './menu-lateral.html',
  styleUrl: './menu-lateral.css',
})
export class MenuLateral implements OnInit {
  isOpens = false;
  perfilUsuario: string = '';
  isLogado: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.carregarPerfil();
  }

  abrirConfirmacaoSair() {
    this.isOpens = false;

    this.modalService.abrir({
      titulo: 'Sair do Sistema',
      mensagem: 'Deseja realmente encerrar sua sessão?',
      confirmar: () => {
        this.sair();
      }
    });
  }

  carregarPerfil() {
    const perfil = this.authService.getPerfil();

    if (perfil) {
      this.perfilUsuario = perfil.toString().toUpperCase();
      this.isLogado = true;
      console.log('Perfil carregado via Serviço:', this.perfilUsuario);
    } else {
      const salvo = localStorage.getItem('usuarioLogado');
      if (salvo) {
        const user = JSON.parse(salvo);
        this.perfilUsuario = user?.perfil?.toUpperCase() || '';
        this.isLogado = true;
        console.log('Perfil carregado via LocalStorage:', this.perfilUsuario);
      } else {
        this.perfilUsuario = '';
        this.isLogado = false;
      }
    }
  }

  toggleMenu() {
    this.isOpens = !this.isOpens;
  }

  executarFavoritos() {
    this.toggleMenu();
    this.router.navigate(['/user'], { queryParams: { filtro: 'favoritos' } });
  }

  executarNovidades() {
    this.toggleMenu();
    this.router.navigate(['/user'], { queryParams: { ordem: 'novidades' } });
  }

  alternarContraste() {
    document.body.classList.toggle('high-contrast');
  }

  sair() {
    this.authService.logout();
    this.isLogado = false; // ✅ Garante que o menu limpa na hora
    this.perfilUsuario = '';
    this.router.navigate(['/login']);
  }
}