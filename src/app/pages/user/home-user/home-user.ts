import { Component, OnInit } from '@angular/core';
import { MenuLateral } from '../../../components/menu-lateral/menu-lateral';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';


@Component({
  selector: 'app-home-user',
  standalone:true,
  imports: [CommonModule,RouterModule,MenuLateral],
  templateUrl: './home-user.html',
  styleUrl: './home-user.css',
})
export class HomeUserComponent implements OnInit {
  filmes: any[] = [];
  favoritos: number[] = [];
  
  constructor(private route: ActivatedRoute) {} 

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.carregarFilmes(params['ordem'] === 'novidades'); //toda vez que o parâmetro mudar, ele decide como carregar
    });
    this.carregarFavoritos();
  }

  carregarFilmes(ordenarPorNovidades: boolean = false) {
    const dados = localStorage.getItem('meusFilmes');
    let lista = dados ? JSON.parse(dados) : [];

    if (ordenarPorNovidades) {
      lista.sort((a: any, b: any) => b.ano - a.ano);
    }
    this.filmes = lista;
  }

  carregarFavoritos() {
    const favs = localStorage.getItem('favoritos');
    this.favoritos = favs ? JSON.parse(favs) : [];
  }
  verNovidades() {
    // ordena a lista atual colocando os anos maiores (2026, 2025...) no topo
    this.filmes.sort((a: any, b: any) => b.ano - a.ano);
  }
  toggleFavorito(id: number) {
    if (this.favoritos.includes(id)) {
      this.favoritos = this.favoritos.filter(favId => favId !== id);
    } else {
      this.favoritos.push(id);
    }
    localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
  }

  isFavorito(id: number): boolean {
    return this.favoritos.includes(id);
  }
}
