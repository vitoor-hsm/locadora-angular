import { Component, OnInit } from '@angular/core';
import { MenuLateral } from '../../../components/menu-lateral/menu-lateral';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IconeComponent } from '../../../components/icone/icone';
import { ModalService } from '../../../services/modal';
import { ModalFilmeComponent } from '../../../components/modal-filme/modal-filme';



@Component({
  selector: 'app-home-user',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuLateral, IconeComponent, ModalFilmeComponent],
  templateUrl: './home-user.html',
  styleUrl: './home-user.css',
})
export class HomeUserComponent implements OnInit {
  filmes: any[] = [];// Array que guarda a lista de filmes que aparece na tela
  favoritos: number[] = [];// Array de IDs dos filmes que o usuário curtiu
  exibindoApenasFavoritos: boolean = false;
  filmeSelecionado: any;
  mostrarModalDetalhes: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService
  ) { }

  ngOnInit() {
  this.route.queryParams.subscribe(params => {
    //verifica se deve filtrar por favoritos
    this.exibindoApenasFavoritos = (params['filtro'] === 'favoritos');
    
    //verifica se deve ordenar por novidades
    const ordenarPorNovidades = (params['ordem'] === 'novidades');
    
    this.carregarFavoritos(); // crrega os IDs curtidos do localStorage
    this.carregarFilmes(ordenarPorNovidades);    // monta a lista (já filtrando se necessário)
  });
  }
  
  abrirModalDetalhes(filme: any) {
    this.filmeSelecionado = filme;
    this.mostrarModalDetalhes = true;
  }
  fecharModalDetalhes() {
    this.mostrarModalDetalhes = false;
    this.filmeSelecionado = null;
  }

  carregarFilmes(ordenarPorNovidades: boolean = false) {
    const dados = localStorage.getItem('meusFilmes'); //Vai no "banco de dados" do navegador buscar a string de filmes
    let lista = dados ? JSON.parse(dados) : [];//Transforma essa string de volta em um objeto/array

    if (ordenarPorNovidades) {
      lista.sort((a: any, b: any) => b.ano - a.ano);
    } //Se o parâmetro for verdadeiro, ele subtrai os anos. Se b.ano (2026) for maior que a.ano (2024), o resultado é positivo e o filme 

    if (this.exibindoApenasFavoritos) {
      lista = lista.filter((f: any) => this.favoritos.includes(f.id));
    }
    this.filmes = lista;
  }


  toggleFiltroFavoritos() {
    this.exibindoApenasFavoritos = !this.exibindoApenasFavoritos;
    this.carregarFilmes(); // Recarrega a lista aplicando (ou removendo) o filtro
  }

  carregarFavoritos() {
    const favs = localStorage.getItem('favoritos');
    this.favoritos = favs ? JSON.parse(favs) : [];
  }

  toggleFavorito(id: number) {
    if (this.favoritos.includes(id)) {//ja ta na lista?
      this.favoritos = this.favoritos.filter(favId => favId !== id);// se tiver remove
    } else {
      this.favoritos.push(id);// se n tiver, adc
    }
    localStorage.setItem('favoritos', JSON.stringify(this.favoritos));

    if (this.exibindoApenasFavoritos) { //pra fazer o filme sumir se tirar enquanto ta atvio
      this.carregarFilmes();
    }
  }
  limparFiltro() {
    this.router.navigate(['/user']);
  }

  isFavorito(id: number): boolean {
    return this.favoritos.includes(id);
  }
}
