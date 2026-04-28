import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuLateral } from '../../components/menu-lateral/menu-lateral';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-detalhes-filme',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuLateral],
  templateUrl: './detalhes-filme.html',
  styleUrl: './detalhes-filme.css',
})
export class DetalhesFilmeComponent implements OnInit {
  movie: any;

  constructor(private route: ActivatedRoute,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }
  ngOnInit() {
    // pega o ID da URL
    const idDaUrl = this.route.snapshot.paramMap.get('id');
    const id = Number(idDaUrl)
  
  
    if (id) {
      this.authService.getMoviesById(id).subscribe({
        next: (dados) => {
          this.movie = dados;
          this.cdr.detectChanges();
          console.log('Filme carregado no modal:', this.movie);
        },
        error: (err) => {
          console.error('Erro ao carregar filme:', err);
          this.movie = null;
          this.cdr.detectChanges();
        }
      });
    }
  }
}