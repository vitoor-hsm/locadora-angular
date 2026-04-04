import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuLateral } from '../../components/menu-lateral/menu-lateral';

@Component({
  selector: 'app-detalhes-filme',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuLateral],
  templateUrl: './detalhes-filme.html',
  styleUrl: './detalhes-filme.css',
})
export class DetalhesFilmeComponent implements OnInit{
  filme: any;

  constructor(private route: ActivatedRoute) { }
  ngOnInit() {
  // pega o ID da URL
  const idDaUrl = this.route.snapshot.paramMap.get('id');
  
  // busca os filmes no LocalStorage
  const dados = localStorage.getItem('meusFilmes');
  
  if (dados && idDaUrl) {
    const filmes = JSON.parse(dados);
    
    // tem q usar == para comparar string com número ou converter ambos
    this.filme = filmes.find((f: any) => f.id == idDaUrl);
    
    // log de teste 
    console.log('Filme encontrado:', this.filme);
  }
}
}
