import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuLateral } from '../../../components/menu-lateral/menu-lateral';
import { ActivatedRoute, RouterModule } from '@angular/router';


@Component({
  selector: 'app-filme-detalhes',
  standalone: true,
  imports: [CommonModule, MenuLateral, RouterModule],
  templateUrl: './filme-detalhes.html',
  styleUrl: './filme-detalhes.css',
})
export class FilmeDetalhesComponent implements OnInit {
  filme: any;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const idStr = this.route.snapshot.paramMap.get('id');
    const id = Number(idStr);

    const dados = localStorage.getItem('meusFilmes');
    
    if (dados) {
      const filmes = JSON.parse(dados);
      const filmeEncontrado = filmes.find((f: any) => f.id === id);

      if (filmeEncontrado) {
        this.filme = filmeEncontrado;
      } else {
        this.filme = null; 
      }
    }
  }
}