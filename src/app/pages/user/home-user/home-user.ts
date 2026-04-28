import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MenuLateral } from '../../../components/menu-lateral/menu-lateral';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IconeComponent } from '../../../components/icone/icone';
import { ModalService } from '../../../services/modal';
import { ModalFilmeComponent } from '../../../components/modal-filme/modal-filme';
import { AuthService } from '../../../services/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-user',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuLateral, IconeComponent, ModalFilmeComponent],
  templateUrl: './home-user.html',
  styleUrl: './home-user.css',
})
export class HomeUserComponent implements OnInit {
  movies: any[] = [];
  favorites: number[] = [];
  isShowingFavoritesOnly: boolean = false;
  selectedMovie: any;
  showDetailsModal: boolean = false;
  currentPage: number = 0;
  totalPages: number = 0;
  isSortedByNew: boolean = false;
  toastService: any;
  http: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.authService.favoritesFilter$.subscribe(isShowing => {
      this.isShowingFavoritesOnly = isShowing;
      this.loadMovies();

      this.authService.sortNewest$.subscribe(isNewest => {
        this.isSortedByNew = isNewest;
        this.loadMovies(); 
      });
    });
  }

  openDetailsModal(movie: any) { // Alterado de abrirModalDetalhes
    this.selectedMovie = movie;
    this.showDetailsModal = true;
  }

  closeDetailsModal() { // Alterado de fecharModalDetalhes
    this.showDetailsModal = false;
    this.selectedMovie = null;
  }

  loadMovies(sortByNew: boolean = this.isSortedByNew, page: number = 0) {
    // 1. Pega o ID do usuário logado
    const userJson = localStorage.getItem('loggedUser');
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    const sortOrder = this.isSortedByNew ? 'releaseYear,desc' : 'title,asc';

    // 2. Passa o userId para as chamadas do service
    const call = this.isShowingFavoritesOnly
      ? this.authService.getFavoriteMovies(page, userId)
      : this.authService.getMovies(page, userId, sortOrder);

    call.subscribe({
      next: (data: any) => {
        this.movies = data.content;
        this.totalPages = data.totalPages;
        this.currentPage = data.number;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar filmes:', err)
    });
  }

  changePage(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.loadMovies(this.isSortedByNew, newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  toggleFavoritesFilter() { // Alterado de toggleFiltroFavoritos
    this.isShowingFavoritesOnly = !this.isShowingFavoritesOnly;
    this.loadMovies();
  }

  loadFavorites() { // Alterado de carregarFavoritos
    const favs = localStorage.getItem('favorites'); // Chave no localStorage também para inglês
    this.favorites = favs ? JSON.parse(favs) : [];
  }


  toggleFavorite(movie: any) {
    if (!movie) return;

    this.authService.toggleFavorite(movie.id).subscribe({
      next: () => {
        // 1. Inverte o valor atual (se for null/undefined, vira true)
        const novoEstado = !movie.favorite && !movie.isFavorite;

        // 2. Atualizamos TODAS as variações de nome para não ter erro
        movie.favorite = novoEstado;
        movie.isFavorite = novoEstado;

        console.log("Estado atualizado para:", novoEstado);

        // 3. Força o Angular a redesenhar o componente na hora
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Erro:", err)
    });
  }

  clearFilter() {
    // 1. Avisa ao Service que o filtro de favoritos agora é FALSE
    this.authService.updateFavoritesFilter(false);
    this.authService.updateSortNewest(false)
    this.router.navigate(['/user']);
  }

  isFavorite(movie: any): boolean {
    return movie.favoritedByCurrentUser;
  }
}