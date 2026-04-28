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
  isShowingFavorites: boolean | undefined;
  isSortedByNew: boolean | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.carregarPerfil();
    if (this.perfilUsuario === 'ADMIN') {
      this.perfilUsuario = 'ADM';
    }

    this.authService.favoritesFilter$.subscribe(isShowing => {
      this.isShowingFavorites = isShowing;

      this.authService.sortNewest$.subscribe(isNewest => {
        this.isSortedByNew = isNewest;
      });
    });
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
    // Agora usamos o método que já criamos no authService
    const role = this.authService.getRole();

    if (role) {
      this.perfilUsuario = role.toUpperCase();
      this.isLogado = true;
      console.log('Role loaded via Service:', this.perfilUsuario);
    } else {
      // Se o service não tem nada, limpamos tudo
      this.perfilUsuario = '';
      this.isLogado = false;
    }
  }

  toggleMenu() {
    this.carregarPerfil();
    this.isOpens = !this.isOpens;
  }

  toggleFavorites() {
    this.isShowingFavorites = !this.isShowingFavorites;
    this.authService.updateFavoritesFilter(this.isShowingFavorites);
  }

  toggleNewest() {
    this.isSortedByNew = !this.isSortedByNew;

    this.authService.updateSortNewest(this.isSortedByNew);

    this.isOpens = false;
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