import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MenuLateral } from '../../../components/menu-lateral/menu-lateral';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth';


@Component({
  selector: 'app-filme-detalhes',
  standalone: true,
  imports: [CommonModule, MenuLateral, RouterModule],
  templateUrl: './filme-detalhes.html',
  styleUrl: './filme-detalhes.css',
})
export class FilmeDetalhesComponent implements OnInit {
  movie: any;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const idStr = this.route.snapshot.paramMap.get('id');
    const id = Number(idStr);
    
    if (id) {
      this.authService.getMoviesById(id).subscribe({
        next: (dados) => {
          this.movie = dados;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erro ao carregar detalhes do filme:', err);
          this.movie = null;
          this.cdr.detectChanges();
        }
      });
    }
  }
}