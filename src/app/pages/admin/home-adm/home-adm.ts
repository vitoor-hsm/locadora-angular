import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuLateral } from '../../../components/menu-lateral/menu-lateral';
import { RouterModule } from '@angular/router';
import { IconeComponent } from '../../../components/icone/icone';
import { ToastService } from '../../../core/services/toast';
import { ModalService } from '../../../services/modal';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-home-adm',
  standalone: true,
  imports: [CommonModule, MenuLateral, RouterModule, IconeComponent],
  templateUrl: './home-adm.html',
  styleUrl: './home-adm.css',
})
export class HomeAdm implements OnInit {
  listaMovies: any[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  movies: any[] = [];

  constructor(
    private toastService: ToastService,
    private modalService: ModalService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.atualizarListaDaTela();
  }

  atualizarListaDaTela(page: number = 0) {
    this.authService.getMovies(page).subscribe({
      next: (data: any) => {
        // Garantimos que 'movies' receba o array de filmes
        if (data && data.content) {
          this.movies = data.content; 
          this.totalPages = data.totalPages;
          this.currentPage = data.number;
        } else {
          this.movies = data; // Caso o backend mude o formato
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Erro ao carregar filmes no Admin", err)
    });
  }

  changePage(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.atualizarListaDaTela(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  remover(id: number) {
    // Buscamos agora dentro de 'this.movies'
    const filme = this.movies.find(f => f.id === id);

    this.modalService.abrir({
      titulo: 'Excluir Filme',
      mensagem: `Tem certeza que deseja remover "${filme?.title}"?`,
      confirmar: () => {
        this.authService.deleteMovie(id).subscribe({
          next: () => {
            this.toastService.exibir('Filme removido com sucesso!');
            this.atualizarListaDaTela(this.currentPage); // Recarrega a página atual
          },
          error: () => {
            this.toastService.exibir('Erro ao remover filme', 'erro');
          }
        });
      }
    });
  }
}