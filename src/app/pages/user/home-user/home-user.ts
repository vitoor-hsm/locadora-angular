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
  filmes: any[] = [];// Array que guarda a lista de filmes que aparece na tela
  favoritos: number[] = [];// Array de IDs dos filmes que o usuário curtiu
  
  constructor(private route: ActivatedRoute) {} 

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.carregarFilmes(params['ordem'] === 'novidades'); //toda vez que o user clica em novidades esse cod
    });// chama o carregarfav com a instrução de ordenar
    this.carregarFavoritos(); //roda apenas uma vez ao abrir a tela para buscar o que já foi curtido antes
  }

  carregarFilmes(ordenarPorNovidades: boolean = false) {
    const dados = localStorage.getItem('meusFilmes'); //Vai no "banco de dados" do navegador buscar a string de filmes
    let lista = dados ? JSON.parse(dados) : [];//Transforma essa string de volta em um objeto/array que o JavaScript entende

    if (ordenarPorNovidades) {
      lista.sort((a: any, b: any) => b.ano - a.ano);
    }//Se o parâmetro for verdadeiro, ele subtrai os anos. Se b.ano (2026) for maior que a.ano (2024), o resultado é positivo e o filme 
    this.filmes = lista; //"sobe" na lista
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
    if (this.favoritos.includes(id)) {//ja ta na lista?
      this.favoritos = this.favoritos.filter(favId => favId !== id);// se tiver remove
    } else {
      this.favoritos.push(id);// se n tiver, adc
    }
    localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
  }

  isFavorito(id: number): boolean {
    return this.favoritos.includes(id);
  }
}
