import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { IconeComponent } from '../icone/icone';
import { ModalService } from '../../services/modal';

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
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
    // Now use the method that was created in the authService.
    const role = this.authService.getRole();

    if (role) {
      this.perfilUsuario = role.toUpperCase();
      this.isLogado = true;
      console.log('Role loaded via Service:', this.perfilUsuario);
    } else {
      // If the service has nothing, clear everything.
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
  const novoEstado = !document.body.classList.contains('high-contrast');
  
  this.authService.applyTheme(novoEstado);

  this.authService.updateUserContrast(novoEstado).subscribe({
    next: () => console.log('Contrast preference saved!'),
    error: (err) => console.error('Failed to save contrast preference', err)
  });
}

  sair() {
    this.authService.logout();
    this.isLogado = false; // ensures the menu is cleaned on time.
    this.perfilUsuario = '';
    this.router.navigate(['/login']);
  }
}